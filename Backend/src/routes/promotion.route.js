const express = require("express")
const {
    singlePromotionStudent , 
    multiplePromotionStudent , 
    entireClassPromotion } = require("../controller/promotion.controller")

    
const authMiddleware = require("../middleware/auth.middleware")
const roleMiddleware = require("../middleware/role.middleware")

const router = express.Router()



router.post('/singleStudentPromote/:studentId' , authMiddleware , roleMiddleware("ADMIN") , singlePromotionStudent)

router.post("/multipleStudentPromotion" ,  authMiddleware , roleMiddleware("ADMIN") , multiplePromotionStudent)

router.post("/entireClassPromote/:oldClassId" , authMiddleware , roleMiddleware("ADMIN") , entireClassPromotion)


module.exports = router