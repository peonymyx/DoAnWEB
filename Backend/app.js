const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();

const twilio = require("twilio");
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;
const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
// app.post("/send-sms", (req, res) => {
//   const { phoneNumber, message } = req.body;

//   client.messages
//     .create({
//       body: message,
//       from: "+12563673834",
//       to: phoneNumber,
//     })
//     .then((message) => {
//       console.log(message.sid);
//       res.send({ success: true, message: "Tin nhắn đã được gửi thành công!" });
//     })
//     .catch((err) => {
//       console.error(err);
//       res
//         .status(500)
//         .send({ success: false, message: "Đã xảy ra lỗi khi gửi tin nhắn." });
//     });
// });

const messages = [];
const allMessages = [];
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (message) => {
    messages.push(message);
    io.emit("message", message);
  });
  socket.on("allMessages", (message) => {
    allMessages.push(message);
    io.emit("allMessages", message);
    console.log("allMessages", allMessages);
  });
});

app.get("/api/messages", (req, res) => {
  res.json(messages);
});

// Connect to MongoDB
mongoose.set("strictQuery", true);
const conectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "shopquanao",
    });
  } catch (error) {
    console.log("mongoconet faild : ", error);
  }
};
conectDB();

mongoose.connection.once("open", () => {
  console.log("connection open");
});

// cors
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/v1/signup", require("./router/signUpRouter"));
app.use("/api/v1/signin", require("./router/signInRouter"));
app.use("/api/v1/forgotpassword", require("./router/forgot-password"));
app.use("/api/v1/resetpassword", require("./router/reset-password"));

app.use("/api/v1/coupons", require("./router/couponRouter"));
app.use("/api/v1/addProduct", require("./router/ProductRouter"));
app.use("/api/v1/getProduct", require("./router/ProductRouter"));
app.use("/api/v1/deleteProduct", require("./router/ProductRouter"));
app.use("/api/v1/updateProduct", require("./router/ProductRouter"));
app.use("/api/v1/getProductById", require("./router/ProductRouter"));
app.use("/api/v1/getUsers", require("./router/userRouter"));
app.use("/api/v1/users", require("./router/userRouter"));
app.use("/api/v1/updateUser", require("./router/userRouter"));
app.use("/api/v1/getUserById", require("./router/userRouter"));
app.use("/api/v1/category", require("./router/category"));
app.use("/api/v1/comment", require("./router/commentRouter"));
app.use("/api/v1/getComment", require("./router/commentRouter"));
app.use("/api/v1/otherProduct", require("./router/oderProduct"));
app.use("/", require("./router/payment"));
app.use("/api/v1/statistical", require("./router/statistical"));
app.use("/api/v1", require("./router/userRouter"));
app.use("/api/v1/bestSeller", require("./router/bestSeller"));
app.use("/api/v1/filter", require("./router/filterRouter"));
server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
