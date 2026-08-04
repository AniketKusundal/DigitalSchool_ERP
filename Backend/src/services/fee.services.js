const Fee = require("../models/Fee.model")
const User = require("../models/User.model")
const Student = require("../models/Student.model")
const FeeStructure = require("../models/FeeStructure.model")
const Class = require("../models/Class.model")

// CREATE FEE FOR ENTIRE CLASS
const createFee = async (classId, adminId, feeData) => {

  
  // STEP 1 -> FIND ADMIN
  
  const admin = await User.findById(adminId)

  if (!admin || !admin.school_id) {
    throw new Error("Admin Not Found")
  }

  
  // STEP 2 -> CHECK ROLE
  
  if (admin.role !== "ADMIN") {
    throw new Error("Only Admin Can Add The Fee")
  }

  
  // STEP 3 -> FIND CLASS
  
  const classData = await Class.findById(classId)

  // ✅ CHANGED:
  // renamed classs -> classData for readability

  if (!classData) {
    throw new Error("Class Not Found")
  }

  
  // STEP 4 -> SECURITY CHECK
  
  if (!classData.school_id || classData.school_id.toString() !==  admin.school_id.toString()) 
    {
        throw new Error("Access Denied")
    }

  
  // STEP 5 -> GET DATA FROM BODY
  
  const {
    academic_year,
    remark,
  } = feeData

  
  // STEP 6 -> VALIDATE ACADEMIC YEAR
  
  if (!academic_year) {
    throw new Error("Academic Year Is Required")
  }

  
  // STEP 7 -> FIND FEE STRUCTURE
  
  const feeStructure =
    await FeeStructure.findOne({

      school_id: admin.school_id,

      class_id: classId,

      academic_year,
    })

  if (!feeStructure) {
    throw new Error("Fee Structure Not Found")
  }

  
  // STEP 8 -> FIND ALL ACTIVE STUDENTS
  
  const students = await Student.find({

    class_id: classId,

    school_id: admin.school_id,

    status: "ACTIVE",
  })

 
  // student -> students
  // because now class has many students

  if (students.length === 0) 
    {
        throw new Error("No Students Found In The Class")
    }

  
  // STEP 9 -> RESULT ARRAY
  
  const createdFees = []



// We need loop for all students
  // STEP 10 -> LOOP STUDENTS
  for (const student of students) {

    
    // STEP 11 -> DUPLICATE CHECK
    
    const existingFee =  await Fee.findOne({

        student_id: student._id,
        academic_year,

      })
    // moved duplicate check inside loop

    if (existingFee) 
    {
        continue // skip student if fee already exists
    }

    
    // STEP 12 -> APPLY DISCOUNT
    
    const final_fee =  feeStructure.total_fee
    // const final_fee =  feeStructure.total_fee -  (discount || 0)

    
    // STEP 13 -> DEFAULT VALUES
    
    const paid_amount = 0

    const pending_amount = final_fee

    const payment_status = "UNPAID"



    
    // STEP 14 -> CREATE FEE
    
    const fee = new Fee({

      school_id: admin.school_id,

      student_id: student._id,

      class_id: classId,

      academic_year,

      fee_structure_id : feeStructure._id,

     //   discount: discount || 0,

      paid_amount,

      pending_amount,

      payment_status ,

      due_date,

      remark,

      created_by: admin._id,
    })

    await fee.save()

    
    // STEP 15 -> PUSH RESULT
    createdFees.push(fee)
  }


  return createdFees
}

module.exports = {
  createFee,
}