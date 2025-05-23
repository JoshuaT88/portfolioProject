// src/NotificationPanel.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './notifications.css';
import { FaBell } from 'react-icons/fa';

function NotificationPanel({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (!user) return;
    axios.get(`https://portfolioproject-1.onrender.com/api/notifications/${user.uid}`)
      .then(res => setNotifications(res.data))
      .catch(err => console.error("Notif fetch error", err));
  }, [user]);

  const handleToggle = () => {
    setShowPanel(!showPanel);
  };

  return (
    <div className="notification-wrapper">
      <button className="notif-icon" onClick={handleToggle}>
        <FaBell />
        {notifications.length > 0 && <span className="notif-count">{notifications.length}</span>}
      </button>

      {showPanel && (
        <div className="notif-panel">
          <h4>Notifications</h4>
          {notifications.length === 0 ? (
            <p className="no-notifs">No notifications yet.</p>
          ) : (
            <ul className="notif-list">
              {notifications.map(note => (
                <li key={note._id}>
                  <strong>{note.type}</strong>: {note.message}
                  <small>{new Date(note.date).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationPanel;
