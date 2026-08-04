const TeacherTimeTableServices = require("../services/teachertimetable.services")



const TeacherTimeTable =  async (req ,  res) => {

    try 
    {
        const data = await TeacherTimeTableServices.CreateTeacherTimeTable(
            req.body,
            req.user.id,
        )

        return res.status(200).json({
            Message : "Teacher TimeTable Genrated",
            data,
        })
    } 
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Genrating Time Table"
        })
    }
}



const UpdateTeacherTimeTable = async(req , res) => {

    try 
    {
        const {id} = req.params


        const UpdateTeacherTimeTable = await TeacherTimeTableServices.UpdateTeacherTimeTable(
            id,
            req.body,
            req.user.id
        )

        return res.status(200).json({
            Message : "Teacher Timetable Updateted",
            data : UpdateTeacherTimeTable,
        })

    } 
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Updating The Teacehr Timetable " + error.message
        })
    }
}


const DeleteTeacherLecture = async (req , res) => {

    try 
    {

        console.log(req.user);
        
        
        const {id} = req.params
        
        const deletedLecture = await TeacherTimeTableServices.DeleteTeacherLecture(
            id , 
            req.user.id
            
        )
        
        return res.status(200).json({
            Message : "Teacher Deleted Successfully",
            data : deletedLecture,
        })
    } 
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Deletting The Leacture " + error.message
        })
    }
}


const GetAllLeactures = async (req , res) => {

    try 
    {
        const {id} = req.params
        
        const GetAllLec = await TeacherTimeTableServices.GetAllLeactures(

            id ,
            req.user.id
        )


        return res.status(200).json({
            Message : "All Lectures Fetched Successfully",
            data : GetAllLec
        })
    } 
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Fetching The Leactures Data " + error.message
        })
    }
}




const GetAllLecOfTeacher = async (req , res) => {
    
    try 
    {
        const {id} = req.params

        const AllLecOfTeacher = await TeacherTimeTableServices.GetAllLecOfTeacher(
            
            id ,
            req.user.id
        )

        return res.status(200).json({
            Messsage : "Teacher All Leactures Fetched ",
            data : AllLecOfTeacher
        })
    } 
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Fetching The Teacher Leactures " + error.message
        })
    }
}

module.exports = {
    TeacherTimeTable,
    UpdateTeacherTimeTable,
    DeleteTeacherLecture,
    GetAllLeactures ,
    GetAllLecOfTeacher
}