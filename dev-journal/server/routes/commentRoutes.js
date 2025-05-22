// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const Post = require('../models/Post');

router.post('/', async (req, res) => {
  const { postId, text, userId, userName } = req.body;

  try {
    const comment = new Comment({ postId, text, userId, userName });
    const saved = await comment.save();

    const post = await Post.findById(postId);
    if (post && userId !== post.authorId) {
      await Notification.create({
        userId: post.authorId,
        message: `${userName} commented on your post.`,
        type: 'comment'
      });
    }

    res.status(201).json(saved);
  } catch {
    res.status(500).json({ error: 'Comment failed' });
  }
});

router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ date: -1 });
    res.json(comments);
  } catch {
    res.status(400).json({ error: 'Bad request' });
  }
});

module.exports = router;
