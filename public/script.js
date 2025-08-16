const socket = io();
let username = "";
let profilePicData = "";

function setUsername() {
  const nameInput = document.getElementById("usernameInput");
  const picInput = document.getElementById("picInput");

  username = nameInput.value.trim();

  if (!username) return;

  // Read image file
  if (picInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profilePicData = e.target.result;
      completeLogin();
    };
    reader.readAsDataURL(picInput.files[0]);
  } else {
    completeLogin();
  }
}

function completeLogin() {
  document.getElementById("overlay").style.display = "none";
  document.querySelector(".chat-container").style.display = "block";
  socket.emit("join", { username, profilePic: profilePicData });
}

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value && username) {
    socket.emit("chat message", {
      user: username,
      text: input.value,
      profilePic: profilePicData
    });
    input.value = '';
  }
});

socket.on("chat message", (msg) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("message");
  if (msg.user === username) wrapper.classList.add("mine");

  const img = document.createElement("img");
  img.src = msg.profilePic || "https://placehold.co/35x35"; // fallback avatar

  const text = document.createElement("div");
  text.textContent = `${msg.user}: ${msg.text}`;

  wrapper.appendChild(img);
  wrapper.appendChild(text);
  messages.appendChild(wrapper);
  messages.scrollTop = messages.scrollHeight;
});
