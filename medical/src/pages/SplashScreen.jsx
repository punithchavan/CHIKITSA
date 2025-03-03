import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

const SplashScreen = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 2500); // Start fade-out
    const redirectTimer = setTimeout(() => navigate("/login"), 2000); // Redirect after fade

    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div
      className={`h-screen flex items-center justify-center bg-gray-100 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <img
        src={ logo}
        alt="Splash Screen"
        className="w-64 h-64 object-cover rounded-lg shadow-lg"
      />
    </div>
  );
};

export default SplashScreen;
