const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static(__dirname));

let users = {};

io.on("connection", (socket) => {
    console.log("A user connected");

    // When a user sets their username
    socket.on("set username", (name) => {
        users[socket.id] = name;
        io.emit("users", Object.values(users));
    });

    // When a user sends a message
    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });

    // When a user disconnects
    socket.on("disconnect", () => {
        delete users[socket.id];
        io.emit("users", Object.values(users));
        console.log("A user disconnected");
    });
});

http.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});