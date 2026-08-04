const Exam = require("../models/Exam.model")
const User = require("../models/User.model")
const Student = require("../models/Student.model")
const Marks = require("../models/Mark.model")


const addMarks = async ( data , userId ) => {

  
    const {student_id , class_id , subject_id , exam_id , marks , total_marks} = data;

    


    const user = await User.findById(userId)

    // check the users
    if (!user) {
        throw new Error("User Not Found")

    }

    // Only Teacher Allowed 

    if (user.role !== "TEACHER") {
        throw new Error("Only Teacher Can Add Marks")
    }

    //  chceck teacher class assigned

    if (!user.assignedClass) {
        throw new Error("Teacher Is Not Assigned To The Class")
    }

    //  Vaidate studet

    const student = await Student.findById(student_id)

    if(!student)
    {
        throw new Error("Student Not Found")
    }

    if(student.class_id.toString() !== class_id)
    {
        throw new Error("Student Is Not Assigned To The Class")
    }


    // Validate Exam

    const exam = await Exam.findById(exam_id)

    if(!exam)
    {
        throw new Error("Exam Not Found")
    }

    if(exam.class_id.toString() !== class_id)
    {
        throw new Error("Exam Is Not Belongs To The Class")
    }


    // Validate Marks Range

    if(marks < 0 || marks > 100)
    {
        throw new Error("Marks Must Be Between 0 To 100")
    }


    // prevent Duplicate Marks

    const existing =  await Marks.findOne({
        student_id,
        exam_id,
        subject_id,

    })


    if (existing) {
        throw new Error("Marks Already Added")
    }

    //  Save Marks

    const newMaks = await Marks.create({
        student_id,
        class_id,
        subject_id,
        exam_id,
        marks,
        total_marks,
        school_id : user.school_id,
        created_by : user._id
    })

    return newMaks;

}


module.exports = {
    addMarks,
}