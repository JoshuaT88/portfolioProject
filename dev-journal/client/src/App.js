const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  email: String,
  displayName: String,
  username: { type: String, unique: true },
  password: String,
  notifications: {
    type: String,
    enum: ['in-app', 'email', 'push'],
    default: 'in-app',
  },
});

module.exports = mongoose.model('User', userSchema);
