const express = require("express")

const {
  createClass,
  assignClassTeacher, 
  unassignClassTeacher ,
  getAllClass,
  getSingleClass,
  updateClass,
  softDeleteClass, 
  getClassStats,
  searchClass

} = require("../controller/class.controller");

const authMiddelware = require("../middleware/auth.middleware")
const roleMiddleware = require("../middleware/role.middleware");
const router = express.Router()


// Create Class
router.post("/create" , authMiddelware , roleMiddleware("ADMIN"), createClass)

// Assign teacher to class
router.put("/assign-class-teacher-to-class" , authMiddelware , roleMiddleware("ADMIN") , assignClassTeacher)

// Unassign teacher to class
router.put("/unassign-class-teacher/:classId",authMiddelware,roleMiddleware("ADMIN"), unassignClassTeacher);


// Get All The Class
router.get("/" , authMiddelware , roleMiddleware("ADMIN") , getAllClass)


// Total Stastics OF The Clas OF the School , Active Class , Archive Class 
router.get("/stats" , authMiddelware , roleMiddleware("ADMIN") , getClassStats);


// Search Class
router.get("/search", authMiddelware , roleMiddleware("ADMIN") , searchClass);


// Update Class Deatils
router.put("/updateClass/:classId" , authMiddelware , roleMiddleware("ADMIN")  , updateClass)

// Delete Class or Soft Delete Archive=
router.put("/deactivateClass/:classId" , authMiddelware , roleMiddleware("ADMIN") , softDeleteClass)

// Get Class by Id
router.get("/:id" , authMiddelware  , getSingleClass)


module.exports = router;