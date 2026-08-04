const Class = require("../models/Class.model");
const School = require("../models/School.model");
const User = require("../models/User.model")
const classServices =  require("../services/class.services")


// Create Class
const createClass = async (req , res) => {
    
    try 
    {
        const adminId = req.user.id;


            const newClass = await classServices.createClass(
                req.body,
                adminId,
            );


        return res.status(200).json({
            Message : "Class Created Successfully",
            data : newClass,
        })
    } 
    catch (error) 
    {
        console.log(error);
        return res.status(400).json({
            Message : "Error While creating a class" + error.message,

        })
        
    }
}



// Assign Class Teacher To Class
const assignClassTeacher = async(req , res) => {

    try 
    {
        const {classId , teacherId} = req.body;
        
        const updated = await classServices.assignClassTeacher (
            classId,
            teacherId,
        );


        return res.status(200).json({
            Message : "Teacher Assiged To Class",
            data : updated,
        })
    } 
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Assign A Teacher To Class " + error.message
        })
    }
}



// Unassign Teacher
const unassignClassTeacher = async (req, res) => {
  try {
    const { classId } = req.params;

    const updatedClass = await classServices.unassignClassTeacher(
      classId,
      req.user.id
    );

    return res.status(200).json({
      Message: "Teacher Unassigned Successfully",
      data: updatedClass,
    });

  } catch (error) {
    return res.status(400).json({
      Message: "Error While Unassigning Teacher " + error.message,
    });
  }
};






// Get All Class
const getAllClass = async(req , res) => {

    try 
    {
        const user = await User.findById(req.user.id)

        // console.log("User" , user);
        // console.log("School Id" , user.school_id);
        
         const classes = await classServices.getAllClass(user)

         return res.status(200).json({
            Message : "All Classes Fethed",
            data : classes,
         });
    } 
    catch (error)
    {
        return res.status(400).json({
            Message : "Error While Fetching The Data" + error.message,
        });
    }
}

// Get Single Class 
const getSingleClass = async(req , res) => {
    try 
    {

       const {id} = req.params;
       console.log("Class ID:", id);


       const ClassData = await classServices.getSingleClass(id);

       return res.status(200).json({
        Message : "Class Fetched",
        data : ClassData,
       })
    } 
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Fetcing Data" + error.message,
        })
    }
}



// Update Class 
const updateClass = async(req , res) => {
    try 
    {
        const {classId} = req.params
        
        const updatedClass = await classServices.updateClass(
            classId ,
            req.body
        )

        return res.status(200).json({
            Message : "Class Updated Successfully ",
            data : updatedClass ,
        })
    }
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Updating The Class " + error.message
        })
    }
}


//  Archive or delete softdelete the class
const softDeleteClass = async(req , res) => {

    try 
    {
        const { classId }  = req.params

        const softdelete = await classServices.softDeleteClass(
            classId
        )

        return res.status(200).json({
            Message : "Class Deactivated Successfully" ,
            data : softdelete
        })
    } 
    catch (error) 
    {
       return res.status(400).json({
            Message : "Error While Deactivating The Class " + error.message
       }) 
    }
}
// Class Stats
const getClassStats = async (req, res) => {
  try {
    const stats = await classServices.getClassStats(
      req.user.id
    );

    return res.status(200).json({
      Message: "Class Stats Fetched Successfully",
      data: stats,
    });

  } catch (error) {
    return res.status(400).json({
      Message: "Error While Fetching Class Stats " + error.message,
    });
  }
};


// SEARCH CLASS
const searchClass = async (req, res) => {
  try {

    const { keyword } = req.query;

    const classes = await classServices.searchClass(
      req.user.id,
      keyword
    );

    return res.status(200).json({
      Message: "Classes Search Successfully",
      data: classes,
    });

  } catch (error) {

    return res.status(400).json({
      Message: "Error While Searching Classes " + error.message,
    });

  }
};

module.exports = {
    createClass ,
    assignClassTeacher,
    unassignClassTeacher ,
    getAllClass ,
    getSingleClass ,
    updateClass ,
    softDeleteClass ,
    getClassStats ,
    searchClass
}