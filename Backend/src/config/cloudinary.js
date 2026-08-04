
const cloudinary =
require("cloudinary");

cloudinary.v2.config({

    cloud_name:
    process.env.CLOUD_NAME,

    api_key:
    process.env.CLOUD_API_KEY,

    api_secret:
    process.env.CLOUD_API_SECRET,
});

// console.log("CLOUD:", process.env.CLOUD_NAME);
// console.log("KEY:", process.env.CLOUD_API_KEY);

module.exports = cloudinary;




