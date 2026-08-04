const express = require("express")

const { StudentIdCard, TeacherIdCard, StaffIdCard } = require("../controller/id.controller")

const authMiddleware = require("../middleware/auth.middleware")
const roleMiddleware = require("../middleware/role.middleware")

const router = express.Router()

router.get("/student/:studentId" , authMiddleware , roleMiddleware("ADMIN") , StudentIdCard)
router.get("/teacher/:teacherId" , authMiddleware , roleMiddleware("ADMIN") , TeacherIdCard)
router.get("/staff/:staffId" , authMiddleware , roleMiddleware("ADMIN") , StaffIdCard)




module.exports = router