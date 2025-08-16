const socket = io();

let user = {
  username: '',
  profilePic: ''
};

function enterChat() {
  const usernameInput = document.getElementById("username");
  const fileInput = document.getElementById("profilePic");

  const username = usernameInput.value.trim();
  if (!username) return alert("Please enter a username.");

  user.username = username;

  if (fileInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = () => {
      user.profilePic = reader.result;
      finalizeJoin();
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    finalizeJoin();
  }
}

function finalizeJoin() {
  document.getElementById("join-screen").classList.add("hidden");
  document.getElementById("chat-screen").classList.remove("hidden");

  socket.emit("join", user);
}

const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const messages = document.getElementById("chat-messages");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  socket.emit("chat message", {
    user,
    text
  });

  input.value = '';
});

socket.on("chat message", ({ user, text }) => {
  const msg = document.createElement("div");
  msg.className = "message";

  const avatar = document.createElement("img");
  avatar.src = user.profilePic || "https://placehold.co/40x40";

  const content = document.createElement("div");
  content.className = "message-content";

  const username = document.createElement("div");
  username.className = "message-username";
  username.textContent = user.username;

  const messageText = document.createElement("div");
  messageText.textContent = text;

  content.appendChild(username);
  content.appendChild(messageText);
  msg.appendChild(avatar);
  msg.appendChild(content);

  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
});
