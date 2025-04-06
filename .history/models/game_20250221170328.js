const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  date: { type: Date, required: true },  // Datum utakmice
  opponent: { type: String, required: true },  // Protivnička ekipa
  score: { type: String, required: true },  // Rezultat utakmice (npr. "10-5")
  playerStats: [
    {
      playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Igrač koji je nastupao
      goals: { type: Number, required: true, default: 0 },  // Broj postignutih golova
      assists: { type: Number, required: true, default: 0 },  // Broj asistencija
      matchesPlayed: { type: Number, required: true, default: 1 }  // Broj nastupa (automatski povećano za 1)
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);