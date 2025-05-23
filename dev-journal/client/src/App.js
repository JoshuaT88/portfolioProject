// src/App.js
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import './App.css';
import { auth } from './firebase';
import SignIn from './signIn';
import SetupAccount from './setupAccount';
import MainLayout from './MainLayout';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const res = await axios.get(`https://portfolioproject-1.onrender.com/api/users/${currentUser.uid}`);
          if (!res.data || !res.data.username) {
            setIsNewUser(true);
          } else {
            setUser(currentUser);
          }
        } catch {
          setIsNewUser(true);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('https://portfolioproject-1.onrender.com/api/posts')
        .then(() => console.log("🔁 Backend pinged"))
        .catch((err) => console.error("Ping failed:", err));
    }, 1000 * 60 * 14);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Loading...</p>;
  if (!user && !isNewUser) return <SignIn onLogin={() => {}} />;
  if (isNewUser) {
    return (
      <SetupAccount
        user={auth.currentUser}
        onComplete={() => {
          setIsNewUser(false);
          setUser(auth.currentUser);
        }}
      />
    );
  }

  return <MainLayout user={user} />;
}

export default App;
