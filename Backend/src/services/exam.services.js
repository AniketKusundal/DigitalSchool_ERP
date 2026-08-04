const Exam = require("../models/Exam.model");
const User = require("../models/User.model");
const Class = require("../models/Class.model");
const Subject = require("../models/Subject.model");



// CREATE EXAM SERVICES
const createExamServices = async (data, userId) => {

  const {
    exam_name,
    exam_type,
    subject_id,
    class_id,
    exam_date,
    start_time,
    end_time,
    total_marks,
    passing_marks,
    academic_year,
    instructions,
  } = data;

  // USER VALIDATION
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User Not Found");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("User Account Is Inactive");
  }

  if (!user.school_id) {
    throw new Error("School Not Found");
  }

  if (!["ADMIN", "TEACHER"].includes(user.role)) {
    throw new Error("You Are Not Allowed To Create Exam");
  }

  // REQUIRED FIELDS
  if (
    !exam_name ||
    !exam_type ||
    !subject_id ||
    !class_id ||
    !exam_date ||
    !start_time ||
    !end_time ||
    total_marks === undefined ||
    passing_marks === undefined ||
    !academic_year
  ) {
    throw new Error("All Required Exam Fields Must Be Provided");
  }

  // CLASS VALIDATION
  const classData = await Class.findOne({
    _id: class_id,
    school_id: user.school_id,
  });

  if (!classData) {
    throw new Error("Class Not Found");
  }

  if (classData.status !== "ACTIVE") {
    throw new Error("Cannot Create Exam For Archived Class");
  }

  // SUBJECT VALIDATION
  const subject = await Subject.findOne({
    _id: subject_id,
    school_id: user.school_id,
  });

  if (!subject) {
    throw new Error("Subject Not Found");
  }

  if (subject.status !== "ACTIVE") {
    throw new Error("Cannot Create Exam For Inactive Subject");
  }

  if (subject.class_id.toString() !== class_id.toString()) {
    throw new Error("Subject Does Not Belong To Selected Class");
  }

  // TEACHER ACCESS
  if (user.role === "TEACHER") {
    if (!user.assignedClass) {
      throw new Error("No Class Assigned To This Teacher");
    }

    if (user.assignedClass.toString() !== class_id.toString()) {
      throw new Error(
        "You Can Create Exam Only For Your Assigned Class"
      );
    }

    if (!subject.teacher_id) {
      throw new Error("No Teacher Assigned To This Subject");
    }

    if (subject.teacher_id.toString() !== userId.toString()) {
      throw new Error(
        "You Can Create Exam Only For Your Assigned Subject"
      );
    }
  }

  // DATE VALIDATION
  const examDate = new Date(exam_date);

  if (Number.isNaN(examDate.getTime())) {
    throw new Error("Invalid Exam Date");
  }

  examDate.setHours(0, 0, 0, 0);

  // TIME VALIDATION
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!timeRegex.test(start_time)) {
    throw new Error("Start Time Must Be In HH:mm Format");
  }

  if (!timeRegex.test(end_time)) {
    throw new Error("End Time Must Be In HH:mm Format");
  }

  if (end_time <= start_time) {
    throw new Error("End Time Must Be After Start Time");
  }

  // MARKS VALIDATION
  const totalMarks = Number(total_marks);
  const passingMarks = Number(passing_marks);

  if (Number.isNaN(totalMarks) || totalMarks < 1) {
    throw new Error("Total Marks Must Be At Least 1");
  }

  if (Number.isNaN(passingMarks) || passingMarks < 0) {
    throw new Error("Passing Marks Cannot Be Negative");
  }

  if (passingMarks > totalMarks) {
    throw new Error(
      "Passing Marks Cannot Be Greater Than Total Marks"
    );
  }

  // ACADEMIC YEAR VALIDATION
  const academicYearPattern = /^\d{4}-\d{4}$/;

  if (!academicYearPattern.test(academic_year)) {
    throw new Error(
      "Academic Year Must Be In YYYY-YYYY Format"
    );
  }

  const [startYear, endYear] = academic_year
    .split("-")
    .map(Number);

  if (endYear !== startYear + 1) {
    throw new Error(
      "Academic Year Must Contain Consecutive Years"
    );
  }

  // EXACT DUPLICATE CHECK
  const duplicateExam = await Exam.findOne({
    school_id: user.school_id,
    class_id,
    subject_id,
    exam_date: examDate,
    start_time,
    end_time,
    status: { $ne: "CANCELLED" },
  });

  if (duplicateExam) {
    throw new Error(
      "This Exam Is Already Scheduled At The Same Date And Time"
    );
  }

  // CLASS TIME-CONFLICT CHECK
  // Subject is intentionally not included.
  // Different subjects cannot overlap for the same class.
  const conflictingExam = await Exam.findOne({
    school_id: user.school_id,
    class_id,
    exam_date: examDate,
    status: { $ne: "CANCELLED" },

    start_time: {
      $lt: end_time,
    },

    end_time: {
      $gt: start_time,
    },
  });

  if (conflictingExam) {
    throw new Error(
      `Another Exam Is Already Scheduled For This Class From ${conflictingExam.start_time} To ${conflictingExam.end_time}`
    );
  }

  // CREATE EXAM
  const exam = await Exam.create({
    exam_name: exam_name.trim(),
    exam_type,
    subject_id,
    class_id,
    school_id: user.school_id,
    created_by: userId,
    exam_date: examDate,
    start_time,
    end_time,
    total_marks: totalMarks,
    passing_marks: passingMarks,
    academic_year: academic_year.trim(),
    instructions: instructions?.trim() || "",
    status: "SCHEDULED",
  });

  return await Exam.findById(exam._id)
    .populate(
      "class_id", 
      "class_name section status"
    )
    .populate(
      "subject_id",
      "subject_name subject_code status"
    )
    .populate(
      "created_by",
      "name email role designation"
    );
};


