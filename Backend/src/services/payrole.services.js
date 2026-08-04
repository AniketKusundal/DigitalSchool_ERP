const Staff = require("../models/Staff.model")
const Payrole = require("../models/PayRoleStaff.model")
const User = require("../models/User.model")



const CreatePayrole = async (data , adminId) => {


    const {staff_id , basic_salary , bonus , deductions  , month , year , payment_status , payment_date , payment_method , note} = data;




    // find the Admin

    const admin = await User.findById(adminId)

    if (!admin || !admin.school_id) {
        
        throw new Error("Invalid Admin")
    }



    if (admin.role !== "ADMIN") {
        
        throw new Error("Only Admin Can Create The School")
    }

    const staff = await Staff.findById(staff_id)

    if (!staff) {
        
        throw new Error("Staff Not Found")
    }


    //  security check

    if (staff.school_id.toString() !== admin.school_id.toString()) {
        
        throw new Error("Access Denied")
    }


    //  check duplicate Payrole

    const ExistingPayRole = await Payrole.findOne({

        staff_id , 
        month ,
        year,

    })

    if (ExistingPayRole) {
        throw new Error("Payrole Already Exist For This Month")
    }


   const final_salary = Number(basic_salary) + Number(bonus || 0) - Number(deductions || 0)

   const payrole = await Payrole.create({

        staff_id ,
        school_id : admin.school_id,
        created_by : adminId ,
        basic_salary ,
        bonus ,
        deductions ,
        final_salary ,
        month ,
        year ,
        payment_date ,
        payment_status ,
        payment_method ,
        note ,
   })
   return payrole;

}


const MarkAsPaid = async(payroleId , adminId) => {

    const admin = await User.findById(adminId)

    if(!admin || !admin.school_id)
    {
        throw new Error("Admin Not Found")
    }

    const payrole = await Payrole.findById(payroleId)

    if (!payrole) {
        throw new Error("Payrole Is Not Found")
    }

    // security check

    if(payrole.school_id.toString() !== admin.school_id.toString())
    {
        throw new Error("Access Denied")
    }

     payrole.payment_status = "Paid"

     payrole.payment_date = new Date()

    await payrole.save()

    return {
        Message : "Salary Paid",
        data : payrole
    }
}

module.exports = {
    CreatePayrole,
    MarkAsPaid,
}