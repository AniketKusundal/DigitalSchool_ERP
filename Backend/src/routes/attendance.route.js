const express = require("express")
const { markAttendance , getClassAttendance,  getStudentattendance , updateStudentAttendance , classAttendanceReport , studentAttendanceReport , getAttendanceDashboard} = require("../controller/attendance.controller")
const authMiddelware = require("../middleware/auth.middleware")
const roleMiddleware =  require("../middleware/role.middleware")

const router = express.Router()

//  To Mark The Attandace
router.post("/mark" , authMiddelware , roleMiddleware("ADMIN","TEACHER") , markAttendance)


//  update attendance route
router.put("/update/:attendanceId",authMiddelware,roleMiddleware("ADMIN", "TEACHER"), updateStudentAttendance);



// Class Attendance report
router.get("/class/:classId/report" , authMiddelware , roleMiddleware("ADMIN" ,"TEACHER") , classAttendanceReport)

//  student Attendance Reports
router.get("/student/:studentId/report", authMiddelware , roleMiddleware("ADMIN", "TEACHER") , studentAttendanceReport);


//  Attendance Dashboard Route
router.get("/dashboard", authMiddelware , roleMiddleware("ADMIN", "TEACHER") , getAttendanceDashboard);


// Get The Classwise Attendance
router.get("/class/:classId" , authMiddelware  , getClassAttendance)


// Get Student Attendance for specific student
router.get("/student/:studentId" , authMiddelware ,  getStudentattendance)





module.exports = router;