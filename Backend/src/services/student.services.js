const User = require("../models/User.model");
const Student = require("../models/Student.model");
const Class = require("../models/Class.model");


// CREATE STUDENT
const createStudentService = async (data, adminId, file) => {

 
  // FIND ADMIN
  const admin = await User.findById(adminId);

  if (!admin) 
  {
    throw new Error("Admin Not Found");
  }

 
  // CHECK SCHOOL
  if (!admin.school_id) 
  {
    throw new Error("School Not Found, Create School First");
  }

 
  // CHECK PHOTO
  if (!file) {
    throw new Error("Student Photo Is Required");
  }

  
 const existingStudent = await Student.findOne({
   school_id: admin.school_id,
   "basicInfo.aadhaar_card_no": data.basicInfo?.aadhaar_card_no,
 });

  if (existingStudent) 
  {
    throw new Error("Student Already Exists");
  }

 
  // CHECK CLASS
  if (!data.class_id) {
    throw new Error("Class Is Required");
  }

  const classExists = await Class.findById(
    data.class_id
  )

  if (!classExists) 
  {
    throw new Error("Class Not Found")  
  }

 
  // FIND LAST ROLL NUMBER

  const lastStudent = await Student.findOne({
    class_id: data.class_id,
  }).sort({
    "academicInfo.roll_number": -1,
  });

  let nextRollNumber = 1;

  if (lastStudent) {
    nextRollNumber =
      lastStudent.academicInfo.roll_number + 1;
  }


  // CREATE STUDENT OBJECT

  const studentData = {
    school_id: admin.school_id,

    class_id: data.class_id,

    // BASIC INFO

    basicInfo: {
      first_name: data.basicInfo?.first_name,
      father_name: data.basicInfo?.father_name,
      mother_name: data.basicInfo?.mother_name,
      surname: data.basicInfo?.surname,
      dob: data.basicInfo?.dob,
      gender: data.basicInfo?.gender,
      aadhaar_card_no: data.basicInfo?.aadhaar_card_no,
      student_photo: file.secure_url,
    },

    // ACADEMIC INFO

    academicInfo: {
      register_no: data.academicInfo?.register_no,
      saral_id: data.academicInfo?.saral_id,
      apaar_id: data.academicInfo?.apaar_id,
      pen: data.academicInfo?.pen,
      academic_year: data.academicInfo?.academic_year,
      roll_number: nextRollNumber,
      admission_class: data.academicInfo?.admission_class || data.class_id,
      current_class: data.class_id,
      division: data.academicInfo?.division,
      admission_date: data.academicInfo?.admission_date,
    },

    // ADDRESS

    address: {
      country: data.address?.country,
      full_address: data.address?.full_address,
      state: data.address?.state,
      district: data.address?.district,
      taluka: data.address?.taluka,
      pincode: data.address?.pincode,
    },

    // PARENTS INFO

    parents_Info: {
      father: {
        occupation: data.parents_Info?.father?.occupation,
        education: data.parents_Info?.father?.education,
        phone: data.parents_Info?.father?.phone,
        email: data.parents_Info?.father?.email,
      },

      mother: {
        occupation: data.parents_Info?.mother?.occupation,
        education: data.parents_Info?.mother?.education,
        phone: data.parents_Info?.mother?.phone,
        email: data.parents_Info?.mother?.email,
      },

      annual_income: data.parents_Info?.annual_income,
      total_children: data.parents_Info?.total_children,
      parent_aadhaar: data.parents_Info?.parent_aadhaar,
    },

    // PREVIOUS SCHOOL

    previousSchool: {
      school_name: data.previousSchool?.school_name,
      leaving_date: data.previousSchool?.leaving_date,
      previous_class: data.previousSchool?.previous_class,
      percentage: data.previousSchool?.percentage,
      obtained_marks: data.previousSchool?.obtained_marks,
      total_marks: data.previousSchool?.total_marks,
    },

    // BANK DETAILS

    bankDetails: {
      account_holder: data.bankDetails?.account_holder,
      account_no: data.bankDetails?.account_no,
      bank_name: data.bankDetails?.bank_name,
      branch: data.bankDetails?.branch,
      ifsc_code: data.bankDetails?.ifsc_code,
    },

    // OTHER DETAILS

    otherDetails: {
      religion: data.otherDetails?.religion,
      caste: data.otherDetails?.caste,
      sub_caste: data.otherDetails?.sub_caste,
      nationality: data.otherDetails?.nationality,
      mother_tongue: data.otherDetails?.mother_tongue,
      birth_place: data.otherDetails?.birth_place,
      blood_group: data.otherDetails?.blood_group,
      physically_challenged:
        data.otherDetails?.physically_challenged === true ||
        data.otherDetails?.physically_challenged === "true",
    },

    history:
      typeof data.history === "string"
        ? JSON.parse(data.history)
        : data.history || [],
  };  

//   console.log(studentData);

  const student = await Student.create(studentData);

  return student;
};


