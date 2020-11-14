require('dotenv').config();
let io = require('socket.io')
const passportSocketIo = require('passport.socketio');

const User = require('../models/user');

const onAuthSuccess = (data, accept) => {
    console.log('succesfully connected to the socket auth.');

    accept(null, true);
}

const onAuthFail = (data, msg, err, accept) => {
    if (err) {
        throw new Error(msg);
    }

    console.log('failed to connect', msg);

    accept(null, false)

}

const defaultRoom = 'global';
const rooms = ['global'];
let connectedPeople = 0;
module.exports = (server, sessionStorage) => {
    io = io(server);
    io.use(passportSocketIo.authorize({
        cookieParser: require('cookie-parser'),
        secret: process.env.SECRET,
        store: sessionStorage,
        success: onAuthSuccess,
        fail: onAuthFail
    }));
    io.on('connection', socket => {
        socket.emit('rooms', {
            rooms
        })

        socket.on('join', (data) => {
            connectedPeople++;
            data.room = defaultRoom;
            data.connected = connectedPeople;
            socket.join(data.room);
            socket.to(data.room).emit('join', data);

        });

        socket.on('disconnect', (data) => {
            
            connectedPeople--;
        });

        socket.on('message', (data) => {
            data.sender = socket.request.user.name;
            data.timestamp = new Date();
            console.log('new message sent:', data);
            socket.to(data.room).emit('message', data);
        })

    });
}


