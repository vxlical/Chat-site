const socket = io();
let username = '';

function setUsername() {
  const input = document.getElementById('usernameInput');
  username = input.value.trim();
  if (!username) return;
  document.getElementById('overlay').style.display = 'none';
  socket.emit('join', username);
}

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!input.value.trim() || !username) return;
  socket.emit('chat message', { user: username, text: input.value });
  input.value = '';
});

socket.on('chat message', (msg) => {
  const el = document.createElement('div');
  el.textContent = `${msg.user}: ${msg.text}`;
  el.className = 'message' + (msg.user === username ? ' mine' : '');
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
});
