import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../helper/firebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h2>Login</h2>
      <button
        onClick={handleGoogleLogin}
        style={{
          padding: "0.75rem",
          width: "100%",
          marginTop: "1rem",
          backgroundColor: "#4285F4",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Sign in with Google
      </button>
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
};

export default Login;
