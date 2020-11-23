let connectedUsers;
const socket = io();
const chatBox = document.querySelector('#chat-message-list');
const sendMsgButton = document.querySelector('#chat-form > button');
const conversationList = document.querySelector('#conversation-list');
const chatTitle = document.querySelector('#chat-title span');
const chatInput = document.querySelector('#chat-form input');

let currentRoom;



sendMsgButton.addEventListener('click', (e) => {
    const msgBox = e.target.tagName == 'BUTTON' ? e.target.previousElementSibling : e.target.parentElement.previousElementSibling;
    sendMessage(currentRoom, msgBox.value);
    msgBox.value = '';
});

chatInput.addEventListener('keyup', (e) => {
    // if the enter key is pressed when focused on the input
    if (e.keyCode == 13) {
        e.preventDefault();
        const msgBox = e.currentTarget;
        sendMessage(currentRoom, msgBox.value);
        msgBox.value = '';
    }
})



async function joinRoom(userObj) {
    console.log('Joining room with ' + userObj.email);
    socket.emit('join', {room: userObj});
    chatTitle.innerHTML = userObj.name;
    currentRoom = userObj;
    chatBox.innerHTML = '';
    console.log('user', userObj);
    const messageResponse = await fetch('/messages/', {
        method: 'POST',
        body: JSON.stringify(userObj),
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const messages = await messageResponse.json();

    for (let msg of messages) {
        recieveMessage(msg);
    }



}

function sendMessage(room, message) {
    socket.emit('message', {room, message});
    console.log('emitted message to ' + room);
    recieveMessage({room: room.email, translations: [{text: message, to: user.Locale.split('-')[0]}]});
}

function recieveSeverMessage(message) {
    const serverMsgElem = document.createElement('p');
    serverMsgElem.className = 'server-message';
    serverMsgElem.innerHTML = message;
    chatBox.prepend(serverMsgElem);
}

function recieveMessage(data) {
    // This is what a message should be in html
    //   <div class="message-row others-message">
    //     <div class="message-content">
    //       <img src="https://rb.gy/dzev5z" alt="My profile picture"/>
    //       <p class='message-user'>Joel Austin</p>
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

    const userName = document.createElement('p');
    userName.className = 'message-user';
    userName.innerHTML = data.author.name;

    const msgText = document.createElement('div');
    msgText.className = 'message-text';

    const msgTime = document.createElement('div');
    msgTime.className = 'message-time';

    console.log(data.translations);
    const textForUser = data.translations.find((translation) => {
        return translation.to == userLocale.split('-')[0];
    }).text;
    console.log(textForUser);

    msgTextp = document.createElement('p');
    msgTextp.innerHTML = textForUser;
    msgText.appendChild(msgTextp);
    msgTime.appendChild(document.createTextNode(moment(data.timestamp).format('MMM DD, YYYY')));

    const translationToolTip = createTranslationToolTip(data.translations);
    console.log(translationToolTip);
    msgText.appendChild(translationToolTip);

    if (data.author.name != user.Name) {
        const fromContent = document.createElement('div');
        fromContent.appendChild(authorImg);
        fromContent.appendChild(userName);
        fromContent.className = 'from-container';
        newMsgContentElem.appendChild(fromContent);
        
    }
    newMsgContentElem.appendChild(msgText);
    newMsgContentElem.appendChild(msgTime);

    newMsgElem.appendChild(newMsgContentElem);

    chatBox.prepend(newMsgElem);
    //Set the scroll to the bottom;
    chatBox.scrollTop = chatBox.scrollHeight;
}

function createTranslationToolTip(translations) {
    const toolTipElem = document.createElement('div');
    toolTipElem.className = 'translation-tooltip';
    const toolTipTitle = document.createElement('h3');
    toolTipElem.appendChild(toolTipTitle);
    toolTipTitle.innerHTML = 'Other translations';
    for (let translation of translations) {
        const translationText = document.createElement('p');
        translationText.innerHTML = `<b>${TranslationsMap[translation.to]}</b>: ${translation.text}`;
        toolTipElem.appendChild(translationText);
    }

    return toolTipElem;
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
        console.log(data.serverMessage);
        recieveSeverMessage(data.serverMessage);
        
    });
    socket.on('message', (message) => {
        console.log(message);
        recieveMessage(message);
    })
});