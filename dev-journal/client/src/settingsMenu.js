// src/settingsMenu.js
import React, { useState, useEffect } from 'react';
import './settingsMenu.css';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import axios from 'axios';

function SettingsMenu({ user }) {
  const [open, setOpen] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [notificationsPref, setNotificationsPref] = useState('in-app');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.setAttribute('data-theme', savedTheme);
    } else {
      document.body.setAttribute('data-theme', 'dark');
    }
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme-preference', theme);
  }, [theme]);

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
  };

  const handleProfileUpdate = async () => {
    try {
      await axios.put('https://portfolioproject-1.onrender.com/api/users/update', {
        uid: user.uid,
        email: newEmail,
        phone: newPhone
      });
      alert("Profile updated!");
    } catch (err) {
      console.error('Update failed:', err);
      alert("Failed to update profile.");
    }
  };

  const handleAccountDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete your account?")) return;

    try {
      await axios.delete('https://portfolioproject-1.onrender.com/api/users/delete', {
        data: { uid: user.uid }
      });
      await signOut(auth);
      alert("Account deleted.");
    } catch (err) {
      console.error('Delete failed:', err);
      alert("Account deletion failed.");
    }
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

        <div className="settings-section">
          <h4>Profile</h4>
          {user?.photoURL && <img src={user.photoURL} alt="User" className="profile-pic" />}
          <p>{user?.displayName || user?.email}</p>
          <input
            type="email"
            placeholder="Update email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Update phone"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />
          <button onClick={handleProfileUpdate}>Update Info</button>
          <button className="logout-btn" onClick={handleAccountDelete}>Deactivate Account</button>
        </div>

        <div className="settings-section">
          <h4>Account Preferences</h4>
          <button onClick={() => setShowPrefs(!showPrefs)}>Customize</button>

          {showPrefs && (
            <div className="preferences-menu">
              <label>
                Theme:
                <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="system">System</option>
                </select>
              </label>

              <label>
                Notification Preference:
                <select value={notificationsPref} onChange={(e) => setNotificationsPref(e.target.value)}>
                  <option value="in-app">In-App</option>
                  <option value="email">Email</option>
                  <option value="push">Push</option>
                  <option value="none">Opt-out</option>
                </select>
              </label>

              <button
                className="reset-prefs"
                onClick={() => {
                  setTheme('dark');
                  localStorage.removeItem('theme-preference');
                }}
              >
                Reset to default
              </button>
            </div>
          )}
        </div>

        <div className="settings-section">
          <h4>About Dev Journal</h4>
          <p>
            Dev Journal helps you log, share, and grow your developer journey.
          </p>
          <p>Upcoming: cross-posting, @mentions, and social integrations.</p>
          <p>Support: <a href="mailto:jtctechsoft@gmail.com">jtctechsoft@gmail.com</a></p>
        </div>

        <div className="settings-footer">
          <button className="logout-btn" onClick={handleLogout}>Log Out</button>
        </div>
      </div>
    </>
  );
}

export default SettingsMenu;
