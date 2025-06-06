const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const newsController = require('../controllers/news-controllers');
//const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-upload');

// Dummy podaci za testiranje
/* const news = [
  { id: 1, title: "VK Garmenjak ulazi u VAL ligu!", date: "2024-03-01", content: "Nakon uspješnih sezona, VK Garmenjak se priključuje VAL ligi...ali to nije sve Nakon uspješnih sezona, VK Garmenjak se priključuje VAL ligi..." },
  { id: 2, title: "Turnir u Zadru", date: "2024-02-20", content: `Drugi turnir VAL - liga održan je u Zadru, a mi smo u konkurenciji 9 ekipa osvojili 3. mjesto 🥉🏆
Poredak turnira:
1. Kitovi
2. Gospari
3. Garmenjak
4. Stari Mornar
5. Kolpo
6. Val
7. Nbc
8. Šibenik
9. Marsonia
Čestitamo svim sudionicima`}
]; */

// Ruta za dohvaćanje vijesti
router.get('/', newsController.getNews);

router.post('/article',
  fileUpload.single('image'),
[
  check('title')
    .not()
    .isEmpty(),
  check('content')
    .not()
    .isEmpty()        
], newsController.crateArticle);

module.exports = router;