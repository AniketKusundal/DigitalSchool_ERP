const StudentService = require("../services/student.services");


// CREATE STUDENT

const createStudent = async (req, res) => {

     console.log(req.body)
    console.log(req.file)
    
try {

    const student = await StudentService.createStudentService(
        req.body,
        req.user.id,
        req.file
    );

    return res.status(200).json({
        Message: "Student Created Successfully",
        data: student,
    });

} catch (error) {

    return res.status(400).json({
        Message: "Error While Creating The Student " + error.message,
    });
}
};

const updateStudent=  async(req , res) => {

    try 
    {
        const {studentId} = req.params

        const updatedStudentData = await StudentService.updateStudentService(

            studentId ,
            req.body ,
            req.file ,
        )

        return res.status(200).json({
            Message : "Student Data Updated Successfully" ,
            updatedStudentData
        })
    } 
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Updating The Stundet " + error.message
        })
    }

}



const getAllStudent = async (req, res) => {

try {

    const students = await StudentService.getAllStudentService(
        req.user.id
    );

    return res.status(200).json({
        Message: "All Student Fetched",
        data: students,
    });

} catch (error) {

    return res.status(400).json({
        Message: "Error While Fetching Data " + error.message,
    });
}
};


// GET SINGLE STUDENT
const getSingleStudent = async (req, res) => {


try {

    const { id } = req.params;

    const student = await StudentService.getSingleStudentService(id);

    return res.status(200).json({
        Message: "Student Found",
        data: student,
    });

} catch (error) {

    return res.status(400).json({
        Message: "Error While Fetching Student " + error.message,
    });
}


};

// LEAVE STUDENT
const leaveStudent = async (req, res) => {
  try {

    const { studentId } = req.params;
    const { reason } = req.body;

    const student = await StudentService.leaveStudentService(
      studentId,
      reason
    );

    return res.status(200).json({
      Message: "Student Marked As Left",
      data: student,
    });

  } catch (error) {

    return res.status(400).json({
      Message: "Error While Leaving Student " + error.message,
    });

  }
};


const getStudentStats = async (req, res) => {
  try {
    const stats = await StudentService.getStudentStatsService(
      req.user.id
    );

    return res.status(200).json({
      Message: "Student Stats Fetched Successfully",
      data: stats,
    });

  } catch (error) {
    return res.status(400).json({
      Message: "Error While Fetching Student Stats " + error.message,
    });
  }
};

// SEARCH STUDENT
const searchStudent = async (req, res) => {
  try {
    const { keyword } = req.query;

    const students = await StudentService.searchStudentService(
      req.user.id,
      keyword
    );

    return res.status(200).json({
      Message: "Students Search Successfully",
      data: students,
    });

  } catch (error) {
    return res.status(400).json({
      Message: "Error While Searching Students " + error.message,
    });
  }
};


// GET STUDENTS BY CLASS
const getStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const students = await StudentService.getStudentsByClassService(
      req.user.id,
      classId
    );

    return res.status(200).json({
      Message: "Students Fetched Successfully",
      data: students,
    });

  } catch (error) {
    return res.status(400).json({
      Message: "Error While Fetching Students By Class " + error.message,
    });
  }
};



const suspendStudent = async(req , res) => {
  try 
  {
    const {studentId} = req.params

    const student = await StudentService.suspendStudentService(
      studentId
    );

    return res.status(200).json({
      Message : "Student Suspended Successfully" ,
      data : student
    })
  } 
  catch (error) 
  {
    return res.status(400).json({
      Message : "Error While Suspend The Student " + error.message
    })
  }
}


// REACTIVATE STUDENT
const reactivateStudent = async (req, res) => {

  try {

    const { studentId } = req.params;

    const student =
      await StudentService.reactivateStudentService(
        studentId
      );

    return res.status(200).json({
      Message: "Student Reactivated Successfully",
      data: student,
    });

  } catch (error) {

    return res.status(400).json({
      Message:
        "Error While Reactivating Student " +
        error.message,
    });

  }

};

module.exports = {
    createStudent,
    getAllStudent,
    updateStudent ,
    getSingleStudent,
    leaveStudent,
    getStudentStats ,
    searchStudent ,
    getStudentsByClass ,
    suspendStudent ,
    reactivateStudent
};
