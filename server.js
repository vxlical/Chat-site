const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from public
app.use(express.static('public'));

// ** Fallback route - sends index.html for all requests **
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Socket.io logic ...
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
