const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  date: { type: Date, required: true},
  content: { type: String, required: true},
  image:{type: String, required: true},
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