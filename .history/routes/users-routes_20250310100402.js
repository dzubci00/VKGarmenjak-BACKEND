const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');
const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', usersController.getUsers);

router.get('/user', checkAuth(), usersController.getUser);

router.get('/players', usersController.getPlayers);

router.post(
  '/signup',
  //fileUpload.single('image'),
  [
    check('name')
      .not()
      .isEmpty(),
    check('surname')
      .not()
      .isEmpty(),  
    check('email')
      .normalizeEmail({ gmail_remove_dots: false }) // Ostavlja točke u Gmail adresama
      .isEmail(),
    check('password').isLength({ min: 4 })
  ],
  usersController.signup
);

router.post('/login', usersController.login);

router.get('/verify-email/:token', usersController.verifyEmail);

//router.use(checkAuth);

router.post(
  '/addUser',
  fileUpload.single('image'),
  [
    check('name')
      .not()
      .isEmpty(),
    check('surname')
      .not()
      .isEmpty()        
  ],
  usersController.addUser 
);

module.exports = router;
