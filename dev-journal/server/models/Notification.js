// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: String,
  read: { type: Boolean, default: false },
  type: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
