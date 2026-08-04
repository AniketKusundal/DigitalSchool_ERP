const mongoose = require("mongoose")


const AttendanceSchema = mongoose.Schema({

    class_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Class",
        required : true,
    },

    teacher_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },


    date : {
        type : Date,
        required : true,
    },

    students : [
    {
        student_id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Student"
        },

        status : {
            type : String,
            enum : ["PRESENT" , "ABSENT" , "LEAVE"],
            default : "PRESENT"
        }
    }
    ],

    school_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "School",
        required : true,
    }


} , {timestamps : true})



//  Prevent Duplicate Attendance

AttendanceSchema.index (

    {school_id : 1 , class_id : 1 , date : 1},
    {unique : true}
);

const Attendance = new mongoose.model("Attendance" , AttendanceSchema)

module.exports = Attendance;
