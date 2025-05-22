const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firebaseId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true }, // In real apps, hash this!
  dateCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
