require('dotenv').config()
const mongoose = require("mongoose")
const User = require("../models/User.model")
const bycrypt = require("bcrypt")




const createSuperAdmin = async () => {

    try 
    {
        await mongoose.connect(process.env.MONGODB_URI)    

        const existingSuperAdmin = await User.findOne({ role : "SUPER_ADMIN"})

        if (existingSuperAdmin) {
            console.log("Super Admin Already Exist");
            process.exit(0)
            
        }


        //  create Admin 
        const SuperAdmin = await User.create({

            name : process.env.SUPER_ADMIN_NAME,
            email : process.env.SUPER_ADMIN_EMAIL,
            password : process.env.SUPER_ADMIN_PASSWORD,
            role : "SUPER_ADMIN",
        });

        console.log("Super Admin Created Created Successfully");
        process.exit(0);
        
    } catch (error) {
        console.log("Error" , error.message);
        process.exit(1)
        
    }
}

createSuperAdmin();