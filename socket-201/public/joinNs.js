const selectElementDom = (element, nsData) =>
  function () {
    const nsEndpoint = element.getAttribute('ns');
    console.log(nsEndpoint);

    const clickedNs = nsData.find(row => row.endpoint === nsEndpoint);
    const rooms = clickedNs.rooms;

    let roomList = document.querySelector('.room-list');

    roomList.innerHTML = '';

    rooms.forEach(room => {
      roomList.innerHTML += `<li><span class="glyphicon glyphicon-lock"></span>${room.roomTitle}</li>`;
    });
  };
