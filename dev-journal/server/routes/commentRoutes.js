const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const Post = require('../models/Post');
const User = require('../models/User');

router.post('/', async (req, res) => {
  const { postId, text, userId } = req.body;

  try {
    const commenter = await User.findOne({ uid: userId });
    const post = await Post.findById(postId);

    const comment = new Comment({
      postId,
      text,
      userId,
      userName: commenter?.username || 'Unknown'
    });

    const saved = await comment.save();

    if (post && userId !== post.authorId) {
      await Notification.create({
        userId: post.authorId,
        message: `${commenter?.username || 'Someone'} commented on your post.`,
        type: 'comment'
      });
      console.log(`[NOTIF] Sent comment notification to ${post.authorId}`);
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error('[ERROR] Comment failed:', err);
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
