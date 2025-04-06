import { Schema, model } from "mongoose";

const trainingSchema = new Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  trainingType: { type: String, required: true },
  players: [{ playerId: { type: Schema.Types.ObjectId, ref: "User" } }],
  unregisteredPlayers: [{ name: { type: String, required: true } }]
});


export default model("Training", trainingSchema);