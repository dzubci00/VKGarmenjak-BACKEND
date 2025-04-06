const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  trainingType: { type: String, required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  unregisteredPlayers: [
    {
      name: { type: String, required: true }
    }
  ],
  attendance: [
    {
      playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      isPresent: { type: Boolean, default: false }
    }
  ]
});

module.exports = mongoose.model("Training", trainingSchema);