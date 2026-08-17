const User = require("../models/User.model");
const Student = require("../models/Student.model");
const Subject = require("../models/Subject.model");

const createTeacherService = async (body, userId) => {
  const { name, email, password } = body;

  const existing = await User.findOne({ email });

  if (existing) {
    throw new Error("Teacher Already Exist");
  }

  const admin = await User.findById(userId);

  if (!admin) {
    throw new Error("User Not Found");
  }

  if (!admin.school_id) {
    throw new Error("Create School First");
  }

  const teacher = await User.create({
    name,
    email,
    password,
    role: "TEACHER",
    designation : "Teacher" ,
    school_id: admin.school_id,
  });

  return teacher;
};

const getAllTeacherService = async (userId) => {
  const admin = await User.findById(userId);

  if (!admin) {
    throw new Error("Admin not Found");
  }

  const teachers = await User.find({
    role: "TEACHER",
    school_id: admin.school_id,
  }).select("name email");

  return teachers;
};

const createAdminService = async (body) => {
  const { name, email, password } = body;

  const existing = await User.findOne({ email });

  if (existing) {
    throw new Error("Admin Already Exist");
  }

  const admin = await User.create({
    name,
    email,
    password,
    role: "ADMIN",
    designation : "Admin"
  });

  return admin;
};



const changePasswordService = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await user.comparePassword(oldPassword);

  if (!isPasswordMatch) {
    throw new Error("Old password is incorrect");
  }

  user.password = newPassword;

  // password auto hash from pre("save")
  await user.save();

  return true;
};

const getSingleTeacherService = async (teacherId , adminId) => 
  {

  const admin = await User.findById(adminId);

  if (!admin) {
    throw new Error("Admin Not Found");
  }

  const teacher = await User.findOne({
    _id: teacherId,
    role: "TEACHER",
    school_id: admin.school_id,
  }).populate("assignedClass", "class_name section");

  if (!teacher) {
    throw new Error("Teacher Not Found");
  }

  return teacher;
};



// UPDATE TEACHER
const updateTeacherService = async (teacherId, adminId, data, file) => {
  const admin = await User.findById(adminId);

  if (!admin) {
    throw new Error("Admin Not Found");
  }

  if (!admin.school_id) {
    throw new Error("School Not Found");
  }

  const teacher = await User.findOne({
    _id: teacherId,
    role: "TEACHER",
    school_id: admin.school_id,
  });

  if (!teacher) {
    throw new Error("Teacher Not Found");
  }

  // CHECK DUPLICATE EMAIL
  if (data.email && data.email !== teacher.email) {
    const existingUser = await User.findOne({
      email: data.email,
      _id: { $ne: teacherId },
    });

    if (existingUser) {
      throw new Error("Email Already Exists");
    }

    teacher.email = data.email.trim().toLowerCase();
  }

  if (data.name && data.name.trim() !== "") 
  {
    teacher.name = data.name.trim();
  }

  if (data.phone && data.phone.trim() !== "") 
  {
    teacher.phone = data.phone.trim();
  }

  if (data.designation && data.designation.trim() !== "") 
  {
    teacher.designation = data.designation.trim();
  }

  // UPDATE PHOTO
  if (file) 
  {
    teacher.photo = file.secure_url || file.path;
  }

  await teacher.save();

  const updatedTeacher = await User.findById(teacher._id)
    .select("name email phone photo designation status assignedClass")
    .populate("assignedClass", "class_name section");

  return updatedTeacher;
};



const deactivateTeacherServices = async (teacherId , adminId) => {

  const admin = await User.findById(adminId)

  if (!admin) {
    throw new Error("Admin Not Found")
  }

  if (!admin.school_id) {
    throw new Error("School Not Found")
  }

  const teacher = await User.findOne({
    _id : teacherId ,
    role : "TEACHER" ,
    school_id : admin.school_id
  });

  if (!teacher) {
    throw new Error("Teacher Not Found")
  }

    if (teacher.status === "INACTIVE") {
      throw new Error("Teacher Already Inactive");
    }

  teacher.status = "INACTIVE";

  await teacher.save();

  return teacher;
}



