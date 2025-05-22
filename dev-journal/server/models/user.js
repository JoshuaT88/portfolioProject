const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: String,
  username: String,
  password: String,
  email: String,
  notificationPrefs: {
    type: String,
    enum: ['email', 'push', 'in-app'],
    default: 'in-app'
  }
});

module.exports = mongoose.model('User', userSchema);
