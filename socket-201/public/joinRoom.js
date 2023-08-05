const joinRoom = async function (roomTitle, nsId) {
  //   namespaceSockets[nsId].emit('joinRoom', roomTitle, ackRes => {
  //     console.log(ackRes);

  //     document.querySelector('.curr-room-num-users').innerHTML = `${ackRes.numUsers}<span class="fa-solid fa-user"></span>`;
  //     document.querySelector('.curr-room-text').innerHTML = roomTitle;
  //   });

  const ackRes = await namespaceSockets[nsId].emitWithAck('joinRoom', { roomTitle, nsId });

  // console.log(ackRes);
  document.querySelector('.curr-room-num-users').innerHTML = `${ackRes.numUsers}<span class="fa-solid fa-user"></span>`;
  document.querySelector('.curr-room-text').innerHTML = roomTitle;

  document.querySelector('#messages').innerHTML = '';

  ackRes.thisRoomHistory.forEach(message => {
    document.querySelector('#messages').innerHTML += buildMessageHTML(message);
  });
};
