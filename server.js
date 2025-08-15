const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
io.on('connection', (socket) => {
  socket.on('join', (username) => {
    socket.username = username;
    console.log(`${username} joined`);
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
app.use(express.static('public'));
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
