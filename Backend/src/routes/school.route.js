const express = require("express")
const {createSchool , updateSchoolData , getSchoolData} = require("../controller/school.controller")
const authMiddleware = require("../middleware/auth.middleware")
const roleMiddleware = require("../middleware/role.middleware")
const upload = require("../middleware/upload.middleware")

const router = express.Router()

router.post("/create" ,  authMiddleware ,  roleMiddleware("ADMIN") , upload.single('logo') ,  createSchool)

router.put("/update-school" , authMiddleware , roleMiddleware("ADMIN") , upload.single('logo') , updateSchoolData)


router.get("/getSchoolData" , authMiddleware , roleMiddleware("ADMIN") , getSchoolData)

module.exports = router;
