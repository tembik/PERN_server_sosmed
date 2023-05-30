const multer = require("multer");
const path = require("path");

// multer config

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

const upload = multer({
  storage: multer.diskStorage({}),
  limits: { fieldSize: "5000000" },
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("file tidak di support"), false);
      return;
    }
    cb(null, true);
  },
});
module.exports = upload;
