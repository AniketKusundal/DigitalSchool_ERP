const mongoose = require("mongoose")


const ExamSchema = new mongoose.Schema ({

    exam_name : {
        type : String,
        required : true,
        maxlength: 100,
        trim : true,
    },

    exam_type : {
        type : String,
        enum: ["MID_TERM" , "CLASS_TEST" , "SURPRISE_TEST" , "FINAL" , "UNIT_TEST"],
        required : true,
    },

    subject_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref :"Subject",
        required : true,
    },  

    

    class_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Class",
        required : true,
    },

    school_id :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "School",
        required : true,
    },


    created_by : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User",
        required : true,
    },

    exam_date : {
        type : Date ,
        required : true
    },

    start_time : {
        type : String ,
        required : true
    },

    end_time : {
        type : String ,
        required : true ,
    },

    total_marks : {
        type : Number ,
        required : true ,
        min : 1
    },

    passing_marks : {
        type : Number ,
        required : true ,
        min : 0 ,
    },

    academic_year : {
        type : String ,
        required : true ,
        trim : true
    },

    instructions : {
        type : String ,
        trim : true ,
        maxlength: 1000,
        default :"" ,
    },

    status : {
        type : String ,
        enum : ["SCHEDULED" , "ONGOING" , "COMPLETED" , "CANCELLED"] ,
        default : "SCHEDULED"
    },


}, {timestamps : true})





ExamSchema.pre("validate", function () {
  if (
    this.passing_marks !== undefined &&
    this.total_marks !== undefined &&
    this.passing_marks > this.total_marks
  ) {
    throw new Error(
      "Passing Marks Cannot Be Greater Than Total Marks"
    );
  }
});

//  Prevent Duplicate Exam
ExamSchema.index({
  school_id: 1,
  class_id: 1,
  subject_id: 1,
  exam_date: 1,
  start_time: 1,
});


// Query-performance indexes
ExamSchema.index({
  school_id: 1,
  exam_date: 1,
});

ExamSchema.index({ 
  school_id: 1,
  class_id: 1,
  exam_date: 1,
});

ExamSchema.index({
  school_id: 1,
  created_by: 1,
  exam_date: 1,
});

ExamSchema.index({
  school_id: 1,
  status: 1,
});


const Exam = mongoose.model("Exam" , ExamSchema)

module.exports = Exam;