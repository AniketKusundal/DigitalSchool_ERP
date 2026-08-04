const ExamServices = require("../services/exam.services")


const createExam = async (req , res) => {
    try 
    {
        const exam = await ExamServices.createExamServices(
            req.body,
            req.user.id
        );

        return res.status(201).json({
            success : true ,
            Message : "Exam Created Successfully",
            data: exam,
        })
    } 
    catch (error) 
    {
        return res.status(400).json({
            success : false ,
            Message : error.message,
        })
    }
}


const getAllExam = async (req , res) => {
    try 
    {
        const exam = await ExamServices.getAllExamService(
            req.user.id ,
            req.query
        );
 
        
        return res.status(200).json({
            success : true ,
            Message : "Exam Fetch Successfully" ,
            data : exam ,
        })
    } 
    catch (error) 
    {
        return res.status(200).json({
            success : false ,
            Message : error.message ,
        })
    }
}


const getSingleExam = async (req , res) => {

    try 
    {
        const { examId } = req.params

        const SingleExam = await ExamServices.getSingleExamService(
            req.params.examId ,
            req.user.id
        )

        return res.status(200).json({
            success : true ,
            Message : "Exam Fetched Successfully" ,
            data : SingleExam
        })
    } 
    catch (error) 
    {
        res.status(400).json({
            success : true ,
            Message : error.message ,
        })
    }
}



const updateExam = async (req, res) => {
  try {
    const exam = await ExamServices.updateExamServices(
      req.params.examId,
      req.body,
      req.user.id,
    );

    return res.status(200).json({
      success: true,
      Message: "Exam Updated Successfully",
      data: exam,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      Message: error.message,
    });
  }
};

module.exports = {
    createExam ,
    getAllExam ,
    getSingleExam , 
    updateExam
}