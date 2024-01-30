import express from "express";
import { Server as socketio } from "socket.io";
import http from "http";
import router from "./router.js";
import { addUser, removeUser, getUser, getUsersInRoom } from "./users.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL ,
  },
});
const PORT = process.env.PORT || 5000;
console.log("Fronend url is", process.env.FRONTEND_URL);

app.use("/", router);

io.on("connection", (socket) => {
  console.log("We have a new connection!!!");

  socket.on("join", ({ name, room }, callback) => {
    console.log(name, room);
    // console.log(getUsersInRoom(room));
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

  socket.on("disconnect", () => {
    const removedUser = removeUser(socket.id);
    // console.log(getUsersInRoom(removedUser.room));
    console.log("On disconnect is called");
    if (removedUser) {


      io.to(removedUser.room).emit("roomData", {
      room: removedUser.room,
      users: getUsersInRoom(removedUser.room),
      });


      io.to(removedUser.room).emit("message", {
        user: "admin",
        text: `${removedUser.name} has left`,
      });

      socket.disconnect();

      
    }
    
    // console.log("User left!!!!");
    
  });
});

server.listen(PORT, () => {
  console.log(`Listerning on port ${PORT}`);
  // console.log(process.env.FRONTEND_URL)
});
