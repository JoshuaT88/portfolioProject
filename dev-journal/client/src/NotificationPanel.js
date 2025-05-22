// src/NotificationPanel.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './notifications.css';

function NotificationPanel({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get(`https://portfolioproject-1.onrender.com/api/notifications/${userId}`)
      .then(res => setNotifications(res.data))
      .catch(err => console.error('Notification fetch error:', err));
  }, [userId]);

  return (
    <div className="notification-panel">
      <h4>Notifications</h4>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul>
          {notifications.map(note => (
            <li key={note._id}>
              {note.message} - <small>{new Date(note.date).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationPanel;