const reactivateTeacherServices = async(teacherId , adminId) => {

    const admin = await User.findById(adminId)

    if (!admin) {
      throw new Error("Admin Not Found")
    }

    if (!admin.school_id) {
      throw new Error("School Not Found")
    }

    const teacher = await User.findOne({

      _id : teacherId ,
      role : "TEACHER",
      school_id : admin.school_id
    })

    if (!teacher) {
      throw new Error("Teacher Not Found")
    }

    if (teacher.status === "ACTIVE" ) {
      throw new Error("Teacher Already Active")
    }

    teacher.status = "ACTIVE"

    await teacher.save();

    return teacher
}


const searchTeacherServices = async(adminId , keyword) => {

  const admin = await User.findById(adminId) 

  if (!admin) {
    throw new Error("Admin Not Found")
  }

  if (!admin.school_id) {
    throw new Error("School Not Found")
  }


  if (!keyword || keyword.trim() === "") {
    throw new Error("Search Keyword Is Requrired")
  }


  const teachers = await User.find({
    role : "TEACHER" ,
    school_id : admin.school_id ,



    $or : [
      {
        name : {
          $regex : keyword ,
          $options : "i",
        },
      },

      {
        email : {
          $regex :keyword ,
          $options : "i",
        },
      },

      {
        phone : {
          $regex : keyword ,
          $options : "i" ,
        },
      },

      {
        designation : {
          $regex : keyword ,
          $options : "i" ,
        },
      },
    ]
  }).select("name email phone photo designation assignedClass").populate("assignedClass" , "class_name seaction")

  return teachers
}


// TEACHER STATS
const getTeacherStatsService = async (adminId) => {
  const admin = await User.findById(adminId);

  if (!admin) {
    throw new Error("Admin Not Found");
  }

  if (!admin.school_id) {
    throw new Error("School Not Found");
  }

  const filter = {
    role: "TEACHER",
    school_id: admin.school_id,
  };

  const totalTeachers = await User.countDocuments(filter);

  const activeTeachers = await User.countDocuments({
    ...filter,
    status: "ACTIVE",
  });

  const inactiveTeachers = await User.countDocuments({
    ...filter,
    status: "INACTIVE",
  });

  return {
    totalTeachers,
    activeTeachers,
    inactiveTeachers,
  };
};

const getTeacherMyClassServices = async (teacherId) => {

  const teacher = await User.findById(teacherId).select("name email role status assignedClass").populate("assignedClass" , "class_name section status")


  if (!teacher) {
    throw new Error("Teacher Not Found")
  }

  if (teacher.role !== "TEACHER") {
    throw new Error("Only Teacher Can Access")
  }

  if (teacher.status !== "ACTIVE") {
    throw new Error("Teacher Account Is Inactive")
  }


  if (!teacher.assignedClass) {
    throw new Error("No Class Assigned To This Teacher");
  }

  return teacher.assignedClass;

}

const getMyProfileService = async (userId) => {
  const user = await User.findById(userId)
    .select("-password")
    .populate("assignedClass", "class_name section status");

  if (!user) {
    throw new Error("User Not Found");
  }

  return user;
};



const getTeacherDashboardService = async (teacherId) => {
  const teacher = await User.findById(teacherId)
    .select("name email role status assignedClass school_id")
    .populate("assignedClass", "class_name section status");

  if (!teacher) {
    throw new Error("Teacher Not Found");
  }

  if (teacher.role !== "TEACHER") {
    throw new Error("Only Teacher Can Access This API");
  }

  if (teacher.status !== "ACTIVE") {
    throw new Error("Teacher Account Is Inactive");
  }

  if (!teacher.assignedClass) {
    throw new Error("No Class Assigned To This Teacher");
  }

  const totalStudents = await Student.countDocuments({
    school_id: teacher.school_id,
    class_id: teacher.assignedClass._id,
    status: "ACTIVE",
  });

  const totalSubjects = await Subject.countDocuments({
    school_id: teacher.school_id,
    teacher_id: teacherId,
    status: "ACTIVE",
  });

  return {
    teacher: {
      name: teacher.name,
      email: teacher.email,
      role: teacher.role,
    },
    assignedClass: teacher.assignedClass,
    totalStudents,
    totalSubjects,
  };
};





module.exports = {
  createTeacherService,
  getAllTeacherService,
  createAdminService,
  changePasswordService,
  getSingleTeacherService ,
  updateTeacherService , 
  deactivateTeacherServices ,
  reactivateTeacherServices ,
  searchTeacherServices ,
  getTeacherMyClassServices ,
  getTeacherStatsService ,
  getMyProfileService ,
  getTeacherDashboardService ,
 
};
