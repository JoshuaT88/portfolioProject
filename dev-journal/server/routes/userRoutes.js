const express = require('express');
const router = express.Router();
const {
  registerUser,
  getUserByUID,
  updateUserSettings
} = require('../controllers/userController');
const Notification = require('../models/Notification');
const User = require('../models/User');

router.post('/register', registerUser);
router.get('/:uid', getUserByUID);
router.put('/:uid/settings', updateUserSettings);

router.post('/follow', async (req, res) => {
  const { followerId, followeeId } = req.body;
  const follower = await User.findOne({ uid: followerId });
  const followee = await User.findOne({ uid: followeeId });

  if (!follower || !followee) return res.status(404).json({ error: 'Invalid users' });

  await Notification.create({
    userId: followeeId,
    type: 'follow',
    message: `${follower.username} followed you.`
  });

  res.status(200).json({ message: 'Followed and notified' });
});

module.exports = router;
