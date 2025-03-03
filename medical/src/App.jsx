import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SplashScreen from "./pages/SplashScreen"; 
import "./App.css";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Show splash screen for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/choose" element={<h1>Doctor or Patient</h1>} />
            <Route path="/DSignup" element={<h1>Doctor Sign-Up Page</h1>} />
            <Route path="/PSignup" element={<h1>Patient Sign-Up Page</h1>} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
