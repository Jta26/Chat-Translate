require('dotenv').config();
let io = require('socket.io')
const passportSocketIo = require('passport.socketio');
const Message = require('../models/message');

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
        });

        socket.on('join', (data) => {
            connectedPeople++;
            data.room = defaultRoom;
            data.connected = connectedPeople;
            socket.join(data.room);
            socket.to(data.room).emit('join', data);
        });

        socket.on('disconnect', () => {
            connectedPeople--;
        });

        socket.on('message', (data) => {
            data.sender = socket.request.user.name;
            data.timestamp = new Date();
            //do translations here for the new message.
            //save them to translations object like
            // data.translations = {en-US: 'hello', de-DE: 'gutentaag', ja-JP: "こんにちは"}
            // Codes are according to RFC 3066 https://tools.ietf.org/html/rfc3066
            // full list: http://www.lingoes.net/en/translator/langcode.htm
            data.translation = {}
            const newMsg = new Message({author: socket.request.user._id, content: data.message, timestamp: data.timestamp, room: data.room, translation: data.translation})
            newMsg
            .save()
            .then( async (message) => {
                console.log('----------------------------\nnew message sent:', message);
                await message.populate('author').execPopulate();
                message = message.toObject();
                // remove a bunch of things about the author we don't want to be sent to the client.
                delete message.author.email_verified;
                delete message.author._id;
                delete message.author.password;
                delete message.author.created_date;
                delete message.author.email;
                socket.to(message.room).emit('message', message);
            });

        })
    });
}


