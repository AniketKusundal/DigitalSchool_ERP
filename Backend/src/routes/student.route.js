const express = require("express")

const {
    createStudent ,
    getAllStudent ,
    getSingleStudent ,
    leaveStudent ,
    updateStudent ,
    getStudentStats ,
    searchStudent ,
    getStudentsByClass ,
    suspendStudent ,
    reactivateStudent

} = require("../controller/student.controller")

const authMiddleware = require("../middleware/auth.middleware")
const roleMiddleware = require("../middleware/role.middleware")

const upload = require("../middleware/upload.middleware")



const router = express.Router()



router.post("/create-student" , authMiddleware , roleMiddleware("ADMIN") , upload.single("student_photo") , createStudent)

router.get("/" , authMiddleware , getAllStudent)

router.put("/update/:studentId", authMiddleware , roleMiddleware("ADMIN") , upload.single("student_photo") ,  updateStudent)

router.put("/leave-student/:studentId", authMiddleware , roleMiddleware("ADMIN"), leaveStudent);

router.put("/suspend/:studentId" , authMiddleware , roleMiddleware("ADMIN") , suspendStudent)

router.put("/reactivate/:studentId" , authMiddleware , roleMiddleware("ADMIN") , reactivateStudent);

// STUDENT STATS
router.get("/stats", authMiddleware , roleMiddleware("ADMIN"), getStudentStats);

router.get("/search", authMiddleware , searchStudent);

router.get("/class/:classId", authMiddleware, getStudentsByClass);


router.get("/:id" , authMiddleware , getSingleStudent)



module.exports = router;

