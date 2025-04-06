const express = require('express');
const { check } = require('express-validator');

const membershipController = require('../controllers/membership-controllers');
const checkAuth = require('../middleware/check-auth');
//const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.use(checkAuth);

/*router.patch(
  '/update-membership',
  //fileUpload.single('image'),
  membershipController.updateMembershipStatus
);*/

router.get('/unpaid-players',membershipController.getUnpaidPlayers);

module.exports = router;
