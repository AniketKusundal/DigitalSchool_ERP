const express =  require("express")
const { setFeeStructure, getAllFeeStructure , getFeeStructureOfClass, updateFeeStructure , deleteFeeStructure } = require("../controller/feeStructure.controller") 
const authMiddleware = require("../middleware/auth.middleware")
const roleMiddleware = require("../middleware/role.middleware")
const  router  = express.Router()


router.post("/setfeeStructure/:classId" , authMiddleware , roleMiddleware("ADMIN") , setFeeStructure)

router.get("/getAllFeeStructureOfClass" , authMiddleware , roleMiddleware("ADMIN") , getAllFeeStructure)

router.get("/getCLassFeeStructure/:classId" , authMiddleware , roleMiddleware("ADMIN") , getFeeStructureOfClass)

router.put("/updatefeeStructure/:feeStructureId" , authMiddleware , roleMiddleware("ADMIN") , updateFeeStructure)


router.delete("/deletefeeStructure/:feeStructureId" , authMiddleware , roleMiddleware("ADMIN") , deleteFeeStructure)

module.exports = router