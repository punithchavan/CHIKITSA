import React, { useState, useEffect } from "react";
import logo from "../assets/logo.jpg";

const SplashScreen = () => {
  const [showImage, setShowImage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImage(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      {showImage ? (
        <img
          src={ logo }
          alt="Splash Screen"
          className="w-64 h-64 object-cover rounded-lg shadow-lg"
        />
      ) : null}
    </div>
  );
};

export default SplashScreen;
