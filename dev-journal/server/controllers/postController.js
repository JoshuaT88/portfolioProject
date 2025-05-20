const Post = require('../models/Post');

// Create Post
const createPost = async (req, res) => {
  const { title, body, authorId, authorName } = req.body;

  if (!title || !body || !authorId) {
    return res.status(400).json({ message: "Title, body, and authorId are required." });
  }

  try {
    const newPost = new Post({ title, body, authorId, authorName });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong." });
  }
};

// Get All Posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts." });
  }
};

// Get Single Post
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
};

// Update Post — Only Author
const updatePost = async (req, res) => {
  const { title, body, userId } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.authorId !== userId) {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }

    post.title = title;
    post.body = body;
    const updated = await post.save();

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: "Update failed" });
  }
};

// Delete Post — Only Author
const deletePost = async (req, res) => {
  const { userId } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.authorId !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID or request" });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
};
