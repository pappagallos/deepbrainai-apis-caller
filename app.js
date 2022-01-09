const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');

const app = express();
const nodeServer = require('http').createServer(app);
const io = require('socket.io')(nodeServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// set configuration
dotenv.config();
const _SOCKET_PORT = process.env.SOCKET_PORT;

// routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// using libs
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// using router
app.use('/', indexRouter);
app.use('/users', usersRouter);

// socket.io logics
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('message', ({ message }) => {
        console.log(message);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

nodeServer.listen(_SOCKET_PORT, () => {
    console.log(_SOCKET_PORT);
})

module.exports = app;