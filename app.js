const express = require("express");
const app = express();
const cors = require("cors");

const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const conversationRouter = require("./routes/conversation");
const messageRouter = require("./routes/message");

const multer = require("multer");
const path = require("path");

// making donEnv ready to use
dotenv.config();

// connection to DB
const connectDB = require("./db/connectDB");

// middleware for path
app.use("/images", express.static(path.join(__dirname, "public/images")));

// middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common")); // used to indicate request and related info

//*/ NOTE: the following way we're using is to create a destination for only post with specific POST-NAME *//
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/posts");
  },

  filename: (req, file, cb) => {
    //*/ Creating a unique prefix for naming file /*/

    const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}_${
      file.originalname
    }`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json(req.file);
  } catch (error) {
    console.log(error);
  }
});

//
/*// TODO: create a file destination that is only used to store ((USER-PICTURE)) when updating //*/
//
//
/*// TODO: create a file destination system that is only used to store ((COVER-PICTURE)) // */
//
//

app.use("/api/users", userRouter);
app.use("/api/authentication", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/message", messageRouter);
// TODO: use required conversation and message router to render to the front-end

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