// Get All Exam Services
const getAllExamService = async(userId , query) => {

  const {
    page = 1 ,
    limit = 10 ,
    status ,
    exam_type ,
    class_id ,
    subject_id ,
    academic_year ,
    startDate ,
    endDate ,
  }  = query; 



  const user = await User.findById(userId)
  
  if (!user) {
    throw new Error("User Not Found")
  }

  if (user.status !== "ACTIVE") {
    throw new Error("User Account Is Inactive")
  }

  if (!user.school_id) {
    throw new Error("School Not Found")
  }

  if (!["ADMIN", "TEACHER"].includes(user.role)) {
    throw new Error("You Are Not Allowed To Access Exams");
  }

  const filter = {
    school_id: user.school_id,
  };

  //  Teacher Restriactions

  if (user.role === "TEACHER") {
    
    const teacherSubject = await Subject.find({
      teacher_id : userId ,
    }).select("_id")


    const subjectId = teacherSubject.map(
      (subject) => subject.map
    );


    filter.subject_id = {
      $in : subjectId,
    }
  }


  // Filters

  if (status) {
    filter.status = status;
  }

  if (exam_type) {
    filter.exam_type = exam_type;    
  }

  if (class_id) {
    filter.class_id = class_id;
  }

  if (subject_id) {
    filter.subject_id = subject_id;
  }

  if (academic_year) {
    filter.academic_year = academic_year;
  }

  // Date Filter 

  if (startDate || endDate) {
    filter.exam_date = {};

    if (startDate) {
      filter.exam_date.$gte = new Date(startDate);
    }

    if (endDate) {
      filter.exam_date.$lte = new Date(endDate);
    }
  }


  //  Pegination 

  const pageNumber =  Number(page)
  const limitNumber = Number(limit)

  const skip = (pageNumber - 1) * limitNumber;

  // Total Count 

  const totalExam =   await Exam.countDocuments(filter)

  // GET EXAM

  const exams = await Exam.find(filter)
  .populate("class_id" , "class_name seaction")
  .populate("subject_id" , "subject_name subject_code")
  .populate("created_by" , "name email role").sort({
    exam_date : -1,
    exam_time : 1,
  })
  .skip(skip)
  .limit(limitNumber);


  return {

    totalExam ,
    currentPage : pageNumber ,
    totalPages : Math.ceil(totalExam / limitNumber) ,
    exams ,
  }

}

