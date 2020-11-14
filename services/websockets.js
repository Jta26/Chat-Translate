const defaultRoom = 'global';
const rooms = ['global']
module.exports = (server) => {
    let io = require('socket.io')(server);
    let connectedPeople = 0;
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
            socket.emit('disconnected');
            connectedPeople--;
        });

        socket.on('message', (data) => {
            console.log(data);
            socket.to(data.room).emit('message', data);
        })

    });
}