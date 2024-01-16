import http from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();

// setting pug
app.set("view engine", "pug");
app.set("views", __dirname + "/views");

// seting static
app.use("/public", express.static(__dirname + "/public"));

// setting route
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// app.listen(3000, handleListen);

const httpServer = http.createServer(app); 
const wsServer = new Server(httpServer);

wsServer.on("connection", socket => {
    socket["nickname"] = "Anonymous";
    socket.on("enter_room", (roomName, nickname, done) => {
        socket["nickname"] = nickname;
        socket.join(roomName);
        done(roomName);
        socket.to(roomName).emit("welcome", socket.nickname);
    });
    socket.on("disconnecting", () =>{
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname));
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("change_nickname", (newNickname, roomName, callback) => {
        const oldNickname = socket.nickname;
        socket["nickname"] = newNickname;
        socket.to(roomName).emit("new_message", `System Message <br/>" - User ${oldNickname}" change nickname to "${newNickname}"`);
        callback(oldNickname, newNickname);
    });
});

/*
const wss = new WebSocket.Server({ server });

const sockets = [];

// backend의 socket (브라우저와 연결)
wss.on("connection", (socket) => {
    console.log("Connected to Browser");
    
    sockets.push(socket);
    socket["nickname"] = "Annon";
    
    socket.on("close", () => console.log("Disconnected from the Browser"));
    socket.on("message", (data) => {
        const jsonMessage = JSON.parse(data);

        switch(jsonMessage.type) {
            case "new_message":
                sockets.forEach((aSocket) => 
                    aSocket.send(`${socket.nickname}: ${jsonMessage.payload}`)
                );
            case "nickname":
                socket["nickname"] = jsonMessage.payload;
        }
    });
});
*/

httpServer.listen(3000, handleListen);