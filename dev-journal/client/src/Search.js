import React, { useState, useEffect } from 'react';
import './Search.css';
import axios from 'axios';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return setResults([]);
    axios.get('https://portfolioproject-1.onrender.com/api/users/all')
      .then(res => {
        const matches = res.data.filter(u =>
          u.username.toLowerCase().includes(query.toLowerCase())
        );
        setResults(matches);
      });
  }, [query]);

  return (
    <div className="search-page">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="search-results">
        {results.map(user => (
          <div key={user.uid} className="search-user-card">
            <strong>@{user.username}</strong>
            <p>{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
