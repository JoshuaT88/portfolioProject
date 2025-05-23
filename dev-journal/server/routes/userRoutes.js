const express = require('express');
const router = express.Router();
const {
  registerUser,
  getUserByUID,
  updateUserSettings,
  deleteUserAccount,
  updateNotificationPrefs,
  updateUserPhone
} = require('../controllers/userController');

const Notification = require('../models/Notification');
const User = require('../models/User');

// 1. Register new user after Google login
router.post('/register', registerUser);

// 2. Get user details by Firebase UID
router.get('/:uid', getUserByUID);

// 3. Update general settings (theme, notifications)
router.put('/:uid/settings', updateUserSettings);

// 4. Update notification preferences only
router.put('/:uid/notifications', updateNotificationPrefs);

// 5. Update email and/or phone
router.put('/update-phone', updateUserPhone);

// 6. Delete user account with password confirmation
router.delete('/delete/:uid', deleteUserAccount);

// 7. Follow user (sends notification)
router.post('/follow', async (req, res) => {
  const { followerId, followeeId } = req.body;

  try {
    const follower = await User.findOne({ uid: followerId });
    const followee = await User.findOne({ uid: followeeId });

    if (!follower || !followee) {
      return res.status(404).json({ error: 'Invalid user IDs' });
    }

    // Notify the followed user
    await Notification.create({
      userId: followeeId,
      type: 'follow',
      message: `${follower.username} followed you.`
    });

    res.status(200).json({ message: 'Followed and notified' });
  } catch (err) {
    console.error("Follow error:", err);
    res.status(500).json({ message: "Failed to follow user" });
  }
});

module.exports = router;
