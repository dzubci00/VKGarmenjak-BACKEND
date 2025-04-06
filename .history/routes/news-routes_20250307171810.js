const express = require('express');
const router = express.Router();

// Dummy podaci za testiranje
const news = [
  { id: 1, title: "VK Garmenjak ulazi u VAL ligu!", date: "2024-03-01", content: "Nakon uspješnih sezona, VK Garmenjak se priključuje VAL ligi..." },
  { id: 2, title: "Pašmanski dupin turnir", date: "2024-02-20", content: "Drugi po redu turnir okupio je rekordan broj timova..." }
];

// Ruta za dohvaćanje vijesti
router.get('/news', (req, res) => {
  res.json(news);
});

module.exports = router;