const Attendance =  require('../models/Attendance.model')
const Class = require("../models/Class.model")
const User = require('../models/User.model')
const Student = require("../models/Student.model");
const getDateRange = require("../utils/dateRange.helper")

const markAttendance = async (data, userId) => {
  const { class_id, date, students } = data;

  if (!date) {
    throw new Error("Attendance Date Is Required");
  }

  const attendanceDate = new Date(date);

  if (isNaN(attendanceDate.getTime())) {
    throw new Error("Invalid Attendance Date");
  }

  attendanceDate.setHours(0, 0, 0, 0);

  if (!class_id) {
    throw new Error("Class Is Required");
  }

  const classData = await Class.findById(class_id);

  if (!classData) {
    throw new Error("Class Not Found");
  }

  if (classData.status !== "ACTIVE") {
    throw new Error("Can Not Mark Attendance Of Archived Class");
  }

  // user Validation

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

  // same school validation

  if (user.school_id.toString() !== classData.school_id.toString()) {
    throw new Error("Class Belongs To Another School");
  }

  // Teacher Access Validation
  if (user.role === "TEACHER") {
    if (
      !classData.classTeacher ||
      classData.classTeacher.toString() !== userId.toString()
    ) {
      throw new Error("You Are Not Assigned To This Class");
    }
  }

  // Only admin and teacher mark attendance
  if (!["ADMIN", "TEACHER"].includes(user.role)) {
    throw new Error("You Are Not Allowed To Mark Attendance");
  }

  //  Student Array Validation
  if (!students || !Array.isArray(students) || students.length === 0) {
    throw new Error("Student Attendance Is Required");
  }

  // DUPLICATE STUDENT CHECK
  const studentIds = students.map((item) => {
    if (!item.student_id) {
      throw new Error("Student Id Is Required");
    }

    return item.student_id.toString();
  });

  const uniqueStudentIds = new Set(studentIds);

  if (uniqueStudentIds.size !== studentIds.length) {
    throw new Error("Duplicate Students Are Not Allowed");
  }

  // FETCH STUDENTS FROM DB
  const dbStudents = await Student.find({
    _id: { $in: studentIds },
    school_id: user.school_id,
    class_id: class_id,
    status: "ACTIVE",
  });

  if (dbStudents.length !== studentIds.length) {
    throw new Error(
      "Some Students Are Invalid, Inactive, Or Not Belonging To This Class",
    );
  }

  // STATUS VALIDATION
  const allowedStatus = ["PRESENT", "ABSENT", "LEAVE"];

  for (const item of students) {
    if (!item.student_id) {
      throw new Error("Student Id Is Required");
    }

    if (!allowedStatus.includes(item.status)) {
      throw new Error("Invalid Attendance Status");
    }
  }

  // DUPLICATE ATTENDANCE CHECK
  const existing = await Attendance.findOne({
    school_id: user.school_id,
    class_id,
    date: attendanceDate,
  });

  if (existing) {
    throw new Error("Attendance Already Marked For This Day");
  }

  // CREATE ATTENDANCE
  const attendance = await Attendance.create({
    class_id,
    teacher_id: userId,
    date: attendanceDate,
    students,
    school_id: user.school_id,
  });

  return await Attendance.findById(attendance._id)
    .populate("class_id", "class_name section")
    .populate("teacher_id", "name email role")
    .populate(
      "students.student_id",
      "basicInfo.first_name basicInfo.surname academicInfo.roll_number",
    );
};


const getClassAttendance = async(classId , date , userId) => {

    if (!date) {
        throw new Error("Date Is Required")
    }

    const selectedDate =  new Date(date)

    if(isNaN(selectedDate.getTime()))
    {
        throw new Error("Invalid Attendance Date")
    }

    selectedDate.setHours(0 , 0 , 0 , 0)

    // user validation

    const user = await User.findById(userId)

    if (!user) {
        throw new Error("User Not Found")
    }

    if(user.status !== "ACTIVE")
    {
        throw new Error("User Account Is Inactive")
    }

    if(!user.school_id)
    {
        throw new Error("School Not Found")
    }

    // Class Validation

    const classData = await Class.findOne({
        
        _id : classId ,
        school_id : user.school_id
    })


    if(!classData)
    {
        throw new Error("Class Not Found")
    }

    // Teacher Access Validation

    if(user.role === "TEACHER")
    {
        if (!user.assignedClass || user.assignedClass.toString() !== classId) {
            throw new Error("You Are Not Allowed To Access This Class Attendance")
        }
    } 


    // Find Attendance

    const attendance = await Attendance.findOne({

        school_id : user.school_id ,
        class_id : classId ,
        date : selectedDate
    }).populate("class_id" ,"class_name section").populate("teacher_id" , "name email role").populate("students.student_id" , "basicInfo.first_name basicInfo.surname academicInfo.roll_number");

    return attendance;
}




