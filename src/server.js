import WebSocket from "ws";
import http from "http";
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

// http 내장 함수를 통해 서버를 만들고
// Websocket 서버에 바이딩 시킨다
// => 같은 location 과 같은 포트에서 http 와 ws 프로토콜을 사용할 수 있다.
const server = http.createServer(app); 
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

server.listen(3000, handleListen);