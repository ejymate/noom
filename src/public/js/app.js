const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let current_roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerHTML = message;
  ul.appendChild(li);
}

function handleChangeNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  socket.emit("change_nickname", input.value, current_roomName, (oldName, newName) => {
    addMessage(`System Message <br/> - User "${oldName}" change nickname to "${newName}"`);
  });
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const myMessage = input.value;
  socket.emit("new_message", input.value, current_roomName, () => {
    addMessage(`You: ${myMessage}`);
  });
  input.value = "";
}

function showRoom(roomName) {
  welcome.hidden = true;
  room.hidden = false;
  current_roomName = roomName;
  
  const roomTitle = room.querySelector("#root-title");
  roomTitle.innerHTML = `Room: ${roomName}`;
  
  const nameForm = room.querySelector("#name");
  nameForm.querySelector("input").value = form.querySelector("#ipt-nickname").value;
  const msgForm = room.querySelector("#msg");


  nameForm.addEventListener("submit", handleChangeNicknameSubmit);
  msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const roomName = form.querySelector("#ipt-roomName");
  const nickname = form.querySelector("#ipt-nickname");

  if(roomName.value === "" && nickname === "") {
    alert("Room Name & NickName is not blank.");
    return;
  }
  socket.emit("enter_room", roomName.value, nickname.value, showRoom);
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
  addMessage(`${user} joined!`);
});

socket.on("bye", (user) => {
  addMessage(`${user} left ㅠㅠ`);
});

socket.on("new_message", addMessage);
