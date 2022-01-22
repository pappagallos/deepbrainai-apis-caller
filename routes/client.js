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
    const { counter_number, name } = req.body;

    // 오늘 일자로 생성된 데이터가 있는지 확인
    const date = new Date();
    const today = parseDateFormat(date, '-');
    const latestTicket = await callerModel.findOne().sort({ created_at: 'desc' }).where('created_at');
    console.log(latestTicket);

    // await callerModel.create({
    //   call_number: (latestTicket && latestTicket.call_number) ? Number(latestTicket.call_number) + 1 : 1,
    //   counter_number,
    //   name
    // });

    res.status(200).send({ message: 'success.'}).end();

  } catch ({ errors }) {
    res.status(500).send({ errors }).end();
  }
});

module.exports = router;
