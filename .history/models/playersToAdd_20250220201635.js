const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const playerToAddSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  role: { type: String, enum: ['player', 'admin'], default: 'player' }
  
  //image: { type: String, required: true },
  //places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }]
});

playerToAddSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Player', playerToAddSchema);
