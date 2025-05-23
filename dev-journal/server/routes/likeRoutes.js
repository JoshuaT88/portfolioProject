const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const User = require('../models/User');

router.put('/:postId', async (req, res) => {
  const { userId } = req.body;

  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id !== userId);
    } else {
      post.likes.push(userId);
      if (userId !== post.authorId) {
        const liker = await User.findOne({ uid: userId });
        await Notification.create({
          userId: post.authorId,
          message: `${liker.username || 'Someone'} liked your post.`,
          type: 'like'
        });
      }
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Like failed' });
  }
});

module.exports = router;
