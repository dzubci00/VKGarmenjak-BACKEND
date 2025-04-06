const express = require('express');
const { check } = require('express-validator');

const gamesController = require('../controllers/games-controller');
//const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', gamesController.getUsers);

router.post(
  '/add-game',
  //fileUpload.single('image'),
  [
    check('date')
      .not()
      .isEmpty(),
    check('opponent')
      .not()
      .isEmpty(),
    check('score')
      .not()
      .isEmpty(),    
    
  ],
  gamesController.addGame
);


module.exports = router;
