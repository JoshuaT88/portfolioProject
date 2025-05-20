import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import './signIn.css'; // ✅ link the CSS file
import googleLogo from './images/google-logo.svg'; 
import bookLogo from './images/book-logo.gif'; 

function SignIn({ onLogin }) {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (err) {
      console.error("Google sign-in error:", err.message);
    }
  };

 return (
  <div className="sign-in">
    <div className="sign-in-box">
      <img src={bookLogo} alt="Dev Journal Logo" className="book-logo" />
      <h2>Sign in to Dev Journal</h2>

      <button onClick={handleGoogleLogin} className="google-btn">
        <img src={googleLogo} alt="Google" className="google-icon" />
        Sign in with Google
      </button>
    </div>
  </div>
);
}

export default SignIn;
