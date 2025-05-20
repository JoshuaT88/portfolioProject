const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

router.post('/', async (req, res) => {
  const { postId, text, userId, userName } = req.body;
  try {
    const comment = new Comment({ postId, text, userId, userName });
    const saved = await comment.save();
    res.status(201).json(saved);
  } catch {
    res.status(500).json({ error: 'Comment failed' });
  }
});

router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.json(comments);
  } catch {
    res.status(400).json({ error: 'Bad request' });
  }
});

module.exports = router;
