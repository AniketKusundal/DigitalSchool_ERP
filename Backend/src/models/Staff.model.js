const mongoose = require("mongoose")


const StaffSchema = mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },

    full_name: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    date_of_birth: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    contact_no: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    village_name: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
    },

    pincode: {
      type: String,
    },

    addhaar_card_no: {
      type: String,
    },

    upload_addhaar_card: {
      type: String,
    },

    staff_photo: {
      type: String,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true },
);


const Staff = new mongoose.model("Staff" , StaffSchema)

module.exports = Staff;