// GET THE SINGLE EXAM
const getSingleExamService = async (examId , userId) => {

  const user = await User.findById(userId)


  if (!user) {
    throw new Error("User Not Found");
  }

  if (user.status !== "ACTIVE") 
  {
    throw new Error("User Account Is Inactive")
  }

  if (!user.school_id) {
    throw new Error("School Not Found")
  }

  if (!["ADMIN" , "TEACHER"].includes(user.role)) {
    throw new Error("You Are Not Allowed To Access Exams")
  }


  const exam = await Exam.findOne({
    _id : examId ,
    school_id : user.school_id ,
  })
  .populate("class_id" , "class_name section")
  .populate("subject_id" , "subject_name subject_code")
  .populate("created_by" , "name email role")



  if (!exam) {
    throw new Error("Exam Not Found")
  }


  // Teacher Restriactions

  if (user.role === "TEACHER") {
    if (exam.subject_id.toString() !== userId.toString()) {
      throw new Error("You Are Not Allowed To Access This Exam")
    }
  }

  return exam;
}

// UPDATE EXAM
const updateExamServices = async (examId, data, userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User Not Found");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("User Account Inactive");
  }

  if (!user.school_id) {
    throw new Error("School Not Found");
  }

  if (!["ADMIN", "TEACHER"].includes(user.role)) {
    throw new Error("You Are Not Allowed To Update Exams");
  }

  // Find Exam For Same School
  const exam = await Exam.findOne({
    _id: examId,
    school_id: user.school_id,
  });

  if (!exam) {
    throw new Error("Exam Not Found");
  }

  if (exam.status === "CANCELLED") {
    throw new Error("Completed Exam Can Not Be Update");
  }

  if (user.role === "TEACHER") {
    const subject = await Subject.findOne({
      _id: exam.subject_id,
      school_id: user.school_id,
      teacherId: userId,
      subject: "ACTIVE",
    });

    if (!subject) {
      throw new Error("You Are Not Allowed To Update The Exam");
    }

    if (
      user.assignedClass &&
      user.assignedClass.toString() !== exam.class_id.toString()
    ) {
      throw new Error("You Can Update Exam Only Your Assigned Class");
    }
  }

  // PROTECTED FEILDS

  const protecetedFeilds = [
    "school_id",
    "created_by",
    "class_id",
    "subject_id",
    "status",
  ];

  const protecetedFeildsProvided = protecetedFeilds.find(
    (field) => data[field] !== undefined,
  );

  if (protecetedFeildsProvided) {
    throw new Error(
      `${protecetedFeildsProvided} Can Not Be Updated From This API`,
    );
  }

  // CHECK WHETHER ALLOWED FEILDS IS PROVIDED

  const allowedFeilds = [
    "exam_time",
    "exam_type",
    "exam_date",
    "exam_time",
    "end_date",
    "total_marks",
    "passing_marks",
    "academic_year",
    "instructions",
  ];

  const providedFeilds = allowedFeilds.filter(
    (fields) => data[fields] !== undefined,
  );

  if (protecetedFeilds.length === 0) {
    throw new Error("Please Provide Atleast One Field To Update");
  }

  //  EXAM NAME VALIDATION
  if (data.exam_name !== undefined) {
    if (typeof data.exam_name !== "string" || !data.exam_name.trim()) {
      throw new Error("Exam Name Is Required");
    }

    exam.exam_name = data.exam_name.trim();
  }

  // EXAM TYPE VALIDATION
  if (data.exam_type !== undefined) {
    const allowedExamTypes = [
      "MID_TERM",
      "CLASS_TEST",
      "SURPRISE_TEST",
      "FINAL",
      "UNIT_TEST",
    ];

    if (!allowedExamTypes.includes(data.exam_type)) {
      throw new Error("Invalid Exam Tyype");
    }

    exam.exam_type = data.exam_type;
  }

  //  USE NEW VALUE FOR EXISTING VALUE
  let updateExamDate = exam.exam_date;
  let updateStartTime = exam.start_time;
  let updateEndTime = exam.end_time;
  let updateTotalMarks = exam.total_marks;
  let updatePassingMarks = exam.passing_marks;

  // Date Validation
