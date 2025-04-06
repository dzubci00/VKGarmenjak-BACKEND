const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  trainingType: { type: String, required: true },
  players: [
    {
      playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      isPresent: { type: Boolean, default: true }
    }
  ],
  unregisteredPlayers: [
    {
      name: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model("Training", trainingSchema);