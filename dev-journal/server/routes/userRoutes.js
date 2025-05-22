const express = require('express');
const router = express.Router();
const { getUserById, createUser } = require('../controllers/userController');

router.get('/:id', getUserById);       // GET /api/users/:id
router.post('/', createUser);          // POST /api/users

module.exports = router;
