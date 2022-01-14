const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const { fetchVideo } = require('./services');

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
const { clearInterval } = require('timers');

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

    // 핵심 기능 테스트
    let interval;
    socket.on('message', ({ message }) => {
        try {
            fetchVideo('이,우진님! 1번, 창구로, 이동해 주시기 바랍니다.', socket);
        } catch (error) {
            console.error(error);
        }
        // interval = setInterval(() => {
        //     socket.emit('show_ai_human', [{number: 10, name: '이우진', video_url: 'https://ai-platform-public.s3.ap-northeast-2.amazonaws.com/ysy_2_45aa07eeeefe54779bd5d46e87907e26.mp4'}]);
        // }, 10000);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        clearInterval(interval);
    });
});

nodeServer.listen(SOCKET_PORT, () => {
    console.log(SOCKET_PORT);
})

module.exports = app;