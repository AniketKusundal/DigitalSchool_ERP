const express = require("express")

const authMiddleware = require("../middleware/auth.middleware")
const roleMiddleware = require("../middleware/role.middleware")
const { createPayrole, MarkAsPaid } = require("../controller/payrole.controller")

const router = express.Router()



router.post("/payrole-staff" , authMiddleware , roleMiddleware("ADMIN") , createPayrole)

router.put("/mark-salary/:id" , authMiddleware , roleMiddleware("ADMIN") , MarkAsPaid)



module.exports = router;