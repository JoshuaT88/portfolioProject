// server/controllers/likeController.js
const Post = require('../models/Post');

const toggleLike = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ liked: !alreadyLiked, likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: 'Like operation failed' });
  }
};

module.exports = { toggleLike };
