const Subject = require("../models/Subject.model")
const User =  require("../models/User.model")
const Class = require("../models/Class.model")



const createSubject = async (data, adminId) => {
  const admin = await User.findById(adminId);

  if (!admin || !admin.school_id) 
    {
    throw new Error("Invalid Admin");
  }

  const subject_name = data.subject_name?.trim();
  const subject_code = data.subject_code?.trim().toUpperCase();
  const class_id = data.class_id;

  if (!subject_name || !subject_code || !class_id) {
    throw new Error("Subject Name, Subject Code And Class Are Required");
  }

  const classData = await Class.findOne({
    _id: class_id,
    school_id: admin.school_id,
    status: "ACTIVE",
  });

  if (!classData) {
    throw new Error("Class Not Found");
  }

  const existingSubject = await Subject.findOne({
    subject_name,
    class_id,
    school_id: admin.school_id,
  });

  if (existingSubject) {
    throw new Error("Subject Already Exists In This Class");
  }

  const subject = await Subject.create({
    subject_name,
    subject_code,
    class_id,
    school_id: admin.school_id,
  });

  return subject;
};


const updateSubject = async (subjectId, adminId, data) => {

  const admin = await User.findById(adminId);

  if (!admin) {
    throw new Error("Admin Not Found");
  }

  if (!admin.school_id) {
    throw new Error("School Not Found");
  }

  const subject = await Subject.findOne({
    _id: subjectId,
    school_id: admin.school_id,
  });

  if (!subject) {
    throw new Error("Subject Not Found");
  }

  const updatedSubjectName =
    data.subject_name?.trim() || subject.subject_name;

  const updatedSubjectCode =
    data.subject_code?.trim().toUpperCase() || subject.subject_code;

  const updatedClassId =
    data.class_id || subject.class_id;

  const existingSubject = await Subject.findOne({
    subject_name: updatedSubjectName,
    class_id: updatedClassId,
    school_id: admin.school_id,
    _id: { $ne: subjectId },
  });

  if (existingSubject) {
    throw new Error("Subject Already Exists In This Class");
  }

  subject.subject_name = updatedSubjectName;
  subject.subject_code = updatedSubjectCode;
  subject.class_id = updatedClassId;

  await subject.save();

  const updatedSubject = await Subject.findById(subject._id)
    .populate("class_id", "class_name section")
    .populate("teacher_id", "name email phone designation");

  return updatedSubject;
};










const getClassSubject = async(classId) => {
    return await Subject.find({class_id : classId})
    .populate("teacher_id" , "name email")

}



const assignTeacherToSubject = async(subjectId , teacherId) => {
    
    const subject = await Subject.findById(subjectId)

    if (!subject) {
        throw new Error("Subject Not Found")
    }

    if (subject.status !== "ACTIVE") {
        throw new Error("Subject Is Inactive")
    }



    const teacher = await User.findById(teacherId);

        if (!teacher || teacher.role !== "TEACHER")
        {
            throw new Error("Invalid Teacher");
        }

        if (teacher.status !== "ACTIVE") {
            throw new Error("Teacher Is Inactive")
        }


        if (teacher.school_id.toString() !== subject.school_id.toString()) {
            throw new Error("Teacher Belongs To Another School")
        }

        if(subject.teacher_id)
        {
            throw new Error("Teacher Already Assigned To Subject")
        }


        subject.teacher_id = teacherId;

        await subject.save();

        return await Subject.findById(subject._id).populate("teacher_id" , "name email phone designation").populate("class_id" , "class_name section")

}


const unassignTeacherFromSubject = async (subjectId , adminId) => {


  const admin = await User.findById(adminId)

  if (!admin) {
    throw new Error("Admin Not Found")
  }

  if (!admin.school_id) {
    throw new Error("School Not Found")
  }


   const subject = await Subject.findOne({
     _id: subjectId,
     school_id: admin.school_id,
   });

  if (!subject) {
    throw new Error("Subject Is Not Found")
  }

 
  if (!subject.teacher_id) {
    throw new Error("No Teacher Assigned To The Subject")
  }


  subject.teacher_id = null

  await subject.save()


  return  await Subject.findById(subject._id).populate("teacher_id" , "name email phone designation").populate("class_id" , "class_name section")
  

}






const getAllSubjects = async (adminId) => {

    const admin = await User.findById(adminId)

    if (!admin) {
        throw new Error("Admin Nor Found")
    }

    if (!admin.school_id) {
        throw new Error("School Not Found")
    }


    const subjects = await Subject.find({
        school_id : admin.school_id
    }).populate("class_id", "class_name section").populate("teacher_id" , "name email phone designation")

    return subjects;  

}



const getSingleSubject = async(subjectId , adminId ) => {

    const admin = await User.findById(adminId)

    if (!admin) {
        throw new Error("Admin Not Found")
    }

    if (!admin.school_id) {
        throw new Error("School Not Found")
    }

    const subject = await Subject.findOne({
        _id : subjectId ,
        school_id : admin.school_id
    }).populate("class_id" , "class_name section").populate("teacher_id" , "name email phone designation")


    if (!subject) {
        throw new Error("Subject Not Found")
    }

    return subject

}


const getTeacherMySubjectsService = async (teacherId) => {
  const teacher = await User.findById(teacherId);

  if (!teacher) {
    throw new Error("Teacher Not Found");
  }

  if (teacher.role !== "TEACHER") {
    throw new Error("Only Teacher Can Access This API");
  }

  if (teacher.status !== "ACTIVE") {
    throw new Error("Teacher Account Is Inactive");
  }

  const subjects = await Subject.find({
    teacher_id: teacherId,
    school_id: teacher.school_id,
    status: "ACTIVE",
  })
    .populate("class_id", "class_name section status")
    .populate("teacher_id", "name email phone designation status");

  return subjects;
};




module.exports = {
    createSubject,
    getClassSubject,
    assignTeacherToSubject,
    unassignTeacherFromSubject ,
    getAllSubjects ,
    getSingleSubject , 
    updateSubject ,
    getTeacherMySubjectsService
}