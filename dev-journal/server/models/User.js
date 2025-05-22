const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: String,
  displayName: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    notifications: {
      email: { type: Boolean, default: false },
      push: { type: Boolean, default: false },
      inApp: { type: Boolean, default: true }
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
