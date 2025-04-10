const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  image: { type: String, required: true },
  pointsPerTournament: [
    {
      tournamentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tournament",
        required: true,
      },
      points: { type: Number, default: 0 },
    },
  ],
});

module.exports = mongoose.model("Team", teamSchema);
