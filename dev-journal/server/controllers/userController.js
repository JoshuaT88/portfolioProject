const User = require('../models/User');
const Notification = require('../models/Notification');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

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

// Fetch user by Firebase UID
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

// Update theme and global notification preferences
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

// Update phone number or email
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
      console.log(`📧 Simulated: Email verification sent to ${newEmail}`);
      // TODO: real email confirmation logic via nodemailer or Firebase
    }

    await User.findOneAndUpdate({ uid }, update);
    res.status(200).json({ message: 'User contact info updated' });
  } catch (err) {
    console.error("Email/Phone update error:", err);
    res.status(500).json({ message: 'Failed to update' });
  }
};

// Update notification preferences only
const updateNotificationPrefs = async (req, res) => {
  const { uid } = req.params;
  const { notifications } = req.body;

  if (!uid || !notifications) {
    return res.status(400).json({ message: 'Missing notification settings' });
  }

  try {
    await User.findOneAndUpdate({ uid }, { notifications });
    res.status(200).json({ message: 'Notification preferences updated' });
  } catch (err) {
    console.error("Notification pref error:", err);
    res.status(500).json({ message: 'Update failed' });
  }
};

// Confirm password before deleting
const deleteUserAccount = async (req, res) => {
  const { uid } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    await User.deleteOne({ uid });
    await Post.deleteMany({ authorId: uid });
    await Comment.deleteMany({ userId: uid });
    await Notification.deleteMany({ userId: uid });

    res.status(200).json({ message: "Account and data deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Account deletion failed" });
  }
};

module.exports = {
  registerUser,
  getUserByUID,
  updateUserSettings,
  updateNotificationPrefs,
  updateUserPhone,
  deleteUserAccount
};
