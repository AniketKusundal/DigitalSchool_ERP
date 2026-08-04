const express = require("express")
const router = express.Router()

const {
  createSubject,
  getSubjectByClass,
  assignTeacher,
  unassignTeacherFromSubject ,
  getAllSubjects,
  getSingleSubject,
  updateSubject,
  getTeacherMySubjects
} = require("../controller/subject.controller");

const authMiddleware = require("../middleware/auth.middleware")
const roleMiddleware = require("../middleware/role.middleware")


router.post("/create-subject",authMiddleware,roleMiddleware("ADMIN"),createSubject);

router.put("/assign-teacher-to-subject" , authMiddleware , roleMiddleware("ADMIN") , assignTeacher)

router.get("/teacher/my-subjects",authMiddleware,roleMiddleware("TEACHER"), getTeacherMySubjects);

router.put("/unassign-teacher-from-subject/:subjectId" , authMiddleware , roleMiddleware("ADMIN") , unassignTeacherFromSubject)

router.put("/:subjectId" , authMiddleware , roleMiddleware("ADMIN") , updateSubject);

router.get("/class/:classId" , authMiddleware , getSubjectByClass) 

router.get("/all/subject" ,authMiddleware , roleMiddleware("ADMIN") , getAllSubjects)

router.get("/:subjectId" , authMiddleware , roleMiddleware("ADMIN") , getSingleSubject)



module.exports = router