const Student = require("../models/Student.model");
const User = require("../models/User.model");
const Class = require("../models/Class.model");

// ==========================================
// PROMOTE SINGLE STUDENT
// ==========================================

const promoteSingleStudent = async (studentId, newClassId, result, adminId) => {
 

  const admin = await User.findById(adminId);

  if (!admin || !admin.school_id) {
    throw new Error("Admin Not Found");
  }

  // ==========================================
  // CHECK ROLE
  // ==========================================

  if (admin.role !== "ADMIN") {
    throw new Error("Only Admin Can Promote Student");
  }

  // ==========================================
  // FIND STUDENT
  // ==========================================

  const student = await Student.findById(studentId);

  if (!student) {
    throw new Error("Student Not Found");
  }

  // ==========================================
  // SECURITY CHECK
  // ==========================================

  if (student.school_id.toString() !== admin.school_id.toString()) {
    throw new Error("Access Denied");
  }

  // ==========================================
  // CHECK STUDENT STATUS
  // ==========================================

  if (student.status !== "ACTIVE") {
    throw new Error("Only Active Students Can Be Promoted");
  }

  // ==========================================
  // FIND NEW CLASS
  // ==========================================

  const newClass = await Class.findById(newClassId);

  if (!newClass) {
    throw new Error("New Class Not Found");
  }

  // ==========================================
  // SAVE HISTORY
  // ==========================================

  student.history.push({
    class_id: student.class_id,

    academic_year: student.academicInfo.academic_year,

    result: result,
  });

  // ==========================================
  // FAILED STUDENT STAYS IN SAME CLASS
  // ==========================================

  if (result === "FAIL") {
    await student.save();

    return {
      Message: "Student Failed And Remains In Same Class",

      student,
    };
  }

  // ==========================================
  // FIND LAST ROLL NUMBER
  // ==========================================

  const lastStudent = await Student.findOne({
    class_id: newClassId,
  }).sort({
    "academicInfo.roll_number": -1,
  });

  // ==========================================
  // DEFAULT ROLL NUMBER
  // ==========================================

  let nextRollNumber = 1;

  // ==========================================
  // GENERATE NEXT ROLL NUMBER
  // ==========================================

  if (lastStudent) {
    nextRollNumber = lastStudent.academicInfo.roll_number + 1;
  }

  // ==========================================
  // UPDATE STUDENT CLASS
  // ==========================================

  student.class_id = newClassId;

  student.academicInfo.current_class = newClassId;

  student.academicInfo.roll_number = nextRollNumber;

  // ==========================================
  // SAVE STUDENT
  // ==========================================

  await student.save();

  // ==========================================
  // RETURN RESPONSE
  // ==========================================

  return {
    Message: "Student Promoted Successfully",

    student,
  };
};

// ==========================================
// PROMOTE MULTIPLE STUDENTS
// ==========================================

const promoteMultipleStudents = async (
  studentIds,
  newClassId,
  result,
  adminId,
) => {
  // ==========================================
  // CHECK STUDENT IDS
  // ==========================================

  if (!studentIds || studentIds.length === 0) {
    throw new Error("No Students Selected");
  }

  // ==========================================
  // RESULT ARRAY
  // ==========================================

  const promotedStudents = [];

  // ==========================================
  // LOOP ALL STUDENTS
  // ==========================================

  for (const studentId of studentIds) {
    try {
      // ==========================================
      // CALL SINGLE PROMOTION
      // ==========================================

      const promotedStudent = await promoteSingleStudent(
        studentId,

        newClassId,

        result,

        adminId,
      );

      // ==========================================
      // SUCCESS RESPONSE
      // ==========================================

      promotedStudents.push({
        studentId,

        success: true,

        data: promotedStudent,
      });
    } catch (error) {
      // ==========================================
      // FAILED RESPONSE
      // ==========================================

      promotedStudents.push({
        studentId,

        success: false,

        error: error.message,
      });
    }
  }

  // ==========================================
  // RETURN FINAL RESULT
  // ==========================================

  return promotedStudents;
};



const promoteEntireClass = async (oldClassId, newClassId, result, adminId) => {
  

  const admin = await User.findById(adminId);

  if (!admin || !admin.school_id) {
    throw new Error("Admin Not Found");
  }

 

  if (admin.role !== "ADMIN") {
    throw new Error("Only Admin Can Promote Entire Class");
  }

  
  // FIND ACTIVE STUDENTS


  const students = await Student.find({
    class_id: oldClassId,

    school_id: admin.school_id,

    status: "ACTIVE",
  });



  if (students.length === 0) {
    throw new Error("No Active Students Found");
  }


  const promotedStudents = [];


  // LOOP ALL STUDENTS


  for (const student of students) {
    try {
  

      const promotedStudent = await promoteSingleStudent(
        student._id,

        newClassId,

        result,

        adminId,
      );

 

      promotedStudents.push({
        studentId: student._id,

        studentName: student.basicInfo.first_name,

        success: true,

        data: promotedStudent,
      });
    } catch (error) {
      

      promotedStudents.push({
        studentId: student._id,

        studentName: student.basicInfo.first_name,

        success: false,

        error: error.message,
      });
    }
  }



  return promotedStudents;
};



module.exports = {

  promoteSingleStudent,
  promoteMultipleStudents,
  promoteEntireClass,
};
