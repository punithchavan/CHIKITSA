import React, { useState } from "react";
import logo from "../assets/logo.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with", email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div className="bg-white p-10 rounded-2xl shadow-lg flex w-[600px] space-x-6">
        {/* Left Side - Form */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-2">Good to see you again</h2>
          <p className="text-sm mb-4">
            Don't have an Account?{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Sign in
            </a>
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Email address</label>
              <input
                type="email"
                className="w-full p-2 border rounded mt-1 focus:ring focus:ring-blue-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-2 border rounded mt-1 focus:ring focus:ring-blue-300"
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

        
        <div className="flex items-center">
          <img src={logo} alt="Chikitsa Logo" className="w-32 h-32 object-contain" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
