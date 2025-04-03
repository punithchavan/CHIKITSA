import React from "react";
import { useNavigate } from "react-router-dom";
import Homepage from "../../assets/HomePage.jpg";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex flex-wrap justify-between items-center md:px-10">
        <div className="text-2xl font-bold flex items-center">
          <span className="mr-2">🔍</span> CHIKITSA
        </div>
        <div className="space-x-6 hidden md:flex">
          <a href="/Home" className="text-black font-bold border-b-2 border-black">Home</a>
          <a href="/Services" className="text-gray-700 hover:text-black">Services</a>
          <a href="/AboutUs" className="text-gray-700 hover:text-black">About Us</a>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button className="px-4 py-2 text-gray-700 border rounded-lg" onClick={() => navigate("/choose")}>Sign Up</button>
          <button className="px-4 py-2 bg-black text-white rounded-lg" onClick={() => navigate("/login")}>Log In</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto p-6 flex flex-col lg:flex-row items-center text-center lg:text-left">
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold">Secure Medical Records Management</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Access your medical records securely, connect with healthcare providers, and manage your health information all in one place.
          </p>
          <button className="px-6 py-3 border rounded-lg hover:bg-gray-200 transition">Learn More</button>
        </div>
        <div className="lg:w-1/2 mt-6 lg:mt-0">
          <img src={Homepage} alt="Doctor illustration" className="rounded-lg shadow-lg w-full max-w-md mx-auto" />
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center p-6 md:p-10">
        <h2 className="text-2xl md:text-3xl font-semibold">Ready to Get Started?</h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base">Join thousands of patients who trust MedEncrypt for their medical record management.</p>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white p-6 md:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div>
            <h3 className="font-bold">Quick Links</h3>
            <ul className="mt-2 space-y-1">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Services</a></li>
              <li><a href="#" className="hover:underline">Help</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold">Contact</h3>
            <p className="mt-2 text-sm md:text-base">support@Chikitsa.com</p>
            <p className="text-sm md:text-base">1-800-CHIKITSA</p>
          </div>
          <div>
            <h3 className="font-bold">Legal</h3>
            <ul className="mt-2 space-y-1">
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms of Service</a></li>
              <li><a href="#" className="hover:underline">HIPAA Compliance</a></li>
            </ul>
          </div>
        </div>
        <p className="text-center text-gray-400 mt-6 text-sm md:text-base">© 2025 Chikitsa. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
