import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Notifications.css';

function Notifications({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get(`https://portfolioproject-1.onrender.com/api/notifications/${userId}`)
      .then(res => setNotifications(res.data));
  }, [userId]);

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>
      {notifications.map(note => (
        <div key={note._id} className={`notif-card ${note.read ? '' : 'unread'}`}>
          <p>{note.message}</p>
        </div>
      ))}
    </div>
  );
}

export default Notifications;
