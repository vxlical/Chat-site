const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on('join', (username) => {
    socket.username = username;
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', {
      user: msg.user,
      text: msg.text
    });
  });

  socket.on('disconnect', () => {
    console.log(`${socket.username || 'A user'} disconnected`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
