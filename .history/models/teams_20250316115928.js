const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  pointsPerTournament: [{ type: Number, default: 0 }], // Svaki element niza predstavlja bodove po turniru
});

module.exports = mongoose.model("Team", teamSchema);
