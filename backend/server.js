const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 5000;

io.on('connection', socket => {
  console.log('a new user is connected');
  socket.on('disconnect', () => console.log('a user has just left'));
});

app.use(router);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
