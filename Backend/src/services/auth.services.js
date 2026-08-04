const User = require("../models/User.model");
const genrateToken = require("../utils/jwt");


const LoginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid email and password");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error("Invalid email and password");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("Your account is inactive");
  }

  const token = genrateToken({
    id: user._id,
    role: user.role,
  });

  const userData = await User.findById(user._id)
    .select("-password")
    .populate("assignedClass", "class_name section status");

  return {
    user: userData,
    token,
  };
};


const changePasswordService = async (
  userId,
  oldPassword,
  newPassword
) => {
  const user = await User.findById(userId)
    .select("+password");

  if (!user) {
    throw new Error("User Not Found");
  }

  const isMatch =
    await user.comparePassword(oldPassword);

  if (!isMatch) {
    throw new Error(
      "Old Password is Incorrect"
    );
  }

  user.password = newPassword;

  // pre save hook hashes password
  await user.save();

  return true;
};

module.exports = {
    LoginUser,
    changePasswordService ,
}