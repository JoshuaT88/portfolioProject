import './setupAccount.css';
// src/setupAccount.js
import React, { useState } from 'react';
import axios from 'axios';

function SetupAccount({ user, onComplete }) {
  const [form, setForm] = useState({ username: '', password: '' });
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
      onComplete(); // Notify App.js setup is complete
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
        <button type="submit">Save</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default SetupAccount;
