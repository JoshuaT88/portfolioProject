const express = require('express');
const router = express.Router();
const { registerUser, getUserByUID } = require('../controllers/userController');

router.post('/register', registerUser);
router.get('/:uid', getUserByUID);

module.exports = router;
