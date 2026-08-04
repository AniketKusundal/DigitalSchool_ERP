const express = require("express")
const {TeacherTimeTable, UpdateTeacherTimeTable, DeleteTeacherLecture, GetAllLeactures, GetAllLecOfTeacher} = require("../controller/TeacherTimetable.controller")
const authMiddleware = require("../middleware/auth.middleware")
const roleMiddleware = require("../middleware/role.middleware")
const router = express.Router()



router.post("/teacher/timetable" , authMiddleware , roleMiddleware("ADMIN") ,  TeacherTimeTable)
router.put("/update-teacher-timetable/:id" , authMiddleware , roleMiddleware("ADMIN") , UpdateTeacherTimeTable)
router.delete("/delete-teacher-leacture/:id" , authMiddleware , roleMiddleware("ADMIN") , DeleteTeacherLecture)
router.get("/teacher-leactures/:id" , authMiddleware , roleMiddleware("ADMIN") , GetAllLeactures)
router.get("/all-teacher-leactures/:id" ,authMiddleware , roleMiddleware("ADMIN") , GetAllLecOfTeacher)


module.exports = router