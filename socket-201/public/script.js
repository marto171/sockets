// const username = prompt('What is your username?');
// const password = prompt('What is your password?');

const username = 'me';
const password = 'me';

const clientOptions = {
  auth: {
    username,
    password,
  },
};

const socket = io('http://localhost:9000', clientOptions);
// const socketWiki = io('http://localhost:9000/wiki');
// const socketMozilla = io('http://localhost:9000/mozilla');
// const socketLinux = io('http://localhost:9000/linux');

const namespaceSockets = [];
const listeners = {
  nsChange: [],
  messageToRoom: [],
};

let selectedNsId = 0;
document.querySelector('#message-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const newMessage = document.querySelector('#user-message').value;

  namespaceSockets[selectedNsId].emit('newMessageToRoom', {
    username,
    avatar: 'https://via.placeholder.com/30',
    newMessage,
    date: Date.now(),
    selectedNsId,
  });

  document.querySelector('#user-message').value = '';
});

const addListeners = nsId => {
  if (!listeners.nsChange[nsId]) {
    namespaceSockets[nsId].on('nsChange', function (nsData) {
      console.log('nsChange', nsData);
    });

    listeners.nsChange[nsId] = true;
  }

  if (!listeners.messageToRoom[nsId]) {
    namespaceSockets[nsId].on('messageToRoom', function (messageObj) {
      document.querySelector('#messages').innerHTML += buildMessageHTML(messageObj);
    });

    listeners.messageToRoom[nsId] = true;
  }
};

socket.on('connect', function () {
  console.log('Connected!');
  socket.emit('clientConnect');
});

socket.on('welcomeToChatRoom', function (data) {
  console.log(data.text);
});

socket.on('nsList', nsData => {
  const namespacesDiv = document.querySelector('.namespaces');

  namespacesDiv.innerHTML = '';

  nsData.forEach(ns => {
    namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;
    io(`http://localhost:9000${ns.endpoint}`);

    if (!namespaceSockets[ns.id]) namespaceSockets[ns.id] = io(`http://localhost:9000${ns.endpoint}`);

    addListeners(ns.id);
  });

  const elements = [...document.getElementsByClassName('namespace')];

  selectElementDom(elements[0], nsData)();

  elements.forEach(element => {
    element.addEventListener('click', selectElementDom(element, nsData));
  });
});
