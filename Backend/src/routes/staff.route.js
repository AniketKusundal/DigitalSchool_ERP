const express = require("express")

const {createStaff, getAllStaff, getSingleStaff, UpdateStaff , DeleteStaff} = require("../controller/staff.controller")
const authMiddleware = require("../middleware/auth.middleware")
const roleMiddleware = require("../middleware/role.middleware")
const upload = require("../middleware/upload.middleware")
const router = express.Router()


router.post(
    "/create-staff" , 
    authMiddleware , 
    roleMiddleware("ADMIN")  , 
    upload.fields([
        {name : "upload_addhaar_card" , maxCount : 1},
        {name : "staff_photo" , maxCount : 1}
    ]),
    createStaff
)

router.get("/all-staff" , authMiddleware , roleMiddleware("ADMIN") , getAllStaff)

// by Id

router.get("/:id" , authMiddleware , roleMiddleware("ADMIN") , getSingleStaff)

// Update Staff

router.put("/update/:id" , authMiddleware , roleMiddleware("ADMIN") , upload.fields([
    {name : "upload_addhaar_card" , maxCount : 1} , 
    {name : "staff_photo" , maxCount : 1}
]) , UpdateStaff)



router.delete("/delete/:id" , authMiddleware , roleMiddleware("ADMIN") , DeleteStaff)

module.exports = router;

       
