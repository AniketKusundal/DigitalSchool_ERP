const express = require("express")
const {addMarks} = require("../controller/marks.controller")
const authMiddleware = require("../middleware/auth.middleware")
const roleMiddleware = require("../middleware/role.middleware")


const router = express.Router()



router.post("/add-marks" , authMiddleware , roleMiddleware("TEACHER") , addMarks)




module.exports = router