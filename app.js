const express = require('express');
const asyncify = require('express-asyncify');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { fetchVideo } = require('./services');

const app = asyncify(express());
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
const { clearInterval } = require('timers');

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

// using router
app.use('/client', clientRouter);

// socket.io logics
io.on('connection', (socket) => {
    console.log('a user connected');

    // 핵심 기능 테스트
    socket.on('message', async ({ message }) => {
        try {
            const { callNumber, counterNumber, name, video } = await fetchVideo('21', '이우진', '11', socket);
            console.log(callNumber, counterNumber, name, video);
            socket.emit('show_ai_human', [{ callNumber, counterNumber, name, video }]);

        } catch (error) {
            console.error(error);
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

nodeServer.listen(SOCKET_PORT, () => {
    console.log(SOCKET_PORT);
});
  
module.exports = app;