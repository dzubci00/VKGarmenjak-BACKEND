const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  trainingType: { type: String, required: true },
  playersSignedUp: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  unregisteredPlayers: [
    {
      name: { type: String, required: true },
      surname: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model("Training", trainingSchema);