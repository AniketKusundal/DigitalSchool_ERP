const mongoose = require("mongoose")


const PayroleSchema = mongoose.Schema({

    staff_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Staff",
        required : "true"
    },

    school_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "School",
        required : "true"
    },

    created_by : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },

    basic_salary : {

        type : Number,
        required : true,
    },

    bonus : {
        type : Number,
        default : 0
    },

    deductions : {
        type : Number,
        default : 0
    },

    final_salary : {
        type : Number,
        required : true,
    },


    month : {
        type : Number,
        required : true
    },


    year : {
        type : Number,
        required : true,
    },


    payment_status : {
        type : String,
        enum : ["Paid" , "Pending"],
        default : "Pending"
    },

    payment_date: {
        type : Date,
    },

    payment_method : {
        type : String,
        enum : ["UPI" , "Bank Transfer" , "Cash"]
    },

    note : {
        type : String,
        trim : true,
    }

} , {timestamps : true})


PayroleSchema.index(

    {staff_id : 1 , month : 1 , year : 1},
    {unique : true}
)


const Payrole = new mongoose.model("Payrole" , PayroleSchema)

module.exports = Payrole;