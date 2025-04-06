const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  surname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  image:{type: String, required: true},
  role: { type: String, enum: ['player', 'admin', 'coach'], default: 'player' },
  position: { type: String, enum: ['Wing driver', 'Point', 'Hole set', 'Goalkeeper'], default: 'Wing driver' },  
  membershipPaid: { type: Boolean, default: false },
  membershipType: { type: String, enum: ['standard', 'student', 'U21'],  default: 'standard'},
  membershipFee: { type: Number },
  refereeMembershipPaid: { type: Boolean, default: false },  // Ovdje pohranjujemo da li je sudijska članarina plaćena
  refereeMembershipFee: { type: Number, default: 20 },  // Iznos sudijske članarine
  matchesPlayed: { type: Number, default: 0 }, // Ukupan broj odigranih utakmica
  goals: { type: Number, default: 0 }, // Ukupan broj golova
  assists: { type: Number, default: 0 }, // Ukupan broj asistencija 
  isVerified: { type: Boolean, default: false }
}, { timestamps: true }); // Automatski dodaje createdAt i updatedAt

userSchema.pre('save', function (next) {
  if (this.membershipType === 'standard') {
    this.membershipFee = 70;
  } else if (this.membershipType === 'student' || this.membershipType === 'U21') {
    this.membershipFee = 35;
  }
  next();
});

// Osigurava da email bude unikatan
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);