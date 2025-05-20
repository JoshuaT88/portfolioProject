const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

router.get('/:userId', async (req, res) => {
  const notes = await Notification.find({ userId: req.params.userId }).sort({ date: -1 });
  res.json(notes);
});

router.put('/mark-read/:id', async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.sendStatus(204);
});

module.exports = router;
