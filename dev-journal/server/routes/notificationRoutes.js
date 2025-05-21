// server/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { createNotification } = require('../controllers/notificationController');
const Notification = require('../models/Notification');

// POST a new notification (for later use)
router.post('/', createNotification);

// GET notifications for a user
router.get('/:userId', async (req, res) => {
  try {
    const notes = await Notification.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(notes);
  } catch {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark a notification as read
router.put('/mark-read/:id', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.sendStatus(204);
  } catch {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

module.exports = router;
