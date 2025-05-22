const User = require('../models/User');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  const { uid, username, password, email } = req.body;

  if (!uid || !username || !password || !email) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ message: 'Username taken' });

    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({ firebaseUID: uid, username, email, passwordHash: hash });
    const savedUser = await newUser.save();

    res.status(201).json({ message: 'Account setup complete', user: savedUser });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

module.exports = { registerUser };
