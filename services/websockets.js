

module.exports = (server) => {
    let io = require('socket.io')(server);
    io.on('connection', socket => {
        let counter = 0;
        setInterval(() => {
            socket.emit('hello', counter++)
        }, 1000)
        socket.emit('message', {message: 'Hello!'});
    });
}