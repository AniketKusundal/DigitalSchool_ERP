const mongoose = require("mongoose")


const SchoolSchema = new mongoose.Schema({

    school_name : {
        type : String,
        required : true,
        trim : true,
    },

    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
    },

    phone : {
        type : String,
        required : true
    },

    address : {
        type : String,
        required : true
    },

    village_name  : {
        type : String,
        required : true,
    },

    city : {
        type : String,
        required : true,
    },

    state :{
        type : String,
        required : true,
        default : "Maharashtra"
    },

    pincode : {
        type : String
    },

    website : {
        type : String
    },


    logo : {
        type : String,
    },


    adminId : {

        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        unique : true,
    }
    

},{timestamps : true})


const School = mongoose.model("School" , SchoolSchema)

module.exports = School;

