const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  standings: [
    {
      teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
      },
      teamName: { type: String, required: true },
      position: { type: Number, default: 0 },
      points: { type: Number, default: 0 },
    },
  ],
});

module.exports = mongoose.model("Tournament", tournamentSchema);
