// src/settingsMenu.js
import React, { useState, useEffect } from 'react';
import './settingsMenu.css';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

function SettingsMenu({ user }) {
  const [open, setOpen] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.setAttribute('data-theme', savedTheme);
    }
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme-preference', theme);
  }, [theme]);

  const handleCogClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(true);
    }, 1200); // Simulate loading
  };

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
  };

  return (
    <>
      <div
        className={`settings-cog ${open ? 'open' : ''}`}
        onClick={handleCogClick}
      >
        <i className="fas fa-cog"></i>
      </div>

      {loading && (
        <div className="settings-loading-screen">
          <div className="loader"></div>
          <p>Loading settings...</p>
        </div>
      )}

      {open && (
        <div className="settings-fullscreen">
          <div className="settings-header">
            <h3>Settings</h3>
            <button onClick={() => setOpen(false)}>×</button>
          </div>

          <div className="settings-section">
            <h4>Profile</h4>
            {user?.photoURL && <img src={user.photoURL} alt="User" className="profile-pic" />}
            <p>{user?.displayName || user?.email}</p>
            <button className="settings-btn">Change Email</button>
            <button className="settings-btn">Update Phone</button>
            <button className="settings-btn danger">Deactivate/Delete Account</button>
          </div>

          <div className="settings-section">
            <h4>Account Preferences</h4>
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
              <select>
                <option>In-App</option>
                <option>Email</option>
                <option>Push</option>
                <option>None</option>
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

          <div className="settings-section">
            <h4>About Dev Journal</h4>
            <p>
              Dev Journal is a community-driven note & share platform built with React, Node, and Firebase.
              Future features include team workspaces and real-time collab.
            </p>
            <p>Support: <a href="mailto:jtctechsoft@gmail.com">jtctechsoft@gmail.com</a></p>
          </div>

          <div className="settings-footer">
            <button className="logout-btn" onClick={handleLogout}>Log Out</button>
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsMenu;
