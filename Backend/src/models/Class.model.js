const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema(
  {
    class_name: {
      type: String,
      required: true,
      trim: true,
    },

    section: {
      type: String ,
      required: true,
      trim: true,
      uppercase : true ,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "ARCHIVED"],
      default: "ACTIVE",
    },
 
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },

    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

// it is use to prevent the duplicate class
ClassSchema.index(
  { class_name: 1, section: 1, school_id: 1 },
  { unique: true },
);

const Class = mongoose.model("Class", ClassSchema);

module.exports = Class;
