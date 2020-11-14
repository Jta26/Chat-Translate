

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
    socket.on('message', (data) => {
        console.log(data);
        recieveMessage(data);
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
    recieveMessage({room, message});
}


function recieveMessage(data) {
    const newMsgElem = document.createElement('div');
    const newMsgText = document.createElement('p');

    newMsgText.innerHTML = data.message;

    newMsgElem.appendChild(newMsgText);

    chatBox.appendChild(newMsgElem);


}

