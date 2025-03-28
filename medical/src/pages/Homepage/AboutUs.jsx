import React from "react";
import { useNavigate } from "react-router-dom";
const AboutUs = () => {
    const navigate = useNavigate();
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="text-2xl font-bold flex items-center">
          <span className="mr-2">🩺</span> CHIKITSA
        </div>
        <div className="space-x-6">
          <a href="/Home" className="text-gray-700 font-medium hover:text-black">Home</a>
          <a href="/Services" className="text-gray-700 font-medium hover:text-black">Services</a>
          <a href="/AboutUs" className="text-black font-bold border-b-2 border-black">About Us</a>
        </div>
        <div>
        <button className="px-4 py-2 text-gray-700 border rounded-lg mr-2" onClick={() => navigate("/choose")}>Sign Up</button>
        <button className="px-4 py-2 bg-black text-white rounded-lg" onClick={() => navigate("/login")}>Log In</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-10">
        <h1 className="text-3xl font-bold">Empowering Secure and Seamless Healthcare Data Management</h1>
        <p className="text-gray-600 mt-4">
          At Chikitsa, we believe that health data should be secure, accessible, and efficient.
          Our mission is to revolutionize medical record management by providing an encrypted,
          centralized, and user-friendly platform for patients, doctors, and administrators.
        </p>

        <h2 className="text-2xl font-bold mt-8">Our Vision</h2>
        <p className="text-gray-600 mt-2">
          To create a future where healthcare data is effortlessly managed, securely stored,
          and instantly accessible for better patient care and decision-making. We want to drive
          innovation with the latest technology for better healthcare experiences.
        </p>

        {/* Images Section */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <img src="https://via.placeholder.com/250" alt="Medical Illustration" className="rounded-lg shadow-md" />
          <img src="https://via.placeholder.com/250" alt="Cloud Storage" className="rounded-lg shadow-md" />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <p className="mt-2">support@Chikitsa.com</p>
            <p>1-800-CHIKITSA</p>
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
        <p className="text-center text-gray-400 mt-6">© 2025 Chikitsa. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;
