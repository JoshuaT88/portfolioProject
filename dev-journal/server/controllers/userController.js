const User = require('../models/User');

const registerUser = async (req, res) => {
  const { uid, email, displayName, username, password } = req.body;

  if (!uid || !username || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const newUser = new User({ uid, email, displayName, username, password });
    await newUser.save();
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser };
