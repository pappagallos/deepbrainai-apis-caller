const express = require('express');
const asyncify = require('express-asyncify');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const app = asyncify(express());
const nodeServer = require('http').createServer(app);
const io = require('socket.io')(nodeServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'DELETE', 'PUT']
    }
});

// set configuration
dotenv.config();
const { SOCKET_PORT, MONGO_URI } = process.env;

const clientRouter = require('./routes/client');
const adminRouter = require('./routes/admin');

// mongoose configuration
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));

// using libs
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// 라우터 구성
app.use('/client', clientRouter);
app.use('/admin', adminRouter);

// socket.io
io.on('connection', (socket) => {
    app.locals.socket = io.sockets;
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

nodeServer.listen(SOCKET_PORT, () => {
    console.log(SOCKET_PORT);
});

module.exports = app;