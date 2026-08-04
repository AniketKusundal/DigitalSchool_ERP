const FeeStructure = require("../models/FeeStructure.model")
const User = require("../models/User.model")
const Class = require("../models/Class.model")


// SET FEE STRUCTURE FOR CLASS
const setFeeStructure = async (classId , adminId, feeData) => {



const admin = await User.findById(adminId)

if (!admin || !admin.school_id) 
{
    throw new Error("Admin Not Found")
}


if (admin.role !== "ADMIN") 
{
    throw new Error("Only Admin Can Set The Fee")
}


const classData = await Class.findById(classId)


if (!classData) 
{
    throw new Error("Class Not Found")
}




if (!classData.school_id || classData.school_id.toString() !==admin.school_id.toString()) 
{
    throw new Error("Access Denied")
}


const { academic_year, fee_structure , remark} = feeData



if (!academic_year) 
{
    throw new Error("Academic Year Is Required")
}

if (!fee_structure) 
{
    throw new Error("Fee Structure Is Required")
}




const existingFeeStructure = await FeeStructure.findOne({

  school_id: admin.school_id,

  class_id: classId,

  academic_year,

})


if (existingFeeStructure) 
{
    throw new Error("Fee Structure Already Exists")
}


// Calculate total from fee_structure
const total_fee =


(fee_structure.tuition_fee || 0) +

(fee_structure.exam_fee || 0) +

(fee_structure.transport_fee || 0) +

(fee_structure.library_fee || 0) +

(fee_structure.misc_fee || 0)



// STEP 9 -> CREATE FEE STRUCTURE



// Removed Fee model logic
// We create FeeStructure only

const newFeeStructure = new FeeStructure({


  school_id: admin.school_id,

  class_id: classId,

  academic_year,

  fee_structure,

  total_fee,

  remark ,

  created_by: admin._id, 

})


    // STEP 10 -> SAVE
    await newFeeStructure.save()



    return newFeeStructure
}



const getAllFeeStructure  = async(adminId) => {

    const admin = await User.findById(adminId)

    if(!admin || !admin.school_id)
    {
        throw new Error("Admin Not Found")
    }

    if(admin.role !== "ADMIN")
    {
        throw new Error("Only Admin Can See The All Class Fee Structure")
    }


    const getFeeStructureData =  await FeeStructure.find({
        school_id : admin.school_id ,
        isDeleted : false
    }).populate("class_id", "class_name").sort({ createdAt: -1 })

    if (getFeeStructureData.length === 0) {
        throw new Error("No Fee Structure Found")
    }


    return getFeeStructureData

}



const getFeeStructureClass = async(adminId , classId) => {

    const admin = await User.findById(adminId)

    if(!admin || !admin.school_id)
    {
        throw new Error("Admin Not Found")
    }

    if(admin.role !== "ADMIN")
    {
        throw new Error("Only Admin Can See The Fee Structure")
    }

    const classData = await Class.findById(classId) 

    if (!classData) {
        throw new Error("Class Not Found")
    }



    //  security check

    if(!classData.school_id || classData.school_id.toString() !== admin.school_id.toString())
    {
        throw new Error("Access Denied")
    }


     const feeStructureData = await FeeStructure.findOne({
        school_id : admin.school_id ,
        class_id : classId ,
        isDeleted : false ,
    }).populate("class_id" , "class_name")


  if (!feeStructureData)
    {
        throw new Error("No Fee Structure Found")
    }

    return feeStructureData

}


//  Update Fee Structure

const updateFeeStructure = async(feeStructureId , adminId  , feeData) => {

    const admin = await User.findById(adminId)

    if(!admin || !admin.school_id)
    {
        throw new Error("Admin Not Found")
    }

    // check admin role

    if(admin.role !== "ADMIN")
    {
        throw new Error("Only Admin Can Update The Fee Structure")
    }

    
    
    // check the Fee Struture Id 
    
    const feeStructureData  =  await FeeStructure.findById({
        _id : feeStructureId ,
        isDeleted : false
    })

    if (!feeStructureData) {
        throw new Error("Fee Structure Is Not Found")
    }


    // security check 

    if(!feeStructureData.school_id || feeStructureData.school_id.toString() !== admin.school_id.toString())
    {
        throw new Error("Access Denied")
    }



    const normalFields= [
        "academic_year" ,
        "remark"
    ]

    
    Object.keys(feeData).forEach((key) => {

        if(normalFields.includes(key))
        {
            feeStructureData[key] = feeData[key]
        }
    })


    const feeFields = [
      "tuition_fee",
      "exam_fee",
      "transport_fee",
      "library_fee",
      "misc_fee",
    ];

    if (feeData.fee_structure) {
      Object.keys(feeData.fee_structure).forEach((key) => {
        if (feeFields.includes(key)) {
          feeStructureData.fee_structure[key] = feeData.fee_structure[key];
        }
      });
    }

    //  Recalculate The total fee 

    feeStructureData.total_fee = Object.values(feeStructureData.fee_structure).reduce((sum , value)  => sum +( value || 0), 0) 


    await feeStructureData.save()


    return feeStructureData;


}



//  Delete The Fee Structure 

const deleteFeeStructure = async (feeStructureId , adminId) => {

    const admin = await User.findById(adminId)

    if(!admin || !admin.school_id)
    {
        throw new Error("Admin Is Not Found")
    }


    if(admin.role !== "ADMIN")
    {
        throw new Error("Only Admin Can Delete The Fee Structure")
    }

    const feeStructureData =  await FeeStructure.findOne({
        _id : feeStructureId ,
        isDeleted : false ,
    })

    if (!feeStructureData) {
        throw new Error("Fee Structure Is Not Found")
    }


    //  Security Check

    if(!feeStructureData.school_id || feeStructureData.school_id.toString() !== admin.school_id.toString())
    {
        throw new Error("Access Denied")
    }

    feeStructureData.isDeleted = true 
    feeStructureData.deletedAt  = new Date()
    await feeStructureData.save()
    return feeStructureData
}


module.exports = {
    setFeeStructure ,
    getAllFeeStructure , 
    getFeeStructureClass ,
    updateFeeStructure , 
    deleteFeeStructure ,
}
