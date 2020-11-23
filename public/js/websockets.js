let connectedUsers;
const socket = io();
const chatBox = document.querySelector('#chat-message-list');
const sendMsgButton = document.querySelector('#chat-form > button');
const conversationList = document.querySelector('#conversation-list');
const chatTitle = document.querySelector('#chat-title');

let currentRoom;



sendMsgButton.addEventListener('click', (e) => {
    const msgBox = e.target.tagName == 'BUTTON' ? e.target.previousElementSibling : e.target.parentElement.previousElementSibling;
    sendMessage(currentRoom, msgBox.value);
    msgBox.value = '';
});


function joinRoom(userObj) {
    console.log('Joining room with ' + userObj.email);
    socket.emit('join', {room: userObj});
    chatTitle.innerHTML = userObj.name;
    currentRoom = userObj;
    chatBox.innerHTML = ''
}

function sendMessage(room, message) {
    socket.emit('message', {room, message});
    console.log('emitted message to ' + room);
    recieveMessage({room: room.email, translations: [{text: message, to: user.Locale.split('-')[0]}]});
}


function recieveMessage(data) {
    // This is what a message should be in html
    //   <div class="message-row others-message">
    //     <div class="message-content">
    //       <img src="https://rb.gy/dzev5z" alt="My profile picture"/>
    //       <div class="message-text"> Hi, morning </div>
    //       <div class="message-time">Nov 16</div>
    //     </div>
    //   </div>
    const userLocale = user.Locale;
    if (!data.author) {
        data.author = {};
        data.author.name = user.Name;
        data.timestamp = new Date();
    }
    const newMsgElem = document.createElement('div');
    newMsgElem.className = 'message-row';
    newMsgElem.className = newMsgElem.className + ' ' + (data.author.name == user.Name ? 'your-message' : 'others-message');

    const newMsgContentElem = document.createElement('div');
    newMsgContentElem.className = 'message-content';

    const authorImg = document.createElement('img');
    authorImg.src = 'https://rb.gy/dzev5z';

    const msgText = document.createElement('div');
    msgText.className = 'message-text';

    const msgTime = document.createElement('div');
    msgTime.className = 'message-time';

    console.log(data.translations);
    const textForUser = data.translations.find((translation) => {
        return translation.to == userLocale.split('-')[0];
    }).text;
    console.log(textForUser);

    msgText.appendChild(document.createTextNode(JSON.stringify(textForUser)));
    msgTime.appendChild(document.createTextNode(moment(data.timestamp).format('MMM DD, YYYY')));

    if (data.author.name != user.Name) {
        newMsgContentElem.appendChild(authorImg);
    }
    newMsgContentElem.appendChild(msgText)
    newMsgContentElem.appendChild(msgTime)

    newMsgElem.appendChild(newMsgContentElem);

    chatBox.prepend(newMsgElem);
}

function addUser(userObj) {
    const userElem = document.createElement('div');
    userElem.className = 'conversation active';
    const userImg = document.createElement('img');
    userImg.src = 'https://rb.gy/dzev5z';
    const userTitle = document.createElement('div');
    userTitle.className = 'title-text';
    userTitle.innerHTML = userObj.name;
    const userDate = document.createElement('div');
    userDate.className = 'created-date';
    userDate.innerHTML = 'nov 15';

    // const userMsg = document.createElement('div');
    // userMsg.className = 'conversation-msg';
    // userMsg.innerHTML = 'This is a message This is a message This is a message';

    userElem.appendChild(userImg);
    userElem.appendChild(userTitle);
    userElem.appendChild(userDate);
    // userElem.appendChild(userMsg);

    userElem.addEventListener('click', (e) => {
        joinRoom(userObj);
    });

    conversationList.appendChild(userElem);
}


socket.on('connect', () => {
    console.log('You are connected to a websocket.');
    joinRoom({room: 'global', name: 'Global', email: 'global'});

    socket.on('rooms', (data) => {
        console.log('The current available rooms are:');
        console.log(data.rooms);
        connectedUsers = data.rooms;
        conversationList.innerHTML = '';
        Object.keys(connectedUsers).map((userKey) => {
            console.log(userKey, user.Email);
            if (userKey != user.Email) {
                if (userKey == 'global') {
                    addUser({name: 'Global', created_date: new Date(), email: 'global'});
                }
                else {
                    addUser(connectedUsers[userKey]);
                }
            }
        })
    });

    socket.on('join', (data) => {
        console.log('Someone has joined ' + data.room + '. There are currently ' + data.connected + ' people here.');
        
    });
    socket.on('message', (message) => {
        console.log(message);
        recieveMessage(message);
    })
});