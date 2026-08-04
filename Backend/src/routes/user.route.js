const express = require("express");

const {
  createTeacher,
  getAllTeacher,
  createAdmin,
  changePassword,
  getSingleTeacher,
  updateTeacher,
  deactivateTeacher,
  reactiveTeacher,
  searchTeacher,
  getTeacherStats ,
  getTeacherMyClass ,
  getMyProfile ,
  getTeacherDashboard ,
  
} = require("../controller/user.controller");

const authMiddelware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();


router.get("/me", authMiddelware, getMyProfile);

router.post("/create-teacher", authMiddelware , roleMiddleware("ADMIN") , createTeacher,);

router.post("/create-admin" , authMiddelware , roleMiddleware("SUPER_ADMIN") , createAdmin,);

// change password for logged in user
router.post("/change-password", authMiddelware, changePassword);

router.get("/teachers", authMiddelware, roleMiddleware("ADMIN"), getAllTeacher);

router.get("/teachers/search" , authMiddelware , roleMiddleware("ADMIN") , searchTeacher)

router.get("/teachers/stats" , authMiddelware , roleMiddleware("ADMIN") , getTeacherStats);

router.get("/teacher/my-class", authMiddelware , roleMiddleware("TEACHER") , getTeacherMyClass);

router.put("/teachers/:teacherId",authMiddelware,roleMiddleware("ADMIN"),upload.single("photo"),updateTeacher,);

router.put("/teachers/deactivate/:teacherId",authMiddelware,roleMiddleware("ADMIN"),deactivateTeacher);

router.put("/teachers/reactivate/:teacherId", authMiddelware , roleMiddleware("ADMIN") , reactiveTeacher);

router.get("/teachers/:teacherId", authMiddelware, roleMiddleware("ADMIN") , getSingleTeacher,);

router.get("/teacher/dashboard",authMiddelware,roleMiddleware("TEACHER") , getTeacherDashboard);



module.exports = router;