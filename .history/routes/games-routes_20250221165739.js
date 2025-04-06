const express = require('express');
const { check } = require('express-validator');

const gamesController = require('../controllers/games-controller');
//const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', gamesController.getUsers);

router.post(
    '/add-game',
    [
      check('date')
        .not()
        .isEmpty()
        .trim()
        .isISO8601()
        .withMessage('Invalid date format'),
      check('opponent')
        .not()
        .isEmpty()
        .trim()
        .withMessage('Opponent name is required'),
      check('score')
        .not()
        .isEmpty()
        .trim()
        .withMessage('Score is required')
    ],
    gamesController.addGame
  );
  
  module.exports = router;
