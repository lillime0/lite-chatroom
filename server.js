import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { formatMessageDate } from "./utils/messages.js";
import { addUser, getUser, removeUser, users } from "./utils/users.js";

// app.set("trust proxy", 1);

const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", socket => {
  socket.on("join", username => {
    const user = addUser(socket.id, username);
    io.emit("room users", users);
    if (user) {
      socket.emit(
        "message",
        formatMessageDate(`Welcome to ChatRoom, ${user.username}!`)
      );
      socket.on("chat message", msg => {
        const user = getUser(socket.id);
        io.emit("message", formatMessageDate(msg, user.username));
      });
    }
    socket.broadcast.emit(
      "message",
      formatMessageDate(`${username || "Someone"} has joined the chat!`)
    );
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    // if (user) {
    io.emit(
      "message",
      formatMessageDate(`${user?.username || "Someone"} has left the chat!`)
    );
    io.emit("room users", users);
    // }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, console.log(`Server is listening on port ${PORT}...`));
