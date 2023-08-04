const express = require('express');
const app = express();
const socketio = require('socket.io');

app.use(express.static(__dirname + '/public'));

const server = app.listen(8000);
const io = socketio(server);

io.on('connection', function (socket) {
  console.log(socket.id + ' has connected');

  socket.emit('messageFromServer', { data: 'Welcome to the socket server.' });

  socket.on('messageFromClient', function (data) {
    console.log(data);
  });
});
