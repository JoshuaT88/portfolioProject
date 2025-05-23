import React, { useState, useEffect } from 'react';
import './settingsMenu.css';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import axios from 'axios';

function SettingsMenu({ user }) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState('profile');
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState('in-app');

  useEffect(() => {
    axios.get(`https://portfolioproject-1.onrender.com/api/users/${user.uid}`)
      .then(res => {
        setTheme(res.data.theme || 'dark');
        setNotifications(res.data.notifications || 'in-app');
      });
  }, [user]);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme-preference', theme);
  }, [theme]);

  const handleUpdateSettings = async () => {
    await axios.put(`https://portfolioproject-1.onrender.com/api/users/${user.uid}/settings`, {
      theme,
      notifications
    });
    alert('Preferences updated!');
  };

  return (
    <>
      <div className={`settings-cog ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
        <i className="fas fa-cog"></i>
      </div>

      <div className={`settings-panel ${open ? 'open' : ''}`}>
        <div className="settings-header">
          <h3>Settings</h3>
          <button onClick={() => setOpen(false)}>×</button>
        </div>

        <div className="settings-tabs">
          <button onClick={() => setSection('profile')}>Profile</button>
          <button onClick={() => setSection('preferences')}>Account Preferences</button>
          <button onClick={() => setSection('about')}>About App</button>
        </div>

        <div className="settings-section">
          {section === 'profile' && (
            <>
              <h4>Manage Profile</h4>
              <p>{user.displayName}</p>
              <p>{user.email}</p>
              <button disabled>Change Email (Coming soon)</button>
              <button disabled>Change Phone (Coming soon)</button>
              <button className="danger" disabled>Deactivate/Delete Account</button>
            </>
          )}

          {section === 'preferences' && (
            <>
              <h4>Theme</h4>
              <select value={theme} onChange={e => setTheme(e.target.value)}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>

              <h4>Notification Preference</h4>
              <select value={notifications} onChange={e => setNotifications(e.target.value)}>
                <option value="in-app">In-App</option>
                <option value="email">Email</option>
                <option value="push">Push Notifications</option>
                <option value="none">None</option>
              </select>

              <button onClick={handleUpdateSettings}>Save Preferences</button>
            </>
          )}

          {section === 'about' && (
            <>
              <h4>About Dev Journal</h4>
              <p>
                Dev Journal is a collaborative platform built by <strong>Joshua Tiller</strong> for developers to post ideas, collaborate, and learn.
              </p>
              <p><strong>Upcoming:</strong> @mentions, real-time chat, mobile app</p>
              <p>Contact support: <a href="mailto:jtctechsoft@gmail.com">jtctechsoft@gmail.com</a></p>
            </>
          )}
        </div>

        <div className="settings-footer">
          <button className="logout-btn" onClick={async () => {
            await signOut(auth);
            setOpen(false);
          }}>Log Out</button>
        </div>
      </div>
    </>
  );
}

export default SettingsMenu;
