// src/settingsMenu.js
import React, { useState, useEffect } from 'react';
import './settingsMenu.css';
import { signOut, updateEmail } from 'firebase/auth';
import { auth } from './firebase';
import axios from 'axios';

function SettingsMenu({ user }) {
  const [open, setOpen] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');

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
    }, 1000);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
  };

  const handleChangeEmail = async () => {
    if (!emailInput) return alert('Enter a new email.');
    try {
      await updateEmail(auth.currentUser, emailInput);
      alert('Email updated!');
    } catch (err) {
      console.error(err);
      alert('Email update failed.');
    }
  };

  const handleUpdatePhone = async () => {
    if (!phoneInput) return alert('Enter a phone number.');
    try {
      await axios.put(`https://portfolioproject-1.onrender.com/api/users/update-phone`, {
        uid: user.uid,
        phone: phoneInput,
      });
      alert('Phone updated.');
    } catch (err) {
      console.error(err);
      alert('Phone update failed.');
    }
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm("Are you sure? This will permanently delete your account.");
    if (!confirm) return;
    try {
      await axios.delete(`https://portfolioproject-1.onrender.com/api/users/delete/${user.uid}`);
      await auth.currentUser.delete();
      alert('Account deleted.');
    } catch (err) {
      console.error(err);
      alert('Delete failed.');
    }
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

            <input
              type="email"
              placeholder="New Email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            <button className="settings-btn" onClick={handleChangeEmail}>Change Email</button>

            <input
              type="text"
              placeholder="Phone Number"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
            />
            <button className="settings-btn" onClick={handleUpdatePhone}>Update Phone</button>

            <button className="settings-btn danger" onClick={handleDeleteAccount}>
              Deactivate/Delete Account
            </button>
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
              Dev Journal is a Firebase-powered writing app built with React & Node.
              Future versions will include teams, collaboration, and AI.
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
