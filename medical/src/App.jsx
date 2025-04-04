import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SplashScreen from "./pages/SplashScreen"; 
import "./App.css";
import AccountSelection from "./pages/AccountSelection";
import DSignupForm from "./pages/Dsignup"
import PSignupForm from "./pages/Psignup"
import Home from "./pages/Homepage/Home"
import Services from "./pages/Homepage/Services"
import AboutUs from "./pages/Homepage/AboutUs";
import Patientpage from "./pages/Patient/Patientpage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/choose" element={<AccountSelection/>} />
        <Route path="/DSignup" element={<DSignupForm/>} />
        <Route path="/PSignup" element={<PSignupForm/>} />
        <Route path="/Home" element={<Home/>} />
        <Route path="/Services" element={<Services/>} />
        <Route path="/AboutUs" element={<AboutUs/>} />   
        <Route path="/Patient" element={<Patientpage/>} /> 
        </Routes>
    </Router>
  );
}

export default App;
