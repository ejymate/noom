var messageList = document.querySelector("ul");
var nickForm = document.querySelector("#nick");
var messageForm = document.querySelector("#message");

// Frontend의 socket (서버와 연결)
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
    console.log("Connected to Server");
});

socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});

socket.addEventListener("close", () => {
    console.log("disconnected to Server");
});

function makeMessage(type, payload) {
    const msg = {type, payload};
    return JSON.stringify(msg);
}

function handleNickForm(event) {
    event.preventDefault();

    const input = nickForm.querySelector("input");
    const spnNickName = nickForm.querySelector("#spnNickname");
    socket.send(makeMessage("nickname", input.value));
    spnNickName.innerText = input.value;
    input.value = "";
}

function handleForm(event) {
    event.preventDefault();

    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    input.value = "";
}

nickForm.addEventListener("submit", handleNickForm);
messageForm.addEventListener("submit", handleForm);