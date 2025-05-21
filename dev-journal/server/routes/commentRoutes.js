// server/routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const {
  createComment,
  getComments
} = require('../controllers/commentController');

// POST a comment to a specific post
router.post('/:postId', createComment);

// GET all comments for a specific post
router.get('/:postId', getComments);

module.exports = router;
