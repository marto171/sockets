const selectElementDom = (element, nsData) =>
  function () {
    const nsEndpoint = element.getAttribute('ns');
    // console.log(nsEndpoint);

    const clickedNs = nsData.find(row => row.endpoint === nsEndpoint);
    selectedNsId = clickedNs.id;

    const rooms = clickedNs.rooms;

    let roomList = document.querySelector('.room-list');

    roomList.innerHTML = '';

    let firstRoom;

    rooms.forEach((room, i) => {
      if (i === 0) firstRoom = room.roomTitle;

      roomList.innerHTML += `<li class="room" namespaceId="${room.namespaceId}"><span class="fa-solid fa-${
        room.privateRoom ? 'lock' : 'globe'
      }"></span>${room.roomTitle}</li>`;
    });

    joinRoom(firstRoom, clickedNs.id);

    const roomNodes = [...document.querySelectorAll('.room')];
    roomNodes.forEach(roomNode => {
      roomNode.addEventListener('click', function (e) {
        // if (roomNode.querySelector('span').classList.contains('fa-lock')) return alert('This room is private!');
        joinRoom(e.target.innerText, roomNode.getAttribute('namespaceId'));
      });
    });
  };
