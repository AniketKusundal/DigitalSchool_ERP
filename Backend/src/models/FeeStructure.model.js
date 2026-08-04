const mongoose = require("mongoose")

const FeeStructureSchema = new mongoose.Schema(
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

    academic_year: {
      type: String,
      required: true,
    },

    fee_structure: {
      tuition_fee: {
        type: Number,
        required: true,
        min: 0,
      },

      exam_fee: {
        type: Number,
        default: 0,
        min: 0,
      },

      transport_fee: {
        type: Number,
        default: 0,
        min: 0,
      },

      library_fee: {
        type: Number,
        default: 0,
        min: 0,
      },

      misc_fee: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    total_fee: {
      type: Number,
      min: 0,
    },

    remark: {
      type: String,
      trim: true,
      default: "",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);


FeeStructureSchema.index(
    {
        school_id : 1 ,
        class_id : 1,
        academic_year : 1 ,
        isDeleted : 1
    },
    {
        unique : true ,
    }
)


const FeeStructure =  mongoose.model("FeeStructure" , FeeStructureSchema)

module.exports = FeeStructure