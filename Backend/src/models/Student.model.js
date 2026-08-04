const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
   
    // 1. STUDENT BASIC INFO
   

    basicInfo: {
      first_name: {
        type: String,
        required: true,
        trim: true,
      },

      father_name: {
        type: String,
        required: true,
        trim: true,
      },

      mother_name: {
        type: String,
        required: true,
        trim: true,
      },

      surname: {
        type: String,
        required: true,
        trim: true,
      },

      dob: {
        type: Date,
        required: true,
      },

      gender: {
        type: String,
        enum: ["Male", "Female"],
        required: true,
      },

      // IMPORTANT:
      // Aadhaar should later become UNIQUE
      // to prevent duplicate students

      aadhaar_card_no: {
        type: String,
        required: true,
        unique : true ,
      },

      student_photo: {
        type: String,
        required: true,
      },
    },

   
    // 2. ACADEMIC INFO
  
    academicInfo: {
      register_no: {
        type: String,
      },

      saral_id: {
        type: String,
      },

      apaar_id: {
        type: String,
      },

      pen: {
        type: String,
      },

      // IMPORTANT:
      // Currently String
      // Later convert into:
      // ref: "AcademicYear"

      academic_year: {
        type: String,
      },

      // Roll Number inside class

      roll_number: {
        type: Number,
        required: true,
      },

      // First class when student took admission

      admission_class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },

      // Current studying class

      current_class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },

      division: {
        type: String,
      },

      admission_date: {
        type: Date,
      },
    },

   
    // 3. ADDRESS
   

    address: {
      country: {
        type: String,
        default: "India",
      },

      full_address: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        default: "Maharashtra",
      },

      district: {
        type: String,
      },

      taluka: {
        type: String,
      },

      pincode: {
        type: String,
      },
    },

   
    // 4. PARENTS INFO
   
    parents_Info: {
      father: {
        occupation: {
          type: String,
        },

        education: {
          type: String,
        },

        phone: {
          type: String,
          required: true,
        },

        email: {
          type: String,
        },
      },

      mother: {
        occupation: {
          type: String,
        },

        education: {
          type: String,
        },

        phone: {
          type: String,
        },

        email: {
          type: String,
        },
      },

      annual_income: {
        type: String,
      },

      total_children: {
        type: Number,
      },

      parent_aadhaar: {
        type: String,
      },
    },

   
    // 5. PREVIOUS SCHOOL INFO
   
    previousSchool: {
      school_name: {
        type: String,
      },

      leaving_date: {
        type: Date,
      },

      previous_class: {
        type: String,
      },

      percentage: {
        type: Number,
      },

      obtained_marks: {
        type: Number,
      },

      total_marks: {
        type: Number,
      },
    },

   
    // 6. BANK DETAILS

    bankDetails: {
      account_holder: {
        type: String,
      },

      account_no: {
        type: String,
      },

      bank_name: {
        type: String,
      },

      branch: {
        type: String,
      },

      ifsc_code: {
        type: String,
      },
    },

   
    // 7. OTHER DETAILS
   

    otherDetails: {
      religion: {
        type: String,
      },

      caste: {
        type: String,
      },

      sub_caste: {
        type: String,
      },
      
      nationality: {
        type: String,
        default: "India",
      },

      mother_tongue: {
        type: String,
      },

      birth_place: {
        type: String,
      },

      blood_group: {
        type: String,
      },

      physically_challenged: {
        type: Boolean,
      },
    },

   
    // 8. SYSTEM FIELDS
   

    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },

    // Current Active Class

    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

   
    // STUDENT STATUS
   

    // IMPORTANT ERP CHANGE

    // ACTIVE      -> currently studying
    // INACTIVE    -> temporary inactive
    // LEFT        -> transferred / TC
    // PASSED_OUT  -> completed final class
    // SUSPENDED   -> disciplinary issue

    status: {
      type: String,
      enum: [
          "ACTIVE", 
          "INACTIVE", 
          "LEFT",
          "PASSED_OUT",
          "SUSPENDED"
      ],
      default: "ACTIVE",
    },

   
    // TC / LEAVING DETAILS
   

    // IMPORTANT:
    // You were already using these fields
    // in leaveStudent controller
    // but fields were missing in model

    leaving_reason: {
      type: String,
    },

    leaving_date: {
      type: Date,
    },

   
    // STUDENT HISTORY
  
    // VERY IMPORTANT FOR:
    // promotions
    // reports
    // academic tracking
    // ERP history

    history: [
      {
        class_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Class",
        },

        // Later can become AcademicYear ref

        academic_year: {
          type: String,
        },

        // PASS / FAIL / DETAINED

        result: {
          type: String,
        },

        // yearly attendance

        attendance: {
          type: Number,
        },

        // OPTIONAL FUTURE FIELD
        // promotion_date

        // promotion_date: {
        //   type: Date,
        // },
      },
    ],
  },
  { timestamps: true },
);




// INDEXES

// Prevent duplicate roll numbers
// inside same class

StudentSchema.index(
  {
    class_id: 1,
    "academicInfo.roll_number": 1,
  },
  {
    unique: true,
  },
);


// MODEL EXPORT

const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;
