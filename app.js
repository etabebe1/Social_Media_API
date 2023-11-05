const express = require("express");
const app = express();
const cors = require("cors");

const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");

const multer = require("multer");

// making donEnv ready to use
dotenv.config();

// connection to DB
const connectDB = require("./db/connectDB");

// middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common")); // used to indicate request and related info

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },

  /*// TODO: consider to check the file name if or if not error occurs due to that */ //
  // if error occurs use the following method to setup filename
  // filename: (req, file, cb) => {
  //   cb(null, file.originalname);
  // },

  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    cb(null, uniqueSuffix + "_" + file.originalname);
  },

  //  file.fieldname + "_" + uniqueSuffix
});

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully.");
  } catch (error) {
    console.log(error);
  }
});

app.use("/api/users", userRouter);
app.use("/api/authentication", authRouter);
app.use("/api/posts", postRouter);

// port
const port = process.env.PORT || 5000;

// initializing server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
  } catch (error) {
    console.log(error);
  }
};

start();
