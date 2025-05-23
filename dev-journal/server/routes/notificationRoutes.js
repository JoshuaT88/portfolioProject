const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { createNotification } = require('../controllers/notificationController');

// POST /api/notifications - Create a new notification (likes, shares, etc.)
router.post('/', async (req, res) => {
  const { userId, message, type = 'info' } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: 'Missing notification fields.' });
  }

  try {
    const note = new Notification({ userId, message, type });
    await note.save();
    res.status(201).json({ message: 'Notification created successfully.' });
  } catch (err) {
    console.error("Notification error:", err);
    res.status(500).json({ error: 'Failed to create notification.' });
  }
});

// GET /api/notifications/:userId - Fetch notifications for a user
router.get('/:userId', async (req, res) => {
  try {
    const notes = await Notification.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching notifications.' });
  }
});

// PUT /api/notifications/mark-read/:id - Mark notification as read
router.put('/mark-read/:id', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark as read.' });
  }
});

module.exports = router;
