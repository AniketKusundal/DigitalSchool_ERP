const Staff = require("../models/Staff.model")
const User = require("../models/User.model")


const createStaff = async(data , adminId) => {


    const {full_name , designation , date_of_birth , gender , contact_no , email , address , village_name , city , pincode , state , addhaar_card_no , upload_addhaar_card , staff_photo , status } = data;

   const admin = await User.findById(adminId)


   if(!admin || !admin.school_id) 
   {
        throw new Error("Invalid Admin")
   }

   if(admin.role !== "ADMIN")
   {
     throw new Error("Oly Admin Can Add The Staff")
   }



   const addStaff = await Staff.create({
          full_name , 
          designation ,
          date_of_birth ,
          gender , 
          contact_no ,
          email ,
          address ,
          village_name ,
          city ,
          pincode ,
          state ,
          addhaar_card_no ,
          upload_addhaar_card ,
          staff_photo ,
          status ,
          school_id : admin.school_id,  
   })

   return addStaff;
}



const getAllStaff = async function(adminId) {
     
     const admin = await User.findById(adminId)

     if(!admin || !admin.school_id)
     {
          throw new Error("Invalid Admin")
     }

     const staff = await Staff.find({
          school_id : admin.school_id,
          status: "ACTIVE"
     })

     return staff;
} 



// getting single Staff 

const getSingleStaff = async(staffId , adminId) =>
{

     const admin = await User.findById(adminId)


     if (!admin || !admin.school_id) 
     {
          throw new Error("Invalid Admin")
     }

     const staff = await Staff.findById(staffId)


     if (!staff) {
          throw new Error("Staff Not Found")
     }


     if (staff.school_id.toString() !== admin.school_id.toString()) 
     {
          throw new Error("Access Denied")
     }


     return staff;



}




const UpdateStaff = async (staffId , data , adminId) => {



     const admin = await User.findById(adminId)

     if (!admin || !admin.school_id) {
          throw new Error("Invalid Admin")
     }

     
     // find staff

     const staff = await Staff.findById(staffId)

     if(!staff)
     {
          throw new Error("Staff Not Found")
     }

     // secrity check
     if(staff.school_id.toString() !== admin.school_id.toString())
     {
          throw new Error("Access Denied")
     }

     Object.keys(data).forEach((key) => {

          if(data[key] !== undefined)
          {
               staff[key] = data[key]
          }
     });

     // save data

     await staff.save()


     return staff;
}




const DeleteStaff = async (staffId , adminId) => {

     const admin = await User.findById(adminId)

     if (!admin || !admin.school_id) {
          throw new Error("Invalid Admin")
     }


     const staff = await Staff.findById(staffId)

     if(!staff)
     {
          throw new Error("Staff Is Not Found")
     }

     if(staff.school_id.toString() !== admin.school_id.toString())
     {
          throw new Error("Access Denied")
     }


     staff.status = "INACTIVE"

     await staff.save();

     return  {
          message : "Staff Deleted Successfully"
     }



}

module.exports = {
     createStaff,
     getAllStaff, 
     getSingleStaff,  
     UpdateStaff,
     DeleteStaff,
}

