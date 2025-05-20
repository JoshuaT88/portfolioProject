const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  authorId: { type: String, required: true },
  authorName: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
