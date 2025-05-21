// server/controllers/notificationController.js
// Placeholder for future features like @mentions and alerts

const createNotification = async (req, res) => {
  const { userId, type, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: 'Missing notification fields.' });
  }

  try {
    // Simulated action (save to DB later)
    console.log(`[Notification] To: ${userId} | ${type || 'info'} → ${message}`);
    res.status(200).json({ message: 'Notification created (simulated).' });
  } catch (err) {
    res.status(500).json({ error: 'Notification error.' });
  }
};

module.exports = { createNotification };
