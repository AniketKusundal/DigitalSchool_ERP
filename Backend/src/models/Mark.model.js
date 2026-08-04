const mongoose = require("mongoose")


const MarkSchema = mongoose.Schema({



    student_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Student",
        required : true,
    },



    class_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Class",
        required : true,
    },

    subject_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Subject",
        required : true,
    },

    exam_id  : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Exam",
        required : true,
    },

    marks : {
        type : Number,
        required : true,
    },

    total_marks : {
        type : Number,
        required : true,
    },

    school_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "School",
        required : true,

    },

    created_by : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },


} , {timestamps : true})


// prevent duplicate

MarkSchema.index(
    {student_id : 1 , subject_id : 1 , exam_id : 1} , 
    { unique : true}
)

const Marks = new mongoose.model("Mark" , MarkSchema)

module.exports = Marks;