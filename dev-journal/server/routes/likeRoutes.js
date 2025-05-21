// server/routes/likeRoutes.js
const express = require('express');
const router = express.Router();
const { toggleLike } = require('../controllers/likeController');

router.put('/:postId', toggleLike);

module.exports = router;
