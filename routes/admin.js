const express = require('express');
const asyncify = require('express-asyncify');
const router = asyncify(express.Router());
const callerModel = require('../models/caller');
const { fetchVideo } = require('../services');

/**
 * 대기자 리스트 API
 */
router.get('/', async (req, res, next) => {
    try {
        // mongoDB 데이터 추가 후 관리자 페이지에 add_client 소켓 전송
        const data = await callerModel.find({ is_called: false });
  
        res.status(200).send({ message: 'success.', data }).end();
    } catch ({ errors }) {
      res.status(500).send({ errors }).end();
    }
});

/**
 * 대기자 호출 API
 */
router.put('/', async (req, res, next) => {
    try {
        // Express 전역 변수 Socket
        const socket = req.app.locals.socket;
        const { id, counter_number } = req.body;
        
        const client = await callerModel.findById(id);
        const fetchVideoResponse = await fetchVideo(client.name, counter_number, socket);
        
        await callerModel.findByIdAndUpdate(id, {is_called: true});

        socket.emit('complete_client', [{ id }]);
        socket.emit('show_ai_human', [{
            counterNumber: fetchVideoResponse.counterNumber, 
            name: fetchVideoResponse.name, 
            video: fetchVideoResponse.video 
        }]);
  
        res.status(200).send({ message: 'success.'}).end();
  
    } catch ({ errors }) {
        res.status(500).send({ errors }).end();
    }
});

/**
 * 대기자 삭제 API
 */
router.delete('/:id', async (req, res, next) => {
    try {
        // Express 전역 변수 Socket
        const socket = req.app.locals.socket;
        const { id } = req.params;
        
        // mongoDB 데이터 추가 후 관리자 페이지에 add_client 소켓 전송
        await callerModel.findByIdAndDelete(id);
        socket.emit('deleted_client', [{ id }]);
  
        res.status(200).send({ message: 'success.'}).end();
  
    } catch ({ errors }) {
        res.status(500).send({ errors }).end();
    }
});

module.exports = router;