require('dotenv').config();
let io = require('socket.io')
const passportSocketIo = require('passport.socketio');
const Message = require('../models/message');
const { translateAll } = require('translation');

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
            // data.translations = {en-US: 'hello', de-DE: 'gutentaag', ja-JP: "こんにちは"}
            data.translations = translateAll(socket.request.user.locale.split('-')[0], data.message)
            data.translations[socket.request.user.locale] = data.message;
            // Codes are according to RFC 3066 https://tools.ietf.org/html/rfc3066
            // full list: http://www.lingoes.net/en/translator/langcode.htm
            const newMsg = new Message({author: socket.request.user._id, timestamp: data.timestamp, room: data.room, translation: data.translation})
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