if (data.exam_date !== undefined) {
  const parsedExamDate = new Date(data.exam_date);

  if (Number.isNaN(parsedExamDate.getTime())) {
    throw new Error("Invalid Exam Date");
  }

  parsedExamDate.setHours(0, 0, 0, 0);

  updateExamDate = parsedExamDate;
}

  // TIME VALIDATION
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (data.start_time !== undefined) {
    if (
      typeof data.start_time !== "string" ||
      !timeRegex.test(data.start_time)
    ) {
      throw new Error("Start Time Must Been In The HH:mm Format");
    }
    updateStartTime = data.start_time;
  }

  if (data.end_time !== undefined) {
    if (typeof data.end_time !== "string" || !timeRegex.test(data.end_time)) {
      throw new Error("End Time Must Been In The HH:mm Format");
    }

    updateEndTime = data.end_time;
  }

  if (updateEndTime <= updateStartTime) {
    throw new Error("End Time Must Be After The Start Time");
  }

  //  Total Marks Validations
  if (data.total_marks !== undefined) {
    updateTotalMarks = Number(data.total_marks);

    if (isNaN(updateTotalMarks) || updateTotalMarks < 1) {
      throw new Error("Total Marks Must Be Atleast 1");
    }
  }

  // PASSING MARKS
  if (data.passing_marks !== undefined) {
    updatePassingMarks = Number(data.passing_marks);

    if (isNaN(updatePassingMarks) || updatePassingMarks < 0) {
      throw new Error("Passing Marks Cannot Be Negative");
    }
  }

  if (updatePassingMarks > updateTotalMarks) {
    throw new Error("Passing Marks Can Not Be Greater Than Total Marks");
  }

  // ACADEMIC YEAR VALIDATION

  if (data.academic_year !== undefined) {
    if (typeof data.academic_year !== "string") {
      throw new Error("Academic Year Must Be In YYYY-YYYY Format");
    }

    const academicYear = data.academic_year.trim();

    const academicYearPattern = /^\d{4}-\d{4}$/;

    if (!academicYearPattern.test(academicYear)) {
      throw new Error("Academic Year Must Be In Format Of YYYY-YYYY Format");
    }

    const [startYear, endYear] = academic_year.split("-").map(Number);

    if (endYear !== startYear + 1) {
      throw new Error("Academic Year Must Contain Consecutive Years");
    }

    exam.academic_year = academicYear;
  }

  // INSTRUCTIONS VALIDATIONS

  if (data.instructions !== undefined) {
    if (typeof data.instructions !== "string") {
      throw new Error("Instructions Must Be Text");
    }

    exam.instructions = data.instructions.trim();
  }

  // TIME CONFLICT CHECK
const conflictingExam = await Exam.findOne({
  _id: {
    $ne: examId,
  },

  school_id: user.school_id,

  class_id: exam.class_id,

  exam_date: updateExamDate,

  status: {
    $ne: "CANCELLED",
  },

  start_time: {
    $lt: updateEndTime,
  },

  end_time: {
    $gt: updateStartTime,
  },
});

  if (conflictingExam) {
    throw new Error(
      `Another Exam Is Already Scheduled For This Class From ${conflictingExam.start_time} To ${conflictingExam.end_time}`,
    );
  }

  // ASSIGN FINAL VALUES
  exam.exam_date = updateExamDate;
  exam.start_time = updateStartTime;
  exam.end_time = updateEndTime;
  exam.total_marks = updateTotalMarks;
  exam.passing_marks = updatePassingMarks;

  // SAVE UPDATED EXAM
  await exam.save();

  // POPULATED RESPONSE
  return await Exam.findById(exam._id)
    .populate("class_id", "class_name section status")
    .populate("subject_id", "subject_name subject_code status teacher_id")
    .populate("created_by", "name email role designation");
};




module.exports = {
  createExamServices ,
  getAllExamService ,
  getSingleExamService ,
  updateExamServices
};