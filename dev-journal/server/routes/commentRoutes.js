const router = require('express').Router();
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const Post = require('../models/Post');

router.post('/', async (req, res) => {
  const { postId, text, userId, userName } = req.body;
  const comment = new Comment({ postId, text, userId, userName });
  const saved = await comment.save();

  const post = await Post.findById(postId);
  if (post && userId !== post.authorId) {
    await Notification.create({
      userId: post.authorId,
      type: 'comment',
      message: `${userName} commented on your post.`,
    });
  }

  res.status(201).json(saved);
});

router.get('/:postId', async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId }).sort({ date: -1 });
  res.json(comments);
});
