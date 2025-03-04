import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SplashScreen from "./pages/SplashScreen"; 
import "./App.css";
import AccountSelection from "./pages/AccountSelection";
import DSignupForm from "./pages/Dsignup"
import PSignupForm from "./pages/Psignup"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/choose" element={<AccountSelection/>} />
        <Route path="/DSignup" element={<DSignupForm/>} />
        <Route path="/PSignup" element={<PSignupForm/>} />
      </Routes>
    </Router>
  );
}

export default App;
