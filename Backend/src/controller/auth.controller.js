const authService  = require("../services/auth.services")



const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await authService.LoginUser(
      email,
      password
    );

    return res.status(200).json({
      success: true,
      message: "Login Successfully",
      data,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const changePassword = async (req,res) => {
  try {
    const {oldPassword , newPassword} = req.body;

    if (!oldPassword ||  !newPassword) 
    {
      return res.status(400).json({
        message: "Old password and new password are required",
      });
    }

    await authService.changePasswordService(
      req.user.id,
      oldPassword,
      newPassword
    );

    return res.status(200).json({
      message: "Password Changed Successfully",
    });
  } 
  catch (error) 
  {
    return res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
   Login,
   changePassword ,
}