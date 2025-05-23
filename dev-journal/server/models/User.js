const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  email: String,
  displayName: String,
  username: { type: String, unique: true },
  password: String,
  preferences: {
    notifications: {
      enabled: { type: Boolean, default: true },
      types: {
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        push: { type: Boolean, default: false }
      },
      events: {
        like: { type: Boolean, default: true },
        comment: { type: Boolean, default: true },
        share: { type: Boolean, default: true },
        mention: { type: Boolean, default: true }
      }
    }
  }
});

module.exports = mongoose.model('User', userSchema);
