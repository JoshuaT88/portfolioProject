const User = require('../models/User');
const Notification = require('../models/Notification');

// Register a new user
const registerUser = async (req, res) => {
  const { uid, email, displayName, username, password, notifications } = req.body;

  if (!uid || !username || !password || !notifications) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ message: "Username already taken" });

    const newUser = new User({ uid, email, displayName, username, password, notifications });
    await newUser.save();
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch user by UID
const getUserByUID = async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update notification prefs, theme
const updateUserSettings = async (req, res) => {
  const { uid } = req.params;
  const { notifications, theme } = req.body;

  try {
    await User.findOneAndUpdate(
      { uid },
      { notifications, theme },
      { new: true }
    );
    res.status(200).json({ message: 'Settings updated' });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: 'Failed to update settings' });
  }
};

// Update user phone and email
const updateUserPhone = async (req, res) => {
  const { uid, newPhone, newEmail } = req.body;

  if (!uid || (!newPhone && !newEmail)) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const update = {};
    if (newPhone) update.phone = newPhone;
    if (newEmail) {
      update.email = newEmail;
      console.log(`📧 Email verification sent to: ${newEmail}`);
      // TODO: Replace this with real email logic
    }

    await User.findOneAndUpdate({ uid }, update);
    res.status(200).json({ message: 'Updated info' });
  } catch (err) {
    console.error("Email/Phone update error:", err);
    res.status(500).json({ message: 'Failed to update' });
  }
};

// Confirm password before deleting account
const deleteUserAccount = async (req, res) => {
  const { uid } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Delete user account
    await User.deleteOne({ uid });

    // Optional: delete user's posts, comments, etc.
     await Post.deleteMany({ authorId: uid });
     await Comment.deleteMany({ userId: uid });
     await Notification.deleteMany({ userId: uid });

    res.status(200).json({ message: "Account deleted" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  getUserByUID,
  updateUserSettings,
  updateUserPhone,
  deleteUserAccount
};