// UPDATE STUDENT 

const updateStudentService = async (studentId, data, file) => {
  const student = await Student.findById(studentId);

  if (!student) {
    throw new Error("Student Is Not Found");
  }

  // CHECK DUPLICATE AADHAAR DURING UPDATE
  if (
    data.basicInfo?.aadhaar_card_no &&
    data.basicInfo.aadhaar_card_no !== student.basicInfo.aadhaar_card_no
  ) {
    const existingStudent = await Student.findOne({
      school_id: student.school_id,
      "basicInfo.aadhaar_card_no": data.basicInfo.aadhaar_card_no,
      _id: { $ne: studentId },
    });

    if (existingStudent) {
      throw new Error("Aadhaar Number Already Exists");
    }
  }

  // Update Basic Info
  //  Basic Info
  student.basicInfo.first_name =
    data.basicInfo?.first_name ?? student.basicInfo.first_name;

  student.basicInfo.father_name =
    data.basicInfo?.father_name ?? student.basicInfo.father_name;

  student.basicInfo.mother_name =
    data.basicInfo?.mother_name ?? student.basicInfo.mother_name;

  student.basicInfo.surname =
    data.basicInfo?.surname ?? student.basicInfo.surname;

  student.basicInfo.dob = data.basicInfo?.dob ?? student.basicInfo.dob;

  student.basicInfo.gender = data.basicInfo?.gender ?? student.basicInfo.gender;

  student.basicInfo.aadhaar_card_no =
    data.basicInfo?.aadhaar_card_no ?? student.basicInfo.aadhaar_card_no;

  if (file) {
    student.basicInfo.student_photo = file.secure_url;
  }

  // UPDATE ACADEMIC INFO

  student.academicInfo.register_no =
    data.academicInfo?.register_no ?? student.academicInfo.register_no;

  student.academicInfo.saral_id =
    data.academicInfo?.saral_id ?? student.academicInfo.saral_id;

  student.academicInfo.apaar_id =
    data.academicInfo?.apaar_id ?? student.academicInfo.apaar_id;

  student.academicInfo.pen = data.academicInfo?.pen ?? student.academicInfo.pen;

  student.academicInfo.academic_year =
    data.academicInfo?.academic_year ?? student.academicInfo.academic_year;

  student.academicInfo.division =
    data.academicInfo?.division ?? student.academicInfo.division;

  student.class_id = data.class_id ?? student.class_id;

  student.academicInfo.current_class = student.class_id;

  student.academicInfo.admission_date =
    data.academicInfo?.admission_date ?? student.academicInfo.admission_date;

  // UPDATE ADDRESS
  student.address.country = data.address?.country ?? student.address.country;

  student.address.full_address =
    data.address?.full_address ?? student.address.full_address;

  student.address.state = data.address?.state ?? student.address.state;

  student.address.district = data.address?.district ?? student.address.district;

  student.address.taluka = data.address?.taluka ?? student.address.taluka;

  student.address.pincode = data.address?.pincode ?? student.address.pincode;

  student.parents_Info.father.occupation =
    data.parents_Info?.father?.occupation ??
    student.parents_Info.father.occupation;

  student.parents_Info.father.education =
    data.parents_Info?.father?.education ??
    student.parents_Info.father.education;

  student.parents_Info.father.phone =
    data.parents_Info?.father?.phone ?? student.parents_Info.father.phone;

  student.parents_Info.father.email =
    data.parents_Info?.father?.email ?? student.parents_Info.father.email;

  student.parents_Info.mother.occupation =
    data.parents_Info?.mother?.occupation ??
    student.parents_Info.mother.occupation;

  student.parents_Info.mother.education =
    data.parents_Info?.mother?.education ??
    student.parents_Info.mother.education;

  student.parents_Info.mother.phone =
    data.parents_Info?.mother?.phone ?? student.parents_Info.mother.phone;

  student.parents_Info.mother.email =
    data.parents_Info?.mother?.email ?? student.parents_Info.mother.email;

  student.parents_Info.annual_income =
    data.parents_Info?.annual_income ?? student.parents_Info.annual_income;

  student.parents_Info.total_children =
    data.parents_Info?.total_children ?? student.parents_Info.total_children;

  student.parents_Info.parent_aadhaar =
    data.parents_Info?.parent_aadhaar ?? student.parents_Info.parent_aadhaar;

  // UPDATE PREVIOUS SCHOOL
  student.previousSchool.school_name =
    data.previousSchool?.school_name ?? student.previousSchool.school_name;

  student.previousSchool.leaving_date =
    data.previousSchool?.leaving_date ?? student.previousSchool.leaving_date;

  student.previousSchool.previous_class =
    data.previousSchool?.previous_class ??
    student.previousSchool.previous_class;

  student.previousSchool.percentage =
    data.previousSchool?.percentage ?? student.previousSchool.percentage;

  student.previousSchool.obtained_marks =
    data.previousSchool?.obtained_marks ??
    student.previousSchool.obtained_marks;

  student.previousSchool.total_marks =
    data.previousSchool?.total_marks ?? student.previousSchool.total_marks;

  // UPDATE BANK DETAILS
  student.bankDetails.account_holder =
    data.bankDetails?.account_holder ?? student.bankDetails.account_holder;

  student.bankDetails.account_no =
    data.bankDetails?.account_no ?? student.bankDetails.account_no;

  student.bankDetails.bank_name =
    data.bankDetails?.bank_name ?? student.bankDetails.bank_name;

  student.bankDetails.branch =
    data.bankDetails?.branch ?? student.bankDetails.branch;

  student.bankDetails.ifsc_code =
    data.bankDetails?.ifsc_code ?? student.bankDetails.ifsc_code;

  // UPDATE OTHER DETAILS
  student.otherDetails.religion =
    data.otherDetails?.religion ?? student.otherDetails.religion;

  student.otherDetails.caste =
    data.otherDetails?.caste ?? student.otherDetails.caste;

  student.otherDetails.sub_caste =
    data.otherDetails?.sub_caste ?? student.otherDetails.sub_caste;

  student.otherDetails.nationality =
    data.otherDetails?.nationality ?? student.otherDetails.nationality;

  student.otherDetails.mother_tongue =
    data.otherDetails?.mother_tongue ?? student.otherDetails.mother_tongue;

  student.otherDetails.birth_place =
    data.otherDetails?.birth_place ?? student.otherDetails.birth_place;

  student.otherDetails.blood_group =
    data.otherDetails?.blood_group ?? student.otherDetails.blood_group;

  if (data.otherDetails?.physically_challenged !== undefined) {
    student.otherDetails.physically_challenged =
      data.otherDetails.physically_challenged === true ||
      data.otherDetails.physically_challenged === "true";
  }

  // UPDATE HISTORY
  if (data.history !== undefined) {
    student.history =
      typeof data.history === "string"
        ? JSON.parse(data.history)
        : data.history;
  }

  // SAVE STUDENT
  const updatedStudent = await student.save();

  return updatedStudent;
};


      
  // GET ALL STUDENTS
  const getAllStudentService = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User Not Found");
    }

    let filter = {
      school_id: user.school_id,
    };

    // Teacher Can Only See Assigned Class
    if (user.role === "TEACHER") {
      filter.class_id = user.assignedClass;
    }

    const students = await Student.find(filter).populate(
      "class_id",
      "class_name section",
    );

    return students;
  };


