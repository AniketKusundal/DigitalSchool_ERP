const IdServices = require("../services/id.services")


const StudentIdCard = async (req , res) => {

    console.log(req.user);
    
    try 
    {
        const {studentId} = req.params;

        const adminId = req.user.id


        const IdCard = await IdServices.StudentIdCard(
            studentId ,
            adminId ,

        )

        return res.status(200).json({
            Message : "Student ID Card Generated" ,
            data : IdCard
        })

    } 
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Genrating The Student Id Card " + error.message
        })
    }
}



const TeacherIdCard = async(req , res) => {

    try 
    {
        const {teacherId} = req.params;

        const adminId =   req.user.id

        const IdCard = await IdServices.TeacherIdCard(
            teacherId ,
            adminId ,
        )

        return res.status(200).json({
            Message : "Teacher ID Card Generated Successfully" ,
            data : IdCard 
        })
    } 
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Generating Teacher ID Card " + error.message ,
        })
    }
}


const StaffIdCard = async (req , res) => {

    try 
    {
        const {staffId} = req.params;

        const adminId = req.user.id

        const IdCard = await IdServices.StaffIdCard(
            staffId ,
            adminId ,
        )

        return res.status(200).json({
            Message : "Staff Id Card Genrated Successfully",
            data : IdCard ,
        })
    } 
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Genrating The Staff Id Card " + error.message
        })        
    }
}

module.exports = {

    StudentIdCard ,
    TeacherIdCard ,
    StaffIdCard ,
}