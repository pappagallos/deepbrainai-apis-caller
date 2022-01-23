const express = require('express');
const asyncify = require('express-asyncify');
const router = asyncify(express.Router());
const callerModel = require('../models/caller');
const { parseDateFormat } = require('../utils/functions');

/**
 * 대기자 추가 API
 */
router.post('/', async (req, res, next) => {
  try {
    // Express 전역 변수 Socket
    const socket = req.app.locals.socket;
    const { name } = req.body;

    // mongoDB 데이터 추가 후 관리자 페이지에 add_client 소켓 전송
    await (await callerModel.create({ name }));
    const client = await callerModel.find({ is_called: false }).sort({ created_at: 1 });
    socket.emit('add_client', [client]);

    res.status(200).send({ message: 'success.'}).end();

  } catch ({ errors }) {
    res.status(500).send({ errors }).end();
  }
});

module.exports = router;
