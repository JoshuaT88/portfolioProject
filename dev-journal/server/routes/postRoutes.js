const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET all posts for feed
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// CREATE new post
router.post('/', async (req, res) => {
  const { title, body, authorId, authorName } = req.body;
  try {
    const post = new Post({ title, body, authorId, authorName });
    const saved = await post.save();
    res.status(201).json(saved);
  } catch {
    res.status(500).json({ error: 'Post failed' });
  }
});

// DELETE post
router.delete('/:id', async (req, res) => {
  const { userId } = req.body;
  const post = await Post.findById(req.params.id);
  if (post && post.authorId === userId) {
    await post.deleteOne();
    return res.sendStatus(204);
  }
  res.status(403).json({ message: 'Not allowed' });
});

// UPDATE post
router.put('/:id', async (req, res) => {
  const { userId, title, body } = req.body;
  const post = await Post.findById(req.params.id);
  if (post && post.authorId === userId) {
    post.title = title;
    post.body = body;
    const updated = await post.save();
    return res.json(updated);
  }
  res.status(403).json({ message: 'Not allowed' });
});
module.exports = router;
