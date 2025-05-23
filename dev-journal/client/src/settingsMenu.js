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
  const [notifPref, setNotifPref] = useState('in-app');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // Fetch user settings
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://portfolioproject-1.onrender.com/api/users/${user.uid}`);
        if (res.data.notifications) setNotifPref(res.data.notifications);
        if (res.data.phone) setPhoneInput(res.data.phone);
      } catch (err) {
        console.error('Failed to load user settings:', err);
      }
    };
    if (user) fetchUser();
  }, [user]);

  // Theme preference
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
    if (!passwordConfirm) return alert("Please confirm your password.");
    const confirm = window.confirm("Are you sure? This will permanently delete your account.");
    if (!confirm) return;
    try {
      await axios.delete(`https://portfolioproject-1.onrender.com/api/users/delete/${user.uid}`, {
        data: { password: passwordConfirm }
      });
      await auth.currentUser.delete();
      alert('Account deleted.');
    } catch (err) {
      console.error(err);
      alert('Delete failed. Ensure password is correct.');
    }
  };

  const handleUpdateNotifications = async () => {
    try {
      await axios.put(`https://portfolioproject-1.onrender.com/api/users/${user.uid}/settings`, {
        notifications: notifPref
      });
      alert('Preferences updated.');
    } catch (err) {
      console.error(err);
      alert('Failed to save preferences.');
    }
  };

  return (
    <>
      <div
        className={`settings-cog ${open ? 'open' : ''}`}
        onClick={handleCogClick}
        style={{ top: '20px', right: '20px', fontSize: '2rem' }}
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

            <input
              type="password"
              placeholder="Confirm Password to Delete"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
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
              <select value={notifPref} onChange={(e) => setNotifPref(e.target.value)}>
                <option value="in-app">In-App</option>
                <option value="email">Email</option>
                <option value="push">Push</option>
                <option value="none">None</option>
              </select>
            </label>

            <button className="settings-btn" onClick={handleUpdateNotifications}>
              Save Preferences
            </button>

            <button
              className="reset-prefs"
              onClick={() => {
                setTheme('dark');
                localStorage.removeItem('theme-preference');
              }}
            >
              Reset Theme to Default
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
