import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../helper/firebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "./css/login.css"; // New CSS file for login-specific styles

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const db = getFirestore();

  const handleGoogleLogin = async () => {
    setError(null);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email) {
        const adminDoc = await getDoc(doc(db, "admins", user.email));

        if (adminDoc.exists()) {
          console.log("Admin signed in:", user);
          navigate("/adminpage");
        } else {
          await signOut(auth);
          setError("Access denied.");
        }
      } else {
        setError("Access denied");
      }
    } catch (error) {
      setError(error.message);
      console.error("Login error:", error.code, error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-heading">Admin Login</h2>
        <p className="login-subtitle">
          Please sign in with your Google account to access the admin panel.
        </p>
        <button className="google-button" onClick={handleGoogleLogin}>
          Sign in with Google
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Login;