import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import adminRoutes from "./Routes/adminRoutes.js";
import chatRoutes from "./Routes/chatRoutes.js";
import messageRoutes from "./Routes/messageRoutes.js";
import { Server } from "socket.io";

// config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30", extended: true }));
// app.use("*", cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-Content-Length');
  next();
});

app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use(errorHandler);
app.use("/auth", authRoutes);
app.use("/", userRoutes);
app.use("/admin", adminRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

//monogdb
mongoose
  .connect(process.env.MONGO_URL, {
    // useNewUrlParse:true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err, "DB error");
  });

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// This code creates a new instance of a Server object from the socket.io library
const io = new Server(server, {
  pingTimeout: 3000,
  cors: {
    origin: "https://onlyfriends.fun",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData);
    console.log(userData);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    console.log("new Message", newMessageRecieved);
    const chat = newMessageRecieved.chat;

    // console.log("Chat ID:", chat);

    if (!chat.users) return console.log("chat.user is not defined");

    chat.users.forEach((user) => {
      // console.log(newMessageRecieved.sender._id,"id hereeeee", user._id)
      if (user._id === newMessageRecieved.sender._id) {
        // console.log(user)
      }
      return socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });
});
