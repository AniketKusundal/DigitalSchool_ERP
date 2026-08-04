const subjectServices = require("../services/subject.services")


const createSubject = async (req, res) => {
  try {
    const subject = await subjectServices.createSubject(
      req.body,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      Message: "Subject Created Successfully",
      data: subject,
    });
  } 
  catch (error) 
  {
    return res.status(400).json({
      success: false,
      Message: "Error While Creating Subject " + error.message,
    });
  }
};


const updateSubject = async (req, res) => {
  try {

    const { subjectId } = req.params;

    const subject = await subjectServices.updateSubject(
      subjectId,
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      Message: "Subject Updated Successfully",
      data: subject,
    });

  } 
  catch (error) 
  {
    return res.status(400).json({
      success: false,
      Message: error.message,
    });
  }
};



const getSubjectByClass = async(req , res) => {
    try
    {
        const {classId} = req.params;
        
        const subjects = await subjectServices.getClassSubject(classId)

        return res.status(200).json({
            Message : "Subject Fetched",
            data : subjects,

        })
    } 
    catch (error) 
    {
        return res.status(401).json({
            Message : "Error While Ftching Class Subject" + error.message
        })
    }
}



const assignTeacher = async(req , res) => {
    try 
    {
        const {subjectId , teacherId} = req.body;

        const data = await subjectServices.assignTeacherToSubject(
            subjectId,
            teacherId,
        )

        return res.status(200).json({
            success : true ,
            Message : "Teacher Assigned  To Subject",
            data : data,
        })
    } 
    catch (error) 
    {
        return res.status(400).json({
            success : false ,
            Message :  error.message,
        })
    }
}


const unassignTeacherFromSubject = async (req , res) => {

    try 
    {
        const { subjectId } = req.params
        
        const subject = await subjectServices.unassignTeacherFromSubject(
            subjectId ,
            req.user.id
        )


        return res.status(200).json({
            success : true ,
            Message : "Teacher Unassign From Subject Successfully" ,
            data : subject 
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

const getAllSubjects = async(req , res)=> {
    try 
    {
        const subjects = await subjectServices.getAllSubjects(req.user.id)

        return res.status(200).json({
            success : true ,
            Message : "Subject Fetched Sucessfully",
            data : subjects
        })
    } 
    catch (error) 
    {
        return res.status(400).json({
            success : false ,
            Message : error.message ,
        })
    }
}




const getSingleSubject = async(req ,res) => {
    try
    {
        const { subjectId } = req.params

        const subject = await subjectServices.getSingleSubject(
            subjectId ,
            req.user.id
        )

        return res.status(200).json({
            success : true ,
            Message : "Subject Fetch Successfully",
            data : subject
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



const getTeacherMySubjects = async (req, res) => {
  try {
    const subjects = await subjectServices.getTeacherMySubjectsService(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      Message: "Teacher Subjects Fetched Successfully",
      data: subjects,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      Message: error.message,
    });
  }
};


module.exports = {
    createSubject,
    getSubjectByClass,
    assignTeacher,
    unassignTeacherFromSubject ,
    getSingleSubject ,
    getAllSubjects ,
    updateSubject ,
    getTeacherMySubjects
}