// GET SINGLE STUDENT

  const getSingleStudentService = async (studentId) => {

  const student = await Student.findById(studentId)
      .populate("class_id", "class_name section");

  if (!student) {
      throw new Error("Student Not Found");
  }
      return student;
  };


// LEAVE STUDENT
const leaveStudentService = async (studentId, reason) => {

  const student = await Student.findById(studentId);

  if (!student) {
    throw new Error("Student Not Found");
  }

  if (student.status === "LEFT") {
    throw new Error("Student Already Left");
  }

  if (!reason) {
    throw new Error("Leaving Reason Is Required");
  }

  student.status = "LEFT";

  student.leaving_reason = reason;

  student.leaving_date = new Date();

  await student.save();

  return student;
};

// STUDENT DASHBOARD STATS
const getStudentStatsService = async (userId) => {

  // FIND LOGIN USER
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User Not Found");
  }

  // CHECK SCHOOL
  if (!user.school_id) {
    throw new Error("School Not Found");
  }

  const filter = {
    school_id: user.school_id,
  };

  const totalStudents = await Student.countDocuments(filter);

  const activeStudents = await Student.countDocuments({
    ...filter,
    status: "ACTIVE",
  });

  const inactiveStudents = await Student.countDocuments({
    ...filter,
    status: "INACTIVE",
  });

  const leftStudents = await Student.countDocuments({
    ...filter,
    status: "LEFT",
  });

  const suspendedStudents = await Student.countDocuments({
    ...filter,
    status: "SUSPENDED",
  });

  const passedOutStudents = await Student.countDocuments({
    ...filter,
    status: "PASSED_OUT",
  });

  return {
    totalStudents,
    activeStudents,
    inactiveStudents,
    leftStudents,
    suspendedStudents,
    passedOutStudents,
  };
};



