import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";

const LoginPage = () => {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,  // e.g. "punith"
          password   // e.g. "admin123"
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Login successful");
        localStorage.setItem("user", JSON.stringify(data.user));  // Store user data excluding password
  
        // Navigate based on user role
        if (data.user.role === "Admin") {
          navigate("/Admin");
        } else if (data.user.role === "Doctor") {
          navigate("/Doctor");
        } else if (data.user.role === "Patient") {
          navigate("/Patient");
        }
      } else {
        alert(data.error);  // Show error from the server
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error, please try again later");
    }
  };
  


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300 p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg flex flex-col md:flex-row w-full max-w-md md:max-w-2xl space-y-6 md:space-x-6">
        
        {/* Left Side - Form */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-2">Good to see you again</h2>
          <p className="text-sm mb-4">
            Don't have an Account?{" "}
            <Link to="/choose" className="text-blue-500 hover:underline">Sign up</Link>
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input
                type="text"
                className="w-full p-3 border rounded mt-1 focus:ring focus:ring-blue-300 text-sm"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 border rounded mt-1 focus:ring focus:ring-blue-300 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2"
              />
              <span className="text-sm">Show password</span>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white p-3 rounded-full mt-4 hover:bg-gray-800 transition"
            >
              Login
            </button>
          </form>
        </div>

        {/* Right Side - Logo (Hidden on Small Screens) */}
        <div className="hidden md:flex items-center">
          <img src={logo} alt="Chikitsa Logo" className="w-40 md:w-50 h-auto object-contain" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
