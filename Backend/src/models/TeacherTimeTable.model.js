const mongoose = require("mongoose")

const TeacherTimetbleSchema = mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },

    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    day: {
      type: String,

      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],

      required: true,
    },

    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
      required: true,
    },
    classroom_no: {
      type: String,
      required: true,
    },

    note: {
      type: String,
    },
  },
  { timestamps: true },
);


const TeacherTimeTable = new mongoose.model("TeacherTimeTable" , TeacherTimetbleSchema)


module.exports = TeacherTimeTable;