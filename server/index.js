import express from "express";
import { Server as socketio } from "socket.io";
import http from "http";
import router from "./router.js";
import cors from "cors";
import { addUser, removeUser, getUser, getUsersInRoom } from "./users.js";
import dotenv from "dotenv"

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new socketio(server);
const PORT = process.env.PORT || 5000;

app.use("/", router);
app.use(cors());

io.on("connection", (socket) => {
  console.log("We have a new connection!!!");

  socket.on("join", ({ name, room }, callback) => {
    console.log(name, room);
    const user = addUser({ id: socket.id, name, room });
    // if (error) return callback(error);
    // console.log(user);
    if (user.error) {
      // alert("Username is taken, try different one");
      socket.emit("message", {
        user: "admin",
        text: ` Username '${name}' is already taken`,
      });
      callback("error");
    } else {
      // socket.emit to only sender that you have entered chat
      socket.emit("message", {
        user: "admin",
        text: `${user.name} , welcome to room ${user.room}`,
      });
      // to send message to all connected clients except the sender use braodcast
      socket.broadcast
        .to(user.room)
        .emit("message", { user: "admin", text: `${user.name}, has joined` });

      socket.join(user.room); // user is object of id,name and room

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }

    // callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    // console.log("send message is called in bakend");
    io.to(user.room).emit("message", { user: user.name, text: message });
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });
  socket.on("onDisconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left`,
      });
    }
    console.log("User left!!!!");
    socket.disconnect();
  });
});

server.listen(PORT, () => {
  console.log(`Listerning on port ${PORT}`);
});
