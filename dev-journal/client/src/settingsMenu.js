// src/SettingsMenu.js
import React, { useState } from 'react';
import './settingsMenu.css';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

function SettingsMenu({ user }) {
  const [open, setOpen] = useState(false);           // Toggle settings panel
  const [showPrefs, setShowPrefs] = useState(false); // Toggle Preferences submenu

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
  };

  return (
    <>
      <div
        className={`settings-cog ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
      >
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
        </div>

        <div className="settings-section">
          <h4>Preferences</h4>
          <button onClick={() => setShowPrefs(!showPrefs)}>Customize</button>

          {showPrefs && (
            <div className="preferences-menu">
              <label>
                Theme:
                <select>
                  <option>Dark</option>
                  <option>Light</option>
                  <option>System</option>
                </select>
              </label>

              <label>
                Notifications:
                <input type="checkbox" disabled /> Enable @mention alerts (coming soon)
              </label>

              <button className="reset-prefs">Reset to default</button>
            </div>
          )}
        </div>

        <div className="settings-section">
          <h4>Notifications</h4>
          <p>Coming soon: choose email/SMS alerts for new posts.</p>
        </div>

        <div className="settings-section">
          <h4>About Dev Journal</h4>
          <p>
            Built by <strong>Joshua Tiller</strong> using React, Node, and Firebase.
          </p>
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
