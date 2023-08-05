const buildMessageHTML = function (messageObj) {
  const date = new Date(messageObj.date).toLocaleString();
  return `
    <li>
     <div class="user-image">
       <img src="${messageObj.avatar}" />
     </div>
     <div class="user-message">
       <div class="user-name-time">${messageObj.username} <span>${date}</span></div>
       <div class="message-text">${messageObj.newMessage}</div>
     </div>
    </li>
    `;
};