// SEARCH STUDENT
const searchStudentService = async (userId, keyword) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User Not Found");
  }

  if (!user.school_id) {
    throw new Error("School Not Found");
  }

  if (!keyword) {
    throw new Error("Search Keyword Is Required");
  }

  const filter = {
    school_id: user.school_id,

    $or: [
      {
        "basicInfo.first_name": {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        "basicInfo.surname": {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        "basicInfo.aadhaar_card_no": {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        "academicInfo.register_no": {
          $regex: keyword,
          $options: "i",
        },
      },
    ],
  };

  // Teacher can search only assigned class students
  if (user.role === "TEACHER") {
    filter.class_id = user.assignedClass;
  }

  const students = await Student.find(filter)
    .populate("class_id", "class_name section");

  return students;
};



// GET STUDENTS BY CLASS
const getStudentsByClassService = async (userId, classId) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User Not Found");
  }

  if (!user.school_id) {
    throw new Error("School Not Found");
  }

  const classData = await Class.findOne({
    _id: classId,
    school_id: user.school_id,
  });

  if (!classData) {
    throw new Error("Class Not Found");
  }

  // Teacher can access only assigned class
  if (
    user.role === "TEACHER" &&
    user.assignedClass?.toString() !== classId
  ) {
    throw new Error("You Are Not Allowed To Access This Class");
  }

  const students = await Student.find({
    school_id: user.school_id,
    class_id: classId,
    status: "ACTIVE",
  })
    .populate("class_id", "class_name section")
    .sort({ "academicInfo.roll_number": 1 });

  return students;
};


// SUSPEND STUDENT
const suspendStudentService = async (studentId) => {

  const student = await Student.findById(studentId);

  if (!student) {
    throw new Error("Student Not Found");
  }

  if (student.status === "SUSPENDED") {
    throw new Error("Student Already Suspended");
  }

  if (student.status === "LEFT") {
    throw new Error("Cannot Suspend Left Student");
  }

  if (student.status === "PASSED_OUT") {
    throw new Error("Cannot Suspend Passed Out Student");
  }

  student.status = "SUSPENDED";

  await student.save();

  return student;
}; 


// REACTIVATE STUDENT
const reactivateStudentService = async (studentId) => {

  const student = await Student.findById(studentId);

  if (!student) {
    throw new Error("Student Not Found");
  }

  if (student.status === "ACTIVE") {
    throw new Error("Student Is Already Active");
  }

  if (student.status === "LEFT") {
    throw new Error(
      "Student Has Left School. Use Admission Process Again."
    );
  }

  if (student.status === "PASSED_OUT") {
    throw new Error(
      "Passed Out Student Cannot Be Reactivated"
    );
  }

  student.status = "ACTIVE";

  await student.save();

  return student;
};



module.exports = {
    createStudentService ,
    updateStudentService ,
    getAllStudentService ,
    getSingleStudentService ,
    leaveStudentService ,
    getStudentStatsService ,
    searchStudentService ,
    getStudentsByClassService ,
    suspendStudentService ,
    reactivateStudentService , 
};