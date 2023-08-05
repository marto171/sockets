const express = require('express');
const app = express();
const socketio = require('socket.io');

const namespaces = require('./data/namespaces');
const Room = require('./classes/Room');

app.use(express.static(__dirname + '/public'));

const server = app.listen(9000);
const io = socketio(server);

app.get('/change-ns', function (req, res) {
  namespaces[0].addRoom(new Room(0, 'Deleted Articles', 0));

  io.of(namespaces[0].endpoint).emit('nsChange', namespaces);

  res.json('Page hit!');
});

io.on('connection', function (socket) {
  console.log(socket.handshake);

  // socket.join('chat');
  // io.of('/').to('chat').emit('welcomeToChatRoom', { text: 'Welcome to the chat room!' });

  console.log(socket.id + ' has connected. (server)');

  socket.emit('welcome', 'Welcome from the server.');

  socket.on('clientConnect', function (data) {
    console.log(`${socket.id} has connected. (client)`);
  });

  socket.emit('nsList', namespaces);
});

namespaces.forEach(namespace => {
  io.of(namespace.endpoint).on('connection', function (socket) {
    // console.log(`${socket.id} has connected to ${namespace.endpoint} namespace`);
    socket.on('joinRoom', async function (roomObj, ackCb) {
      const thisNs = namespaces[roomObj.nsId];
      const thisRoomObj = thisNs.rooms.find(room => room.roomTitle === roomObj.roomTitle);
      const thisRoomHistory = thisRoomObj.history;

      let i = 0;
      socket.rooms.forEach(room => {
        if (i !== 0) socket.leave(room);
        i++;
      });

      socket.join(roomObj.roomTitle);

      const sockets = await io.of(namespace.endpoint).in(roomObj.roomTitle).fetchSockets();
      const socketCount = sockets.length;

      ackCb({
        numUsers: socketCount,
        thisRoomHistory,
      });
    });

    socket.on('newMessageToRoom', messageObj => {
      const rooms = socket.rooms;
      const currentRoom = [...rooms][1];

      io.of(namespace.endpoint).to(currentRoom).emit('messageToRoom', messageObj);

      const thisNs = namespaces[messageObj.selectedNsId];
      const thisRoom = thisNs.rooms.find(room => room.roomTitle === currentRoom);
      thisRoom.addMessage(messageObj);
    });
  });
});

// io.of('/admin').on('connection', function (socket) {
//   console.log(socket.id + ' has connected. (admin)');

//   io.of('/admin').emit('messageToClientsFromAdmin', {});
// });
