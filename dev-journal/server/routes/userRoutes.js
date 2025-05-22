// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, getUserByUid } = require('../controllers/userController');

router.post('/register', registerUser);
router.get('/:uid', getUserByUid); // 👈 Add this route

module.exports = router;
