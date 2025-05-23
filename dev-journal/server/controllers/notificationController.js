const Notification = require('../models/Notification');
const User = require('../models/User');

const createNotification = async (req, res) => {
  const { userId, type, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const user = await User.findOne({ uid: userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const notification = await Notification.create({ userId, type, message });

    // Future feature: handle email or push notifications here
    if (user.notifications === 'email') {
      console.log(`[📧 Email] To ${user.email} → ${message}`);
    } else if (user.notifications === 'push') {
      console.log(`[📲 Push] To ${user.username} → ${message}`);
    }

    res.status(200).json(notification);
  } catch (err) {
    console.error("Notification error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createNotification };
