import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SplashScreen from "./pages/SplashScreen"; 
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/choose" element={<h1>Doctor or Patient</h1>} />
        <Route path="/DSignup" element={<h1>Doctor Sign-Up Page</h1>} />
        <Route path="/PSignup" element={<h1>Patient Sign-Up Page</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
