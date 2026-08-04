const School = require("../models/School.model");
const User = require("../models/User.model");


const createSchool = async (data , userId) => {

    const {
        school_name , 
        email , 
        phone , 
        address ,  
        village_name , 
        city , state , 
        pincode , 
        website , 
        logo  } = data;



        //  Find User
        
        const user = await User.findById(userId)

        if(!user)
        {
            throw new Error("User Not Found")
        }



        if(user.role !== "ADMIN")
        {
            throw new Error("Only Admin Can Create School")
        }


        if (user.school_id) {
            
            throw new Error("Admin Already Owns A School")
        }


   

    const school = await School.create({
        school_name,
        email,
        phone,
        address,
        village_name,
        city,
        state,
        pincode,
        website,
        logo,
        adminId : userId,
        
    });


    user.school_id = school._id
    await user.save()


    return school;

}


const updateSchoolData = async (data , userId) => {

    const user = await User.findById(userId)

    if (!user || !user.school_id) {
        throw new Error("School Not Found")
    }

    // find school 

    const school  = await School.findById(user.school_id)

    if(!school)
    {
        throw new Error("Shool is Not Found")
    }


    // partial Update

    Object.keys(data).forEach((key) => {

        if(data[key] !== undefined && data[key] !== "")
        {
            school[key] = data[key]
        }
    })


    await school.save()

    return school

}



const getSchoolData = async(userId) => {

    const user = await User.findById(userId)

    if(!user)
    {
        throw new Error("User Not Found")
    }

    if (!user.school_id) {
        throw new Error("School Is Not Found")
    }

    const school = await School.findById(
        user.school_id
    )

    if (!school) {
        throw new Error("School Not Found")
    }

    return school


}

module.exports = {
    createSchool,
    updateSchoolData ,
    getSchoolData
}