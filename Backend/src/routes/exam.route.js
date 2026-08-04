const express = require("express")
const  {createExam , getAllExam , getSingleExam , updateExam} = require("../controller/exam.controller")
const authMiddleware = require("../middleware/auth.middleware")
const roleMiddleware = require("../middleware/role.middleware")
const router = express.Router()


// create Exam
router.post("/create-exam", authMiddleware , roleMiddleware("ADMIN", "TEACHER") , createExam);


// Update Exam Details
router.put("/update/:examId" , authMiddleware , roleMiddleware("ADMIN", "TEACHER") , updateExam);


// Get All The Exams
router.get("/" , authMiddleware , roleMiddleware("ADMIN" , "TEACHER") , getAllExam);


// get Single Exams
router.get("/:examId", authMiddleware , roleMiddleware("ADMIN" , "TEACHER") , getSingleExam);



module.exports = router;