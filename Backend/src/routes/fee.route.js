const express = require("express")
const { createFee } = require("../controller/fee.controller")
const authMiddleware = require("../middleware/auth.middleware")
const roleMiddleware = require("../middleware/role.middleware")
const router = express.Router()


router.post("/generate/:classId" , authMiddleware , roleMiddleware("ADMIN") , createFee)


module.exports = router