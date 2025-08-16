const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ✅ Serve frontend
app.use(express.static('public'));

// ✅ Fallback route to load index.html
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// ✅ Socket.io logic
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

// ✅ Use dynamic port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
const express = require('express');
