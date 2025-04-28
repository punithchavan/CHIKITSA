import React, { useState } from "react";
import { MdSettings } from "react-icons/md";
import logo from "../../assets/logo.png";
import patientai from "../../assets/patient.webp";

const HomeView = () => (
  <div className="p-4">
    <div className="flex flex-row gap-6 flex-wrap">
      {/* Appointments Box */}
      <div className="bg-white border-2 border-black-400 rounded-xl shadow-md p-6 w-7/15">
        <h2 className="text-2xl font-bold text-black-600 mb-4">Your Appointments:</h2>

      <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50 flex flex-col gap-3 text-gray-700 text-lg">
        <div className="flex gap-2">
          <span className="font-semibold">📅 Date:</span> 24 March 2025
        </div>
        <div className="flex gap-2">
          <span className="font-semibold">⏰ Time:</span> 2:30 p.m.
        </div>
        <div className="flex gap-2">
          <span className="font-semibold">👨‍⚕️ Doctor:</span> Dr. Raj Chopra
        </div>
      </div>
    <div className="mt-6 bg-teal-50 border border-teal-300 p-4 rounded-xl space-y-3">
      <div className="flex items-start gap-2">
        <span className="text-teal-600 text-xl">✅</span>
        <p className="text-gray-700">Please arrive 10 minutes early.</p>
      </div>
      <div className="flex items-start gap-2">
        <span className="text-teal-600 text-xl">✅</span>
        <p className="text-gray-700">
          Upload all relevant medical reports in your profile beforehand.
        </p>
      </div>
    </div>

      </div>

      {/* Small Changes, Big Impact Box */}
      <div className="bg-teal-50 border-2 border-black-400 p-6 rounded-xl">
  <h2 className="text-2xl font-bold text-black-700 mb-4">Small Changes, Big Impact:</h2>

  <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
    <h3 className="font-bold text-lg text-teal-600 mb-1">Stay Hydrated</h3>
    <p className="text-gray-700">
      Drink at least 8 glasses of water a day to support digestion, circulation, and energy levels.
    </p>
  </div>

  <div className="bg-white p-4 rounded-lg shadow-sm">
    <h3 className="font-bold text-lg text-teal-600 mb-1">Get Some Sunlight</h3>
    <p className="text-gray-700">
      10-15 minutes of morning sun helps regulate your circadian rhythm and boosts Vitamin D.
    </p>
  </div>
</div>


      {/* Recently Updated Box */}
      <div
        className="
    bg-white text-black p-6 rounded-lg border border-gray-300 shadow-sm
    w-full mt-4 min-h-[25vh]
  "
      >
        <h2 className="text-2xl font-bold mb-2">Recently Updated</h2>
        <p className="text-gray-500 italic">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </div>
    </div>
  </div>
);

const MedicalHistoryView = () => (
  <div className="bg-white text-black p-4 rounded">
    <h2 className="text-xl font-bold mb-2">Medical History</h2>
    <p>
      No recent records. Your medical history will appear here once available.
    </p>
  </div>
);

const PatientPage = () => {
  const [activeTab, setActiveTab] = useState("home");

  // Dummy patient data (replace with real API data/fetch hook)
  const loading = false;
  const error = null;
  const patientDetails = {
    name: "Ravi Kumar",
    gender: "Male",
    age: 24,
    blood_group: "A+",
    contact_info: "9xxxx 3xxxx",
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f0f0] overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-300 shadow-sm">
        <div className="flex items-center gap-4">
          <img src={logo} alt="logo" className="h-10 w-auto" />
          <div className="text-2xl font-bold text-gray-800">CHIKITSA</div>
        </div>

        <MdSettings className="text-3xl cursor-pointer text-gray-700 hover:text-gray-900 transition" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Sidebar - Restored to original white color */}
        <div className="bg-white text-gray-200 w-full md:w-[40%] flex flex-col items-center py-8 gap-6 shadow-inner border-r-2 border-[#ccc]">
          <img
            src={patientai}
            alt="Patient avatar"
            className="w-24 h-24 rounded-full border-2 border-gray-400 shadow-md"
          />
          {loading ? (
            <div className="text-gray-800">Loading patient details...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="border-2 border-gray-300 rounded-xl p-6 bg-[#f4f4f4] shadow-lg w-[90%] flex flex-col gap-4 text-gray-800 text-lg leading-relaxed font-poppins ">
              <p className="text-lg font-semibold">
                <strong>Name:</strong> {patientDetails.name}
              </p>
              <p className="text-lg font-semibold">
                <strong>Gender:</strong> {patientDetails.gender}
              </p>
              <p className="text-lg font-semibold">
                <strong>Age:</strong> {patientDetails.age}
              </p>
              <p className="text-lg font-semibold">
                <strong>Blood Group:</strong> {patientDetails.blood_group}
              </p>
              <p className="text-lg font-semibold">
                <strong>Contact:</strong> {patientDetails.contact_info}
              </p>
            </div>
          )}
        </div>

        {/* Main View */}
        <div className="flex-grow p-6">
          {activeTab === "home" ? <HomeView /> : <MedicalHistoryView />}
        </div>
      </div>
    </div>
  );
};

export default PatientPage;