import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"

const SplashScreen = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 2500); // Start fade-out
    const redirectTimer = setTimeout(() => navigate("/Home"), 2000); // Redirect after fade

    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div
      className={`h-screen flex items-center justify-center bg-gray-100 transition-opacity duration-500 ease-in-out ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <img
  src={logo}
  alt="Splash Screen"
  className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto object-contain"
/>

    </div>
  );
};

export default SplashScreen;