const getStudentattendance = async(studentId  , userId) => {

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


    // student validation

    const student = await Student.findById(studentId)

    if (!student) {
        throw new Error("Student Not Found")
    }


    if (student.school_id.toString() !== user.school_id.toString()) {
        throw new error("Student Is Belongs To Another School")
    }


    if (user.role === "TEACHER") {
        
        if (!user.assignedClass) {
            throw new Error("No Class Assigned To Teacher")
        }


        if (user.assignedClass.toString() !== student.class_id.toString()) {
            throw new Error("Are You Not Allow To View The Student Attendance")
        }
    }


    const attendance = await Attendance.find({
        "students.student_id" : studentId ,
    }).populate("class_id" , "class_name section").populate("teacher_id" , "name email role").populate("students.student_id",
  "basicInfo.first_name basicInfo.surname academicInfo.roll_number")
   

  return attendance;
}



const updateStudentAttendance = async(attendanceId , students , userId) => {

  //  Student Array Validation 

  if (!students || !Array.isArray(students) || students.length === 0) {
    throw new Error("Student Attendance Is Required")
  }

  // User Validation

  const user = await User.findById(userId)

  if(!user)
  {
    throw new Error("User Not Found")
  }

  if(user.status !== "ACTIVE")
  {
    throw new Error("User Account Is Inactive")
  }

  if (!user.school_id) {
    throw new Error("School Not Found")
  }




  const attendance = await Attendance.findById(attendanceId)


  if (!attendance) {
    throw new Error("Attendance Is Required")
  }

  if (attendance.school_id.toString() !== user.school_id.toString()) {
    throw new Error("Attendance Belongs To Another School")
  }



  if (user.role === "TEACHER") {
    
    if (!user.assignedClass || user.assignedClass.toString() !== attendanceId.class_id.toString()) {
      throw new Error("You Are Not Allowed To Update The Attendance Of This Class")
    }
  }

  // role validation

  if(!["ADMIN" , "TEACHER"].includes(user.role))
  {
    throw new Error("You Are Not Allowed To Update Attendance")
  }


  const allowedStatus = [

    "PRESENT" ,
    "ABSENT" ,
    "LEAVE"
  ]

  // UPDATE LOOP
  for (const item of students) {

    if (!item.student_id) 
    {
      throw new Error("Student Id Is Required");
    }

    if (!allowedStatus.includes(item.status)) 
    {
      throw new Error("Invalid Attendance Status");
    }

    const attendanceStudent = attendance.students.find((student) => student.student_id.toString() === item.student_id.toString());

    if (!attendanceStudent) 
    {
      throw new Error(`Student ${item.student_id} Not Found In Attendance`);
    }

    attendanceStudent.status =  item.status;
  }

  await attendance.save();

  return await Attendance.findById(attendance._id).populate("class_id","class_name section").populate( "teacher_id","name email role").populate("students.student_id", "basicInfo.first_name basicInfo.surname academicInfo.roll_number");
}


const getClassAttendanceReport = async (classId, userId, query) => {
  // Get Date Range From Helper Function We created in the utils/dateRange.elper.js

  const { startDate, endDate } = getDateRange(query);

  // User Validation

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

  // Role Validation

  if (!["ADMIN", "TEACHER"].includes(user.role)) {
    throw new Error("You Are Not Allow To View Attendance Reports");
  }

  // Class Validation

  const classData = await Class.findOne({
    _id: classId,
    school_id: user.school_id,
  });

  if (!classData) {
    throw new Error("Class Is Not Found");
  }

  //  Teacher Can assign Only assigned Class

  if (user.role === "TEACHER") {
    if (!user.assignedClass || user.assignedClass.toString() !== classId) {
      throw new Error("You Are Not Allowed To Access This Class Report");
    }
  }

  // Fetch Atendance Record Between Dates

  const attendanceReports = await Attendance.find({
    school_id: user.school_id,
    class_id: classId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  })
    .populate("class_id", "class_name section")
    .populate("teacher_id", "name email role")
    .populate(
      "students.student_id",
      "basicInfo.first_name basicInfo.surname academicInfo.roll_number",
    )
    .sort({ date: 1 });

  return {
    period: {
      startDate,
      endDate,
    },

    class: {
      _id: classData._id,
      class_name: classData.class_name,
      section: classData.section,
    },

    totalWorkingDays: attendanceReports.length,

    records: attendanceReports,
  };
};

