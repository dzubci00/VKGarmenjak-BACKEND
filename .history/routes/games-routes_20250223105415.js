const express = require('express');
const { check } = require('express-validator');

const gamesController = require('../controllers/games-controller');
//const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.post(
  '/add-game',
  [
    check('opponent')
      .not()
      .isEmpty()
      .trim()
      .withMessage('Opponent name is required'),

    check('score')
      .not()
      .isEmpty()
      .trim()
      .matches(/^\d{1,2}-\d{1,2}$/)
      .withMessage('Score must be in format "10-8"'),

    check('tournament')
      .not()
      .isEmpty()
      .isMongoId()
      .withMessage('Valid tournament ID is required')
  ],
  gamesController.addGame
);
  
  module.exports = router;
