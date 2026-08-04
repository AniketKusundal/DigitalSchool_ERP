const express = require("express")
const { Login , changePassword } = require("../controller/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")
const router = express.Router()



router.post("/login" , Login)
router.post("/change-password", authMiddleware , changePassword);


module.exports = router;