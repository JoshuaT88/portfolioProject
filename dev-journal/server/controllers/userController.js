const User = require('../models/User');

const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseId: req.params.id });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

const createUser = async (req, res) => {
  const { firebaseId, username, password } = req.body;
  if (!firebaseId || !username || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const existing = await User.findOne({ firebaseId });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ firebaseId, username, password });
    const saved = await newUser.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

module.exports = {
  getUserById,
  createUser
};
