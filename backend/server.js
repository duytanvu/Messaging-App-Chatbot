const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const axios = require('axios').default;
require('dotenv').config();

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5000;

app.use(router);
app.use(cors);

io.on('connection', socket => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit('message', {
      user: 'Admin',
      text: `${user.name}, welcome to the room ${user.room}!`,
    });

    socket.broadcast.to(user.room).emit('message', {
      user: 'Admin',
      text: `${user.name} has joined the room.`,
    });

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    const subString = message.split(' ');

    if (subString[0] === '!covid') {
      axios
        .get('https://api.covid19tracker.ca/summary')
        .then(({ data }) => {
          io.to(user.room).emit('message', {
            isChatbot: true,
            botData: 'covid',
            user: user.name,
            text: JSON.stringify(data),
          });
        })
        .catch(err => {
          io.to(user.room).emit('message', {
            isChatbot: true,
            user: user.name,
            text: 'Error - cannot fetch latest data about covid-19 right now.',
          });
        });
    } else if (subString[0] === '!stock') {
      const symbol = subString[1];
      axios
        .get(
          `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${process.env.FINANCIAL_MODELING_PREP_API_KEY}`
        )
        .then(({ data }) => {
          io.to(user.room).emit('message', {
            isChatbot: true,
            botData: 'stock',
            user: user.name,
            text: JSON.stringify(data),
          });
        })
        .catch(err => {
          io.to(user.room).emit('message', {
            isChatbot: true,
            user: user.name,
            text:
              'Error - cannot fetch latest data about stock market right now.',
          });
        });
    } else if (subString[0] === '!weather') {
      const city = subString[1];
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}&units=metric`
        )
        .then(({ data }) => {
          io.to(user.room).emit('message', {
            isChatbot: true,
            botData: 'weather',
            user: user.name,
            text: JSON.stringify(data),
          });
        })
        .catch(err => {
          io.to(user.room).emit('message', {
            isChatbot: true,
            user: user.name,
            text:
              'Error - cannot fetch latest data about weather forecast right now.',
          });
        });
    }
    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'Admin',
        text: `${user.name} has left the room.`,
      });

      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
