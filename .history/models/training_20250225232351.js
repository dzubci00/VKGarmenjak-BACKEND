const trainingSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  trainingType: { type: String, required: true },
  players: [
    {
      playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      isPresent: { type: Boolean, default: false }
    }
  ],
  unregisteredPlayers: [
    {
      name: { type: String, required: true }
    }
  ]
});