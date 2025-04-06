const express = require('express');
const { check } = require('express-validator');

const membershipController = require('../controllers/membership-controllers');
const checkAuth = require('../middleware/check-auth');
//const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', usersController.getUsers);

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
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 4 })
  ],
  usersController.signup
);

router.post('/login', usersController.login);

router.get('/verify-email/:token', usersController.verifyEmail);

router.use(checkAuth);

router.post(
  '/addUser',
  //fileUpload.single('image'),
  [
    check('name')
      .not()
      .isEmpty(),
    check('surname')
      .not()
      .isEmpty(),
    check('role')
      .not()
      .isEmpty(),      
    
  ],
  usersController.addUser
);

router.patch(
  '/update-membership',
  //fileUpload.single('image'),
  usersController.updateMembershipStatus
);

router.get('/unpaid-players',usersController.getUnpaidPlayers);

module.exports = router;
