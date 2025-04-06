const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  date: { type: Date, required: true, default: Date.now }, // Postavlja trenutni datum automatski
  content: { type: String, required: true },
  image: { type: String, required: true },
}, { timestamps: true }); // Automatski dodaje createdAt i updatedAt

module.exports = mongoose.model('News', newsSchema);