const AttendanceServices = require("../services/attendance.services")
const Attendance = require("../models/Attendance.model")


const markAttendance = async(req , res) => {

   try 
   {
         const userId = req.user.id

         const result =  await AttendanceServices.markAttendance(
            req.body,
            userId,
         )

         return res.status(200).json({
            Success : true ,  
            Message : "Attendance Marked Successfully",
            data : result,
         })
   } 
   catch (error) 
   {
        return res.status(400).json({
            Success : false ,
            Message : error.message,
        })
   }

}


const getClassAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const { date } = req.query;

    
    const attendance = await AttendanceServices.getClassAttendance(
      classId , 
      date ,
      req.user.id
    )

    return res.status(200).json({
      Success : true ,
      Message: "Student Attendance Fetched",
      data: attendance,
    });

  } 
  catch (error) 
  {
    return res.status(400).json({
      Success : false ,
      Message: error.message,
    });
  }
};


const getStudentattendance = async(req , res) => {

    try 
    {
        const {studentId} = req.params;
        
        
        const attendance = await AttendanceServices.getStudentattendance(
            studentId ,
            req.user.id
        )

        return res.status(200).json({
          success : true ,
          Message : "attendance Is Fetched" ,
          data : attendance
        })
    } 
    catch (error) 
    {
        return res.status(400).json({
          success : false ,
          Message : error.message
        })
    }
}


const updateStudentAttendance = async(req , res) => {

  try 
  {
    const {attendanceId} = req.params

    const {students} = req.body

    const   updateAttendance = await AttendanceServices.updateStudentAttendance(
      attendanceId ,
      students ,
      req.user.id
    )

    return res.status(200).json({
      success : true,
      Message : "Attendance Updated Successfully" ,
      date : updateAttendance
    })

  } 
  catch (error) 
  {
    return res.status(400).json({
      success : false ,
      Message : error.message
    })
  }
}


const classAttendanceReport = async(req , res) => {
  try 
  {
    const {classId} = req.params

    const attendanceReport = await AttendanceServices.getClassAttendanceReport(
      classId ,
      req.user.id ,
      req.query
    );

    return res.status(200).json({
      success : true ,
      Message : "Class Attendance Report Generated Successfully",
      data : attendanceReport
    })
  } 
  catch (error) 
  {
    return res.status(400).json({
      success : false ,
      Message : error.message
    })
  }
}



const studentAttendanceReport = async(req , res) => {

  const {studentId} = req.params

  try 
  {
      const attendance = await AttendanceServices.getStudentAttendanceReport(
        studentId ,
        req.user.id ,
        req.query
      )

      return res.status(200).json({
        success : true ,
        Message : "Report Genreated Successfully",
        data : attendance
      })
  } 
  catch (error) 
  {
    return res.status(400).json({
      success : false ,
      Message : error.message
    })
  }
}

const getAttendanceDashboard = async(req , res) => {

  try 
  {
      const dashboard = await AttendanceServices.getAttendanceDasboardServices(
        req.user.id
      )
      
      return res.status(200).json({
        success : true , 
        Message : "Attendance Dashboard Fetched Successfully" ,
        data : dashboard
      })
  } 
  catch (error) 
  {
    return res.status(400).json({
      success : false ,
      Message : error.message
    })
  }
}


module.exports = {
  markAttendance ,
  getClassAttendance ,
  getStudentattendance ,
  updateStudentAttendance ,
  classAttendanceReport ,
  studentAttendanceReport , 
  getAttendanceDashboard ,
}