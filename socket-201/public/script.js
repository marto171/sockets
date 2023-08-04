// const username = prompt('What is your username?');
// const password = prompt('What is your password?');

const username = 'me';
const password = 'me';

const socket = io('http://localhost:8000');

socket.on('connect', function () {
  console.log('Connected!');
  socket.emit('clientConnect');
});

socket.on('nsList', nsData => {
  const namespacesDiv = document.querySelector('.namespaces');

  namespacesDiv.innerHTML = '';

  nsData.forEach(ns => {
    namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;
  });

  const elements = [...document.getElementsByClassName('namespace')];

  selectElementDom(elements[0], nsData)();

  elements.forEach(element => {
    element.addEventListener('click', selectElementDom(element, nsData));
  });
});
