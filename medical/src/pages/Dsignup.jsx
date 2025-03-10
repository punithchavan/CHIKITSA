import { useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate, Link } from "react-router-dom";

export default function DSignupForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4 text-m">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-md max-w-4xl w-full flex flex-col md:flex-row">
        {/* Form Section */}
        <div className="w-full md:w-2/3 md:pr-8">
          <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Create an account</h2>
          <p className="text-sm text-gray-600 mb-4 text-center md:text-left">
            Already have an account? <Link to="/Login" className="text-blue-500 hover:underline">Login</Link>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First name</label>
              <input type="text" placeholder="First name" className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block text-gray-700">Last name</label>
              <input type="text" placeholder="Last name" className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block text-gray-700">UID (Assigned by NMC)</label>
              <input type="text" placeholder="UID" className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block text-gray-700">Aadhaar No.</label>
              <input type="text" placeholder="Aadhaar No." className="border p-2 rounded w-full" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700">Email address</label>
              <input type="email" placeholder="Email address" className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input type={showPassword ? "text" : "password"} placeholder="Password" className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block text-gray-700">Confirm Password</label>
              <input type={showPassword ? "text" : "password"} placeholder="Confirm your password" className="border p-2 rounded w-full" />
            </div>
          </div>

          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <span>Show password</span>
          </div>

          <button className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
            Create an Account
          </button>
        </div>

        {/* Logo Section */}
        <div className="w-full md:w-1/3 flex justify-center items-center mt-6 md:mt-0">
          <img src={logo} alt="Chikitsa Logo" className="w-32 md:w-40 h-auto" />
        </div>
      </div>
    </div>
  );
}
