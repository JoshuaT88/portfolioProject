// src/settingsMenu.js
import React, { useState, useEffect } from 'react';
import './settingsMenu.css';
import { signOut, updateEmail } from 'firebase/auth';
import { auth } from './firebase';
import axios from 'axios';

function SettingsMenu({ user }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [theme, setTheme] = useState('dark');
  const [notifPref, setNotifPref] = useState('in-app');

  const [savedMessage, setSavedMessage] = useState('');

  // Load user data
  useEffect(() => {
    if (!user) return;
    axios.get(`https://portfolioproject-1.onrender.com/api/users/${user.uid}`)
      .then(res => {
        if (res.data.notifications) setNotifPref(res.data.notifications);
        if (res.data.phone) setPhoneInput(res.data.phone);
      })
      .catch(err => console.error('User settings fetch failed', err));
  }, [user]);

  useEffect(() => {
    const stored = localStorage.getItem('theme-preference');
    if (stored) {
      setTheme(stored);
      document.body.setAttribute('data-theme', stored);
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

  const showSaved = () => {
    setSavedMessage("✔ Changes Saved");
    setTimeout(() => setSavedMessage(''), 2000);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
  };

  const handleChangeEmail = async () => {
    if (!emailInput) return alert('Enter new email');
    try {
      await updateEmail(auth.currentUser, emailInput);
      showSaved();
    } catch (err) {
      console.error(err);
      alert('Email update failed.');
    }
  };

  const handleUpdatePhone = async () => {
    try {
      await axios.put(`https://portfolioproject-1.onrender.com/api/users/update-phone`, {
        uid: user.uid,
        phone: phoneInput
      });
      showSaved();
    } catch (err) {
      console.error(err);
      alert('Phone update failed');
    }
  };

  const handleUpdateNotifications = async () => {
    try {
      await axios.put(`https://portfolioproject-1.onrender.com/api/users/${user.uid}/settings`, {
        notifications: notifPref
      });
      showSaved();
    } catch (err) {
      console.error(err);
      alert('Notification preference update failed.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!passwordConfirm) return alert("Please confirm password");
    const confirm = window.confirm("Are you sure? This deletes your account permanently.");
    if (!confirm) return;
    try {
      await axios.delete(`https://portfolioproject-1.onrender.com/api/users/delete/${user.uid}`, {
        data: { password: passwordConfirm }
      });
      await auth.currentUser.delete();
      alert('Account deleted.');
    } catch (err) {
      console.error(err);
      alert('Delete failed. Incorrect password?');
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
            <button className="settings-btn" onClick={handleChangeEmail}>Save Email</button>

            <input
              type="text"
              placeholder="Phone Number"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
            />
            <button className="settings-btn" onClick={handleUpdatePhone}>Save Phone</button>

            <input
              type="password"
              placeholder="Password (for delete)"
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
              Notifications:
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
            <p>Dev Journal is a collaborative app powered by Firebase & Node.</p>
            <p>More features coming soon: Teams, AI code helpers, cross-platform sharing.</p>
            <p>Support: <a href="mailto:jtctechsoft@gmail.com">jtctechsoft@gmail.com</a></p>
          </div>

          <div className="settings-footer">
            <button className="logout-btn" onClick={handleLogout}>Log Out</button>
          </div>

          {savedMessage && <div className="settings-toast">{savedMessage}</div>}
        </div>
      )}
    </>
  );
}

export default SettingsMenu;
