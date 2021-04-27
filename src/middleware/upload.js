const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads");
  },
  filename: (req, file, callback) => {
    callback(null, file.filename + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
