const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Lista prijavljenih igrača
});

module.exports = mongoose.model("Training", trainingSchema);