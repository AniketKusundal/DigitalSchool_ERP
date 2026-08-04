
const multer = require("multer");
const CloudinaryStorage = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");



const storage =
  new CloudinaryStorage({

    cloudinary,

    params: {

      folder: "school",

      allowed_formats: [
        "png",
        "jpeg",
        "jpg",
        "pdf",
      ],
    },
  });



const upload = multer({
  storage,
});

module.exports = upload;