const getStudentAttendanceReport = async (studentId, userId, query) => {
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
    throw new Error("You Are Not Allowed To View Attendance Reports");
  }

  // STUDENT VALIDATION
  const student = await Student.findById(studentId);

  if (!student) {
    throw new Error("Student Not Found");
  }

  if (!student.class_id) {
    throw new Error("Student Is Not Assigned To Any Class");
  }

  if (student.school_id.toString() !== user.school_id.toString()) {
    throw new Error("Student Belongs To Another School");
  }

  // TEACHER ACCESS VALIDATION
  if (user.role === "TEACHER") {
    if (!user.assignedClass) {
      throw new Error("No Class Assigned To This Teacher");
    }

    if (user.assignedClass.toString() !== student.class_id.toString()) {
      throw new Error("You Are Not Allowed To Access This Student");
    }
  }

  // GET DATE RANGE
  const { startDate, endDate } = getDateRange(query);

  // FETCH ATTENDANCE RECORDS
  const records = await Attendance.find({
    school_id: user.school_id,
    class_id: student.class_id,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
    "students.student_id": studentId,
  })
    .populate("class_id", "class_name section")
    .populate("teacher_id", "name email role")
    .sort({ date: 1 });

  const workingDays = records.length;

  let presentDays = 0;
  let absentDays = 0;
  let leaveDays = 0;

  const attendanceRecords = [];

  for (const record of records) {
    const studentAttendance = record.students.find(
      (item) => item.student_id.toString() === studentId.toString(),
    );

    if (!studentAttendance) {
      continue;
    }

    if (studentAttendance.status === "PRESENT") {
      presentDays++;
    } else if (studentAttendance.status === "ABSENT") {
      absentDays++;
    } else if (studentAttendance.status === "LEAVE") {
      leaveDays++;
    }

    attendanceRecords.push({
      attendance_id: record._id,
      date: record.date,
      status: studentAttendance.status,
      markedBy: record.teacher_id,
      class: record.class_id,
    });
  }

  const attendancePercentage =
    workingDays > 0
      ? Number(((presentDays / workingDays) * 100).toFixed(2))
      : 0;

  return {
    student: {
      _id: student._id,
      name: `${student.basicInfo.first_name} ${student.basicInfo.surname}`,
      roll_number: student.academicInfo.roll_number,
      class_id: student.class_id,
    },

    period: {
      startDate,
      endDate,
    },

    summary: {
      workingDays,
      presentDays,
      absentDays,
      leaveDays,
      attendancePercentage,
    },

    records: attendanceRecords,
  };
};



const getAttendanceDasboardServices = async (userID) => {

  const user = await User.findById(userID);

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
    throw new Error("You Are Not Allowed To Access Attendance Report");
  }

  // Today Date Range

  const todayStart = new Date();

  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // current Month Date Range

  const currentYear = todayStart.getFullYear();
  const currentMonth = todayStart.getMonth();

  const monthStart = new Date(currentYear, currentMonth, 1);

  monthStart.setHours(0, 0, 0, 0);

  const monthEnd = new Date(currentYear, currentMonth + 1, 0);

  monthEnd.setHours(23, 59, 59, 999);

  // Base Filter

  const attendanceFilter = {
    school_id: user.school_id,
  };

  const studentFilter = {
    school_id: user.school_id,
    status: "ACTIVE",
  };

  // Teacher Can view Only assiged Class

  if (user.role === "TEACHER") {
    if (!user.assignedClass) {
      throw new Error("No Class Assigned To This Teacher");
    }
  }

  attendanceFilter.class_id = user.assignedClass;

  studentFilter.class_id = user.assignedClass;

  // Total Active Students

  const totalStudents = await Student.countDocuments(studentFilter);

  // Today Attendance Record

  const todayRecords = await Attendance.find({
    ...attendanceFilter,

    date: {
      $gte: todayStart,
      $lte: todayEnd,
    },
  }).select("students");

  let todayPresent = 0;
  let todayAbsent = 0;
  let todayLeave = 0;

  for (const record of todayRecords) {
    for (const student of record.students) {
      if (student.status === "PRESENT") {
        todayPresent++;
      } else if (student.status === "ABSENT") {
        todayAbsent++;
      } else if (student.status === "LEAVE") {
        todayLeave++;
      }
    }
  }

  const todayTotal = todayPresent + todayAbsent + todayLeave;

  const todayPercentage =
    todayTotal > 0 ? Number((todayPresent / todayTotal) * 100).toFixed(2) : 0;

  // MONTHLY ATTENDANCE RECORDS
  const monthlyRecords = await Attendance.find({
    ...attendanceFilter,

    date: {
      $gte: monthStart,
      $lte: monthEnd,
    },
  }).select("students");

  let monthlyPresent = 0;
  let monthlyAbsent = 0;
  let monthlyLeave = 0;

  for (const record of monthlyRecords) {
    for (const student of record.students) {
      if (student.status === "PRESENT") {
        monthlyPresent++;
      } else if (student.status === "ABSENT") {
        monthlyAbsent++;
      } else if (student.status === "LEAVE") {
        monthlyLeave++;
      }
    }
  }

  return {
    todayAttendance: {
      present: todayPresent,
      absent: todayAbsent,
      leave: todayLeave,
      total: todayTotal,
      percentage: todayPercentage,
    },

    monthlyAttendance: {
      present: monthlyPresent,
      absent: monthlyAbsent,
      leave: monthlyLeave,
      total: monthlyPresent + monthlyAbsent + monthlyLeave,
    },

    totalStudents,

    period: {
      today: {
        startDate: todayStart,
        endDate: todayEnd,
      },

      currentMonth: {
        startDate: monthStart,
        endDate: monthEnd,
      },
    },
  };
};

module.exports = {
    markAttendance ,
    getClassAttendance ,
    getStudentattendance ,
    updateStudentAttendance ,
    getClassAttendanceReport ,
    getStudentAttendanceReport ,
    getAttendanceDasboardServices
}