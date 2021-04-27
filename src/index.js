const fs = require("fs");
const path = require("path");
const connectDB = require("../config/db");

const upload = require("./middleware/upload");

// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "uploads");
//   },
//   filename: (req, file, callback) => {
//     callback(null, file.filename + "-" + Date.now());
//   },
// });

// const upload = multer({ storage: storage });

const Image = require("./model/Image");

const express = require("express");
const { decode } = require("querystring");
const app = express();

app.use(express.json({ extended: false }));

// Connection with database:
connectDB();

const data = [
  {
    name: "Leandro Machado",
    age: 31,
  },
];

app.get("/", (req, res) => {
  res.status(200).json({ method: "GET", statusCode: 200, message: data });
});

app.post("/", (req, res) => {
  const { name, age } = req.body;

  const index = data.findIndex((x) => x.name === name && x.age === age);

  index === -1 ? data.push({ name, age }) : data;

  res.status(200).json({ method: "POST", statusCode: 200, message: data });
});

app.post("/upload", upload.single("file"), (req, res) => {
  const tmpPath = req.file.path;
  const targetPath = "uploads/" + req.file.originalname;
  const src = fs.createReadStream(tmpPath);
  const dst = fs.createWriteStream(targetPath);

  src.pipe(dst);
  src.on("end", () => {
    res.status(200).json({
      method: "POST",
      statusCode: 200,
      route: "/upload",
      message: "Upload Works",
    });
  });
  src.on("error", () => {
    res.status(500).json({
      method: "POST",
      statusCode: 500,
      route: "/upload",
      message: "Upload failed",
    });
  });
});

app.post("/uploadDB", upload.single("file"), async (req, res) => {
  const tmpPath = req.file.path;
  const targetPath = "uploads/" + req.file.originalname;
  const src = fs.createReadStream(tmpPath);
  const dst = fs.createWriteStream(targetPath);

  // console.log(req.params);

  src.pipe(dst);
  src.on("end", () => {
    try {
      const imgObj = {
        name: req.file.originalname,
        description: "upload test",
        image: {
          contentType: "image/jpeg",
          data: fs.readFileSync(path.join("uploads/" + req.file.originalname)),
        },
      };

      const image = new Image(imgObj);
      image.save();

      res.status(200).json({
        method: "POST",
        statusCode: 200,
        route: "/uploadDB",
        // message: "Upload Works",
        message: image,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        method: "POST",
        statusCode: 500,
        route: "/uploadDB",
        message: error.message,
      });
    }
  });
  src.on("error", () => {
    res.status(500).json({
      method: "POST",
      statusCode: 500,
      route: "/uploadDB",
      message: "Upload failed",
    });
  });
});

app.get("/downloadDB", async (req, res) => {
  const { name } = req.body;

  try {
    const image = await Image.findOne({ name });

    console.log(image.image.data.buffer);

    // @todo: implement the buffer with string decode.

    fs.writeFileSync(name, image.image.data.buffer);

    res.status(200).json({
      method: "GET",
      statusCode: 200,
      route: "/downloadDB",
      message: image,
    });
  } catch (error) {
    res.status(500).json({
      method: "GET",
      statusCode: 500,
      route: "/downloadDB",
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, (req, res) => {
  console.log(`Server up and running on port ${PORT}`);
});
