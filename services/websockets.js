require('dotenv').config();
let io = require('socket.io')
const passportSocketIo = require('passport.socketio');
const Message = require('../models/message');
const { translateAll } = require('./translation');
const { getRoomID } = require('./rooms');
const onAuthSuccess = (data, accept) => {
    console.log(`Successfully connected authenticated user ${data.user.email} to the websockets.`);
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
let connectedPeople = {
    'global': 'global'
};

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
        socket.join('rooms_data');
        const joinedUser = socket.request.user;
        delete joinedUser.password;
        delete joinedUser.email_verified;
        delete joinedUser._id;
        delete joinedUser.created_date;
        connectedPeople[joinedUser.email] = joinedUser;
        io.in('rooms_data').emit('rooms', {'rooms':connectedPeople});

        socket.on('join', (data) => {   
            toUser = data.room.email || 'global'; 
            for (let room in socket.rooms) {
                room == 'rooms_data' ? null : socket.leave(room);
            }
            if (!data.room || data.room.name == 'Global') {
                data.room = defaultRoom;
                connectedPeople[joinedUser.email] = joinedUser;
                io.in('rooms_data').emit('rooms', {'rooms':connectedPeople});
            }
            else {
                data.room = getRoomID([socket.request.user, data.room]);
            }
            socket.join(data.room);
            data.serverMessage = `${joinedUser.email} is talking to ${toUser} in room ${data.room}`;
            console.log(data.serverMessage);
            socket.to(data.room).emit('join', data);
        });

        socket.on('disconnect', () => {
            const disconnectedUser = socket.request.user.email;
            console.log(`${disconnectedUser} disconnected`);
            delete connectedPeople[disconnectedUser];
            console.log(socket.rooms);
            io.in('rooms_data').emit('rooms', {'rooms': connectedPeople});
        });

        socket.on('message', async (data) => {
            data.sender = socket.request.user.name;
            data.timestamp = new Date();
            data.original_language = socket.request.user.locale;
            //do translations here for the new message.
            // data.translations = {en-US: 'hello', de-DE: 'gutentaag', ja-JP: "こんにちは"}
            data.translations = await translateAll(data.original_language, data.message);
            data.translations.push({text: data.message, to: data.original_language});
            // Codes are according to RFC 3066 https://tools.ietf.org/html/rfc3066
            // full list: http://www.lingoes.net/en/translator/langcode.htm

            if (!data.room || data.room.email == 'global') {
                data.room = 'global';
            }
            else {
                console.log(socket.request.user.email)
                data.room = getRoomID([socket.request.user, data.room])
            }
            console.log(socket.rooms);
            const newMsg = new Message({
                author: socket.request.user._id, 
                timestamp: data.timestamp, 
                room: data.room, 
                original_language: data.original_language, 
                translations: data.translations
            })
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
                socket.to(message.room).emit('message', message);
            });
        })
    });
}


