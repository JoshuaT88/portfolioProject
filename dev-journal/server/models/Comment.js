const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: String,
  userId: String,
  userName: String,
  text: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
