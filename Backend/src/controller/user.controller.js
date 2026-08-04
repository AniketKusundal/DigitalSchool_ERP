const UserService = require("../services/user.service");

const createTeacher = async (req, res) => {
  try {
    const teacher = await UserService.createTeacherService(
      req.body,
      req.user.id
    );

    return res.status(200).json({
      Message: "Teacher Created Successfully",
      data: teacher,
    });
  } catch (error) {
    return res.status(400).json({
      Message: "Error While Creating The User " + error.message,
    });
  }
};

const getAllTeacher = async (req, res) => {
  try {
    const teachers = await UserService.getAllTeacherService(
      req.user.id
    );

    return res.status(200).json({
      Message: "All Teachers Data Fetched",
      data: teachers,
    });
  } catch (error) {
    return res.status(400).json({
      Message: error.message,
    });
  }
};

const getSingleTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const teacher = await UserService.getSingleTeacherService(
      teacherId,
      req.user.id
    );

    return res.status(200).json({
      Message: "Teacher Fetched Successfully",
      data: teacher,
    });
  } catch (error) {
    return res.status(400).json({
      Message: "Error While Fetching Teacher " + error.message,
    });
  }
};

const createAdmin = async (req, res) => {
  try {
    const admin = await UserService.createAdminService(req.body);

    return res.status(201).json({
      Message: "Admin Created Successfully",
      data: admin,
    });
  } catch (error) {
    return res.status(400).json({
      Message: "Error While Creating Admin " + error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        Message: "Old password and new password are required",
      });
    }

    await UserService.changePasswordService(
      req.user.id,
      oldPassword,
      newPassword
    );

    return res.status(200).json({
      Message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(400).json({
      Message: "Error while changing password " + error.message,
    });
  }
};



const updateTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const teacher = await UserService.updateTeacherService(
      teacherId,
      req.user.id,
      req.body ,
      req.file
    );

    return res.status(200).json({
      Message: "Teacher Updated Successfully",
      data: teacher,
    });
  } catch (error) {
    return res.status(400).json({
      Message: "Error While Updating Teacher " + error.message,
    });
  }
};

const deactivateTeacher = async(req, res) => {

  try 
  {
    const {teacherId} = req.params

    const teacher = await UserService.deactivateTeacherServices(
      teacherId ,
      req.user.id
    )

    return res.status(200).json({
      Message : "Teacher Deactivate Successfully" ,
      data : teacher
    })
  } 
  catch (error) 
  {
    return res.status(400).json({
      Message : error.message ,
    })
  }
}


const reactiveTeacher = async (req , res) => {
  try 
  {
    const {teacherId} = req.params

    const teacher = await UserService.reactivateTeacherServices(
      teacherId ,
      req.user.id
    )

    return res.status(200).json({
      Message : "Student Reactived Successfully",
      data  : teacher
    })
  } 
  catch (error) 
  {
    return res.status(400).json({
      Message : error.message
    })
  }
}

const searchTeacher = async(req , res) => {

  try 
  {
    const {keyword } = req.query


    const teachers = await UserService.searchTeacherServices(
      req.user.id ,
      keyword
    )

        return res.status(200).json({
          Message: "Teachers Search Successfully",
          data: teachers,
        });
  } 
  catch (error) 
  {
    return res.status(400).json({
      Message : error.message
    })
  }
}

// TEACHER STATS
const getTeacherStats = async (req, res) => {
  try {
    const stats = await UserService.getTeacherStatsService(
      req.user.id
    );

    return res.status(200).json({
      Message: "Teacher Stats Fetched Successfully",
      data: stats,
    });
  } catch (error) {
    return res.status(400).json({
      Message: "Error While Fetching Teacher Stats " + error.message,
    });
  }
};


const getTeacherMyClass = async (req, res) => {
  try {
    const myClass = await UserService.getTeacherMyClassServices(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      Message: "Teacher Assigned Class Fetched Successfully",
      data: myClass,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      Message: error.message,
    });
  }
};


const getMyProfile = async (req, res) => {
  try {
    const user = await UserService.getMyProfileService(req.user.id);

    return res.status(200).json({
      success: true,
      Message: "Profile Fetched Successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      Message: error.message,
    });
  }
};

const getTeacherDashboard = async (req, res) => {
  try {
    const dashboard = await UserService.getTeacherDashboardService(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      Message: "Teacher Dashboard Fetched Successfully",
      data: dashboard,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      Message: error.message,
    });
  }
};

module.exports = {
  createTeacher,
  getAllTeacher,
  getSingleTeacher,
  updateTeacher ,
  deactivateTeacher ,
  reactiveTeacher ,
  getTeacherStats ,
  searchTeacher ,
  createAdmin,
  changePassword,
  getTeacherMyClass,
  getMyProfile ,
  getTeacherDashboard
};