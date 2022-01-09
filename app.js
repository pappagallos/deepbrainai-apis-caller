const express = require('express');
const mongoose = require('mongoose');
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
const { SOCKET_PORT, MONGO_URI } = process.env;

// routers
const clientRouter = require('./routes/client');

// mongoose configuration
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));

// using libs
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// using router
app.use('/client', clientRouter);

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

nodeServer.listen(SOCKET_PORT, () => {
    console.log(SOCKET_PORT);
})

module.exports = app;