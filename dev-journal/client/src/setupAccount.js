import './setupAccount.css';
import React, { useState } from 'react';
import axios from 'axios';

function SetupAccount({ user, onComplete }) {
  const [form, setForm] = useState({
    username: '',
    password: '',
    notificationPrefs: 'in-app'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return setError("All fields required");

    try {
      await axios.post('https://portfolioproject-1.onrender.com/api/users/register', {
        ...form,
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      });
      onComplete();
    } catch (err) {
      setError("Failed to save. Username may already exist.");
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
          value={form.notificationPrefs}
          onChange={(e) => setForm({ ...form, notificationPrefs: e.target.value })}
        >
          <option value="in-app">In-App</option>
          <option value="email">Email</option>
          <option value="push">Push Notification</option>
        </select>

        <button type="submit">Save</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default SetupAccount;
