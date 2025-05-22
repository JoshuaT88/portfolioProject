import React, { useState } from 'react';
import './setupAccount.css';
import axios from 'axios';

function SetupAccount({ user, onComplete }) {
  const [form, setForm] = useState({ username: '', password: '', notifications: 'in-app' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password || !form.notifications) {
      return setError('All fields required');
    }

    try {
      await axios.post('https://portfolioproject-1.onrender.com/api/users/register', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        username: form.username,
        password: form.password,
        notifications: form.notifications
      });

      onComplete(); // Proceed to app
    } catch (err) {
      console.error(err);
      setError("Username may already exist, or server error.");
    }
  };

  return (
    <div className="setup-container">
      <h2>Finish Account Setup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Create username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Create password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <label>Notification Preference:</label>
        <select
          value={form.notifications}
          onChange={(e) => setForm({ ...form, notifications: e.target.value })}
        >
          <option value="in-app">In-App Only</option>
          <option value="email">Email</option>
          <option value="push">Device Push (coming soon)</option>
        </select>

        <button type="submit">Save & Continue</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default SetupAccount;
