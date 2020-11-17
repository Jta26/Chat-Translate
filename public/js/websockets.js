let availableRooms;
const socket = io();
socket.on('connect', () => {
    console.log('You are connected to a websocket.');
    socket.emit('join', {});

    socket.on('rooms', (data) => {
        console.log('The current available rooms are:');
        data.rooms.map((room) => {
            console.log(room);
        })
        availableRooms = data.rooms;
    });

    socket.on('join', (data) => {
        console.log('Someone has joined ' + data.room + '. There are currently ' + data.connected + ' people here.');
    });
    socket.on('message', (message) => {
        console.log(message);
        recieveMessage(message);
    })
});

const chatBox = document.querySelector('.chat > div:nth-of-type(1)');

const sendMsgButton = document.querySelector('.chat > div:nth-of-type(2) > button');
sendMsgButton.addEventListener('click', (e) => {
    const msgBox = e.target.previousElementSibling;
    sendMessage('global', msgBox.value);
})

function sendMessage(room, message) {
    socket.emit('message', {room, message});
    console.log('emitted message to ' + room);
    recieveMessage({room, translations: [{text: message, to: user.Locale.split('-')[0]}]});
}

function recieveMessage(data) {
    const userLocale = user.Locale;
    if (!data.author) {
        data.author = {};
        data.author.name = 'You';
        data.timestamp = new Date();
    }
    const newMsgElem = document.createElement('div');
    const newMsgText = document.createElement('p');
    const authorText = document.createElement('span');
    console.log(data.translations);
    const textForUser = data.translations.find((translation) => {
        return translation.to == userLocale.split('-')[0];
    }).text;
    console.log(textForUser);

    authorText.innerHTML = data.author.name + ': ';
    newMsgText.appendChild(authorText);
    newMsgText.appendChild(document.createTextNode(JSON.stringify(textForUser)));

    newMsgElem.className = 'message';
    newMsgElem.appendChild(newMsgText);

    chatBox.appendChild(newMsgElem);
}

