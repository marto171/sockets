const express = require('express');
const app = express();
const socketio = require('socket.io');

const namespaces = require('./data/namespaces');

app.use(express.static(__dirname + '/public'));

const server = app.listen(8000);
const io = socketio(server);

io.on('connection', function (socket) {
  console.log(socket.id + ' has connected. (server)');

  socket.emit('welcome', 'Welcome from the server.');

  socket.on('clientConnect', function (data) {
    console.log(`${socket.id} has connected. (client)`);
  });

  socket.emit('nsList', namespaces);
});
