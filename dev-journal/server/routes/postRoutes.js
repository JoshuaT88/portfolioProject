const express = require('express');
const router = express.Router();

const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} = require('../controllers/postController');

// Define routes BEFORE exporting
router.post('/', createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

// Export the router LAST
module.exports = router;

console.log({ createPost, getAllPosts, getPostById, updatePost, deletePost });
