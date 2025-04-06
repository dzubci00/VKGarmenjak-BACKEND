const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userToAddSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  image: { type: String, required: true },
  role: { type: String, enum: ['player', 'admin', 'coach'], default: 'player' },
  position: { type: String, enum: ['Wing driver', 'Point', 'Hole set', 'Goalkeeper'], default: 'Wing driver' },  
  membershipType: { type: String, enum: ['standard', 'student', 'U21'], default:'standard'},
  membershipPaid: { type: Boolean, default: false },
  refereeMembershipPaid: { type: Boolean, default: false },
  matchesPlayed: { type: Number, default: 0 }, // Ukupan broj odigranih utakmica
  goals: { type: Number, default: 0 }, // Ukupan broj golova
  assists: { type: Number, default: 0 }, // Ukupan broj asistencija 
  
  //image: { type: String, required: true },
  //places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }]
});

userToAddSchema.plugin(uniqueValidator);

module.exports = mongoose.model('UserToAdd', userToAddSchema);
