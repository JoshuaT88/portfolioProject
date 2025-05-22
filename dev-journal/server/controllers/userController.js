// controllers/userController.js
const User = require('../models/User');

const registerUser = async (req, res) => {
  const { uid, username, password, email, displayName, notificationPrefs } = req.body;

  if (!uid || !username || !password || !notificationPrefs) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ message: 'Username taken' });

    const newUser = new User({
      firebaseUid: uid,
      username,
      password,
      email,
      displayName,
      notificationPrefs
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { registerUser };
