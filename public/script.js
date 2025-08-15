const socket = io();
let username = "";

function setUsername() {
  const input = document.getElementById('usernameInput');
  username = input.value.trim();
  if (username !== "") {
    document.getElementById('overlay').style.display = "none";
    document.querySelector('.chat-container').style.display = "block";
    socket.emit("join", username);
  }
}

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value && username) {
    socket.emit('chat message', { user: username, text: input.value });
    input.value = '';
  }
});

socket.on('chat message', (msg) => {
  const item = document.createElement('div');
  item.textContent = `${msg.user}: ${msg.text}`;
  item.className = msg.user === username ? 'mine' : '';
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});
