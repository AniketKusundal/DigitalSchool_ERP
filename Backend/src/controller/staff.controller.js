const Staff = require("../models/Staff.model");
const StaffServices = require("../services/staff.services")



const createStaff = async (req , res) => {

    try 
    {
        const upload_addhaar_card  = req.files.upload_addhaar_card ? req.files.upload_addhaar_card[0].path : "";

        const staff_photo = req.files.staff_photo ? req.files.staff_photo[0].path : "";


        const data = {

            ...req.body,
            upload_addhaar_card,
            staff_photo
        }



      const userId = req.user.id;
      const staff = await StaffServices.createStaff(
        data, 
        userId
    );

    return res.status(200).json({
        Message : "Staff Added Successfully",
        data : staff,
    })

    } 
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Creating The Staff " + error.message
        })
    }

}


const getAllStaff = async (req , res) => {

    try 
    {
        const staff = await StaffServices.getAllStaff(
            req.user.id
        )

        return res.status(200).json({
            Message : "All Staff Of Your School",
            data : staff,
        })
    } 
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Fetching Staff " + error.message
        })
    }
}


const getSingleStaff = async (req , res) => {

    try 
    {
        const {id} = req.params;

        const staff = await StaffServices.getSingleStaff(
            id,
            req.user.id
        )

        return res.status(200).json({
            Message : "Staff Is Found",
            data : staff
        })
    } 
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Fetching Staff Data " + error.message,
        })
    }
}




const UpdateStaff = async (req , res) => {


    try {
        
        
        const { id } = req.params;
        
        const upload_addhaar_card = req.files.upload_addhaar_card  ? req.files.upload_addhaar_card[0].path : undefined
        const staff_photo = req.files.staff_photo ? req.files.staff_photo[0].path : undefined
        
        const data = {
            
            ...req.body
        }   
        
        if (upload_addhaar_card) 
            {
            data.upload_addhaar_card = upload_addhaar_card
        }

        if(staff_photo)
            {
                data.staff_photo = staff_photo;
            }
            
            
            const UpdateStaff = await StaffServices.UpdateStaff(
                id,
                data,
                req.user.id
            )
            
            return res.status(200).json({
                Message : "Staff Data Updated Successfully",
                data : UpdateStaff
            })
        } 
        catch (error) 
        {
            return res.status(400).json({
                Message : "Error While Updating The Staff " + error.message
            })
        }

}


const DeleteStaff = async (req , res) =>
{
    try 
    {
        const {id} = req.params;


        const DeleteStaff = StaffServices.DeleteStaff(
            id ,
            req.user.id,
        )


        return res.status(200).json({
            Message  : "Staff Deleted Successfully",
            data : DeleteStaff,
        })

    } 
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Deleting The Staff " + error.message
        })
    }
}





module.exports = {
    createStaff,
    getAllStaff,
    getSingleStaff,
    UpdateStaff,
    DeleteStaff,
}