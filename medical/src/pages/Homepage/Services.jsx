import React from "react";
import { useNavigate } from "react-router-dom";
import Service1 from "../../assets/Services1.jpg"
import Service2 from "../../assets/Services2.jpg"
import Service3 from "../../assets/Services3.jpg"
const Services = () => {
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
          <a href="/Services" className="text-black font-bold border-b-2 border-black">Services</a>
          <a href="/AboutUs" className="text-gray-700 font-medium hover:text-black">About Us</a>
        </div>
        <div>
        <button className="px-4 py-2 text-gray-700 border rounded-lg mr-2" onClick={() => navigate("/choose")}>Sign Up</button>
        <button className="px-4 py-2 bg-black text-white rounded-lg" onClick={() => navigate("/login")}>Log In</button>
        </div>
      </nav>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="text-center p-4 bg-white shadow-lg rounded-lg">
            <img src={Service1} alt="Encrypted Records" className="mx-auto mb-4" />
            <h3 className="text-lg font-bold">Encrypted Records</h3>
            <p className="text-gray-600">
              Medical records are encrypted, accessible only to authorized healthcare providers.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="text-center p-4 bg-white shadow-lg rounded-lg">
            <img src={Service2} alt="Doctor Connection" className="mx-auto mb-4" />
            <h3 className="text-lg font-bold">Doctor Connection</h3>
            <p className="text-gray-600">
              Connect with your healthcare providers and share medical information.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="text-center p-4 bg-white shadow-lg rounded-lg">
            <img src={Service3} alt="History Access" className="mx-auto mb-4" />
            <h3 className="text-lg font-bold">History Access</h3>
            <p className="text-gray-600">
              Access your medical history and previous treatments anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-6xl mx-auto p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <button className="p-4 bg-black text-white font-semibold text-center rounded-lg">
          Automatic Updates <br />
          <span className="text-gray-300 text-sm">Real-time data synchronization</span>
        </button>
        <button className="p-4 bg-black text-white font-semibold text-center rounded-lg">
          Security Features <br />
          <span className="text-gray-300 text-sm">End-to-end encryption</span>
        </button>
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

export default Services;
