const mongoose = require("mongoose")


const SubjectSchema = mongoose.Schema({


    subject_name : {
        type : String,
        required : true,
        trim : true,
    },

    subject_code : {
        type : String,
        required : true,
        trim : true ,
        uppercase : true ,
    },

    class_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Class",
        required : true,
    },

    school_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "School",
        required : true,
    },

    teacher_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        default : null
    },

    status : {
        type : String ,
        enum : ["ACTIVE" , "INACTIVE"] ,
        default : "ACTIVE"
    }


}, {timestamps : true})


SubjectSchema.index(
    {
        subject_name :  1,
        class_id : 1 ,
        school_id : 1
    },
    {
        unique : true
    }
)



const Subject = new mongoose.model("Subject" , SubjectSchema)

module.exports = Subject;