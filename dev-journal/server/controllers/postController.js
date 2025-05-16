const Post = require('../models/Post');

const createPost = async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: "Title and body required." });
  }

  try {
    const newPost = new Post({ title, body });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong." });
  }
};

module.exports = { createPost };

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts." });
  }
};
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
};


const updatePost = async (req, res) => {
  const { title, body } = req.body;

  try {
    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      { title, body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: "Update failed" });
  }
};
const deletePost = async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Post not found" });
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
}; 


module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
};

