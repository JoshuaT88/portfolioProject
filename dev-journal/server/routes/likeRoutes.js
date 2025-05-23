const router = require('express').Router();
const Post = require('../models/Post');
const Notification = require('../models/Notification');

router.put('/:postId', async (req, res) => {
  const { userId, userName } = req.body;
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const liked = post.likes.includes(userId);
  if (liked) {
    post.likes = post.likes.filter(id => id !== userId);
  } else {
    post.likes.push(userId);
    if (userId !== post.authorId) {
      await Notification.create({
        userId: post.authorId,
        type: 'like',
        message: `${userName} liked your post.`,
      });
    }
  }
  await post.save();
  res.json(post);
});

module.exports = router;
