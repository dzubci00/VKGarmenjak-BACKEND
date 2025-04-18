const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true }, // Protivnička ekipa
    score: { type: String, required: true }, // Rezultat utakmice (npr. "10-5")
    phase: { type: String, required: true }, // faza turnira (npr. "grupa")
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    }, // Povezivanje s turnirom
    playerStats: [
      {
        playerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        }, // Igrač koji je nastupao
        goals: { type: Number, required: true, default: 0 }, // Broj postignutih golova
        assists: { type: Number, required: true, default: 0 }, // Broj asistencija  // Broj nastupa (automatski povećano za 1)
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);
