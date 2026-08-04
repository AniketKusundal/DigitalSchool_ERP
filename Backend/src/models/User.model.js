const mongoose = require("mongoose")
const bcrypt = require("bcrypt");



const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      minlength: 6,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["SUPER_ADMIN", "ADMIN", "TEACHER", "ACCOUNTANT"],
      default: "TEACHER",
    },

    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },

    assignedClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },

    phone: {
      type: String,
    },

    photo: {
      type: String,
    },

    designation: {
      type: String,
    },


    status : {
      type : String ,
      enum : ["ACTIVE" , "INACTIVE"] ,
      default : "ACTIVE" ,
    },
  },
  { timestamps: true },
);



UserSchema.pre("save", async function () 
{
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);


//   next();
});



// compare Password

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model("User" , UserSchema)


module.exports = User;
