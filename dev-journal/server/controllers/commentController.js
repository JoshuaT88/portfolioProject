// server/controllers/commentController.js
const Comment = require('../models/Comment');

const createComment = async (req, res) => {
  const { body, userId, userName } = req.body;
  const { postId } = req.params;

  if (!body || !userId || !userName) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const newComment = new Comment({ body, userId, userName, postId });
    const saved = await newComment.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Comment save error:', err);
    res.status(500).json({ error: 'Server error while saving comment.' });
  }
};

const getComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ postId }).sort({ date: -1 });
    res.status(200).json(comments);
  } catch (err) {
    console.error('Get comments error:', err);
    res.status(500).json({ error: 'Failed to fetch comments.' });
  }
};

module.exports = { createComment, getComments };
