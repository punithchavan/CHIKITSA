import React from "react";
import doctor from "../assets/doctor.webp"
import patient from "../assets/patient.webp"
import logo from "../assets/logo.png";
const AccountSelection = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-screen bg-gray-100">
      {/* Logo at Top Right */}
      <img
        src={ logo }
        alt="Chikitsa Logo"
        className="absolute top-6 right-6 h-16"
      />
      
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">Welcome to Chikitsa</h1>
        <p className="text-gray-600 text-lg mb-8">
          <h4 className="hover:underline">
            What type of account would you like to create?
          </h4>
        </p>
        <div className="flex justify-center gap-16">
          {/* Patient Card */}
          <div className="flex flex-col items-center">
            <img
              src={patient}
              alt="Patient"
              className="w-40 h-40 rounded-2xl shadow-md mb-4"
            />
            <button className="bg-black text-white px-8 py-3 rounded-lg text-xl font-medium">
              Patient
            </button>
          </div>
          {/* Doctor Card */}
          <div className="flex flex-col items-center">
            <img
              src={doctor}
              alt="Doctor"
              className="w-40 h-40 rounded-2xl shadow-md mb-4"
            />
            <button className="bg-black text-white px-8 py-3 rounded-lg text-xl font-medium">
              Doctor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSelection;
