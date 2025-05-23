import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SplashScreen from "./pages/SplashScreen";
import "./App.css";
import AccountSelection from "./pages/AccountSelection";
import DSignupForm from "./pages/Dsignup";
import PSignupForm from "./pages/Psignup";
import Home from "./pages/Homepage/Home";
import Services from "./pages/Homepage/Services";
import AboutUs from "./pages/Homepage/AboutUs";
import Patientpage from "./pages/Patient/Patientpage";
import ChikitsaConnector from "./ChikitsaConnector"
import Adminpage from "./pages/Admin/Adminpage";
import Doctorpage from "./pages/Doctor/Doctorpage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/choose" element={<AccountSelection />} />
        <Route path="/DSignup" element={<DSignupForm />} />
        <Route path="/PSignup" element={<PSignupForm />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/Patient" element={<Patientpage />} />
        <Route path="/chikitsa" element={<ChikitsaConnector/>}/>
        <Route path="/Admin" element={<Adminpage />} />
        <Route path="/Doctor" element={<Doctorpage />} />
      </Routes>
    </Router>
  );
}

export default App;
