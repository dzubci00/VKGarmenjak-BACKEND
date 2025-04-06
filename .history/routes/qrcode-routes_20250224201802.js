const express = require('express');
const { check } = require('express-validator');
const QRCode = require ('qrcode');

const qrcodeController = require('../controllers/qrcode-controllers');
const checkAuth = require('../middleware/check-auth');
//const fileUpload = require('../middleware/file-upload');

const router = express.Router();

//router.use(checkAuth);

router.get("/qrcode/:id/:oib", qrcodeController.qrcodeGenerator); 


module.exports = router;
