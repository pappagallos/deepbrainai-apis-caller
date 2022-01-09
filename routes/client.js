const express = require('express');
const asyncify = require('express-asyncify');
const router = asyncify(express.Router());
const callerModel = require('../models/caller');

/**
 * 대기자 추가 API
 */
router.post('/', async (req, res, next) => {
  try {
    const { counter_number, customer_name } = req.body;

    await callerModel.create({
      counter_number,
      customer_name
    });

    res.status(200).send({ message: 'success.'}).end();

  } catch ({ errors }) {
    res.status(500).send({ errors }).end();
  }
});

module.exports = router;
