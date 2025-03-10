import React from "react";
import { useNavigate } from "react-router-dom";
import doctor from "../assets/doctor.webp";
import patient from "../assets/patient.webp";
import logo from "../assets/logo.png";

const AccountSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-gray-100 px-4">
      {/* Logo at Top Right */}
      <img
        src={logo}
        alt="Chikitsa Logo"
        className="absolute top-4 right-4 h-12 sm:h-16"
      />
      
      <div className="w-full flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl sm:text-4xl font-semibold text-gray-900 mb-4">
          Welcome to Chikitsa
        </h1>
        <p className="text-gray-600 text-base sm:text-lg mb-6">
          <span className="hover:underline">
            What type of account would you like to create?
          </span>
        </p>

        {/* Cards for Selection */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-16">
          {/* Patient Card */}
          <div className="flex flex-col items-center">
            <img
              src={patient}
              alt="Patient"
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl shadow-md mb-4"
            />
            <button
              className="bg-black text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg text-lg sm:text-xl font-medium w-40"
              onClick={() => navigate("/Psignup")}
            >
              Patient
            </button>
          </div>

          {/* Doctor Card */}
          <div className="flex flex-col items-center">
            <img
              src={doctor}
              alt="Doctor"
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl shadow-md mb-4"
            />
            <button
              className="bg-black text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg text-lg sm:text-xl font-medium w-40"
              onClick={() => navigate("/Dsignup")}
            >
              Doctor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSelection;
