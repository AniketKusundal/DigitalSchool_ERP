const mongoose = require("mongoose")

const FeeSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },

    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    academic_year: {
      type: String,
      required: true,
    },

    fee_structure_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeStructure",
      required: true,
    },

    
    paid_amount: {
      type: Number,
      default: 0,
      min : 0 ,
    },
    
    pending_amount: {
      type: Number,
      default: 0,
      min : 0 ,
    },
    
    discount: {
      type: Number,
      default: 0,
      min : 0 ,
    },

    payment_status: {
      type: String,
      enum: ["PAID", "UNPAID", "PARTIAL"],
      default: "UNPAID",
    },

    // ✅ payment_history should be an ARRAY
    payment_history: [
      {
        amount: {
          type: Number,
          required: true,
          min : 1 ,
        },

        payment_date: {
          type: Date,
          default: Date.now,
        },

        receipt_no: {
          type: String, // ✅ CHANGED from Number → String
          required: true,
        },

        collected_by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        note: {
          type: String,
        },
      },
    ],

    due_date: {
      type: Date,
    },

    remark: {
      type: String,
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // ✅ CHANGED: required
    },
  },
  { timestamps: true },
);

const Fee = mongoose.model("Fee", FeeSchema)

module.exports = Fee