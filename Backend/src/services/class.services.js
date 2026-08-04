const Class = require("../models/Class.model");
const User = require("../models/User.model");

// ✅ CREATE CLASS
const createClass = async (data, adminId) => {

    const class_name = data.class_name?.trim();

    const section = data.section?.trim().toUpperCase();

    const admin = await User.findById(adminId);

    if (!admin || !admin.school_id) 
    {
      throw new Error("Admin Not Found");
    }

    //  validte
    if (!class_name || !section) 
    {
      throw new Error("Class Name And Section Is Required");
    }

    const existingClass = await Class.findOne({
      class_name,

      section,

      school_id: admin.school_id,

    });

    if (existingClass) 
    {
      throw new Error("Class Already Exists");
    }

    const newClass = await Class.create({
      class_name,
      section,
      school_id: admin.school_id,
    });

    return newClass;
};


// ✅ ASSIGN Class TEACHER to Class 
const assignClassTeacher = async (classId, teacherId) => {
  
    const classData = await Class.findById(classId);

    if (!classData) 
    {
      throw new Error("Class Not Found");
    }

    if (classData.status !== "ACTIVE") {
      throw new Error("Cannot Assign Teacher To Archived Class");
    }

    const teacher = await User.findById(teacherId);

    if (!teacher || teacher.role !== "TEACHER") 
    {
      throw new Error("Invalid Teacher");
    }

    if (!teacher.school_id ||  teacher.school_id.toString() !== classData.school_id.toString()) 
    {
      throw new Error("Teacher Belongs To Another School");
    }

    if (teacher.status !== "ACTIVE") {
      throw new Error("Cannot Assign Inactive Teacher");
    }


    if (teacher.assignedClass) 
    {
      throw new Error("Teacher Already Assigned");
    }

    if (classData.classTeacher) 
    {
      throw new Error("Class Already Has a Teacher");
    }

    
    classData.classTeacher = teacherId;
    await classData.save();

    teacher.assignedClass = classId;
    await teacher.save();

    return await Class.findById(classData._id).populate("classTeacher","name email phone designation status");
};



// ✅ UNASSIGN TEACHER
const unassignClassTeacher = async (classId, adminId) => {

  const admin = await User.findById(adminId);

  if (!admin || !admin.school_id) {
    throw new Error("Admin Or School Not Found");
  }

  const classData = await Class.findOne({
    _id: classId,
    school_id: admin.school_id,
  });

  if (!classData) {
    throw new Error("Class Not Found");
  }

  if (!classData.classTeacher) {
    throw new Error("No Teacher Assigned To This Class");
  }

  const teacher = await User.findById(classData.classTeacher);

  if (!teacher) {
    throw new Error("Assigned Teacher Not Found");
  }

  classData.classTeacher = null;
  await classData.save();

  teacher.assignedClass = null;
  await teacher.save();

  return await Class.findById(classData._id)
  .populate("classTeacher", "name email phone designation status");
};





// ✅ GET ALL CLASSES 
  const getAllClass = async (user) => {

      return await Class.find({
        school_id: user.school_id,
        status: "ACTIVE",
      }).populate("classTeacher", "name email phone designation status");
      
  };

// ✅ GET SINGLE CLASS
    const getSingleClass = async (classId) => {
    const classData = await Class.findById(classId)
      .populate("classTeacher", "name email phone designation status");

    if (!classData) {
      throw new Error("Class Not Found");
    }

    return classData;
};

const updateClass = async (classId, data) => {

    const classData = await Class.findById(classId);

    if (!classData) 
    {
      throw new Error("Class Not Found");
    }

    const updatedClassName = data.class_name?.trim() || classData.class_name;

    const updatedSection =  data.section?.trim().toUpperCase() || classData.section;

    const existingClass = await Class.findOne({

      class_name: updatedClassName,
      section: updatedSection,
      school_id: classData.school_id,
      _id: { $ne: classId },

    });

    if (existingClass) 
    {
      throw new Error("Class Already Exists");
    }


    if (data.class_name) 
    {
      classData.class_name = updatedClassName;
    }

    if (data.section) 
    {
      classData.section = updatedSection;
    }

    await classData.save();

    return classData;
};


//  Delete Or Archive Class
const softDeleteClass = async(classId) => {


  const classData  = await Class.findById(classId)

  if (!classData) 
  {
    throw new Error("Class Not Found")  
  }

  if (classData.status === "ARCHIVED") 
  {
    throw new Error("Class Already Archived Or Deleted")  
  }

  classData.status = "ARCHIVED"

  await classData.save()

  return classData;
  
}

// CLASS STATS
const getClassStats = async (adminId) => {

  const admin = await User.findById(adminId);

  if (!admin) {
    throw new Error("Admin Not Found");
  }

  if (!admin.school_id) {
    throw new Error("School Not Found");
  }

  const filter = {
    school_id: admin.school_id,
  };

  const totalClasses = await Class.countDocuments(filter);

  const activeClasses = await Class.countDocuments({
    ...filter,
    status: "ACTIVE",
  });

  const archivedClasses = await Class.countDocuments({
    ...filter,
    status: "ARCHIVED",
  });

  return {
    totalClasses,
    activeClasses,
    archivedClasses,
  };
};





const searchClass = async(adminId , keyword) => {

  const admin = await User.findById(adminId);

  if (!admin) {
    throw new Error("Admin Not Found");
  }

  if (!admin.school_id) {
    throw new Error("School Not Found");
  }

  if (!keyword || keyword.trim() === "") {
    throw new Error("Search Keyword Is Required");
  }

  const classes = await Class.find({
    school_id: admin.school_id,

    $or: [
      {
        class_name: {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        section: {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        status: {
          $regex: keyword,
          $options: "i",
        },
      },
    ],
  }).populate(
    "classTeacher",
    "name email phone designation status"
  );

  return classes;
} 

module.exports = {
  createClass ,
  assignClassTeacher ,
  unassignClassTeacher ,
  getAllClass ,
  getSingleClass ,
  updateClass ,
  softDeleteClass ,
  getClassStats ,
  searchClass
};
