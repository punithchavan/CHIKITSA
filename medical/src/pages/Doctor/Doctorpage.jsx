import React, { useState } from "react";
import { MdSettings } from "react-icons/md";
import logo from "../../assets/logo.png";
import patientai from "../../assets/patientai.png";

function Doctorpage() {
  const [selectedTab, setSelectedTab] = useState("schedule");

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f0f0] overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#fff] border-b border-gray-300 shadow-sm">
        <div className="flex items-center gap-4">
          <img src={logo} alt="logo" className="h-10 w-auto" />
          <div className="text-2xl font-bold leading-none text-gray-800">
            CHIKITSA
          </div>
        </div>

        <div className="flex gap-6 text-gray-700 font-semibold text-lg">
          <button
            className={`hover:text-black pb-1 ${
              selectedTab === "schedule" ? "border-b-2 border-black" : ""
            }`}
            onClick={() => setSelectedTab("schedule")}
          >
            Schedule
          </button>
          <button
            className={`hover:text-black pb-1 ${
              selectedTab === "patientList" ? "border-b-2 border-black" : ""
            }`}
            onClick={() => setSelectedTab("patientList")}
          >
            Patient List
          </button>
        </div>

        <MdSettings className="text-3xl cursor-pointer text-gray-700 hover:text-gray-900 transition" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left Sidebar */}
        <div className="bg-[#fff] text-gray-200 w-full md:w-[22%] flex flex-col items-center py-8 gap-6 shadow-inner border-r-2 border-[#ccc]">
          <img
            src={patientai}
            alt="Admin avatar"
            className="w-24 h-24 rounded-full border-2 border-gray-400 shadow-md"
          />
          <div className="bg-[#f4f4f4] text-gray-800 w-[90%] rounded-lg text-sm leading-relaxed shadow-lg flex flex-col justify-center px-6 py-4 space-y-4 font-poppins">
            <p className="text-lg font-semibold">
              <strong>Name:</strong> Dr. Raj Chopra
            </p>
            <p className="text-lg font-semibold">
              <strong>Gender:</strong> Male
            </p>
            <p className="text-lg font-semibold">
              <strong>Age:</strong> 32
            </p>
            <p className="text-lg font-semibold">
              <strong>Blood Group:</strong> O+
            </p>
            <p className="text-lg font-semibold">
              <strong>Contact:</strong> 9xxxx 9xxxx
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[#f5f5f5] p-6 flex flex-col items-center">
          {selectedTab === "schedule" ? (
            <>
              <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">
                Today's Schedule
              </h2>
              <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-4 overflow-y-auto h-[70vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                {[
                  {
                    name: "Ravi Kumar",
                    date: "24/03/25",
                    reason: "Follow-up Consultation",
                  },
                  {
                    name: "Rohan Verma",
                    date: "24/03/25",
                    reason: "General Checkup",
                  },
                  {
                    name: "Meera Kulkarni",
                    date: "23/03/25",
                    reason: "Nutritional Counseling",
                  },
                  {
                    name: "Ravi Kumar",
                    date: "24/03/25",
                    reason: "Follow-up Consultation",
                  },
                  {
                    name: "Rohan Verma",
                    date: "24/03/25",
                    reason: "General Checkup",
                  },
                  {
                    name: "Meera Kulkarni",
                    date: "23/03/25",
                    reason: "Nutritional Counseling",
                  },
                ].map((patient, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-300 rounded-xl p-4 mb-4 shadow-md bg-white"
                  >
                    <p className="text-lg font-semibold text-gray-800">
                      Name: {patient.name}
                    </p>
                    <p className="text-gray-700">
                      Last Appointment Date: {patient.date}
                    </p>
                    <p className="text-gray-700">
                      Reason for Visit: {patient.reason}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">
                Patient List
              </h2>
              <div className="bg-white w-full max-w-3xl unded-xl shadow-lg p-4 overflow-y-auto h-[70vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                {[
                  {
                    name: "Ravi Kumar",
                    age: 45,
                    contact: "9xxxx 2xxxx",
                    condition: "Diabetes",
                  },
                  {
                    name: "Meera Kulkarni",
                    age: 29,
                    contact: "8xxxx 5xxxx",
                    condition: "Nutrition Plan",
                  },
                  {
                    name: "Ajay Patel",
                    age: 52,
                    contact: "7xxxx 3xxxx",
                    condition: "BP Monitoring",
                  },
                  {
                    name: "Ravi Kumar",
                    age: 45,
                    contact: "9xxxx 2xxxx",
                    condition: "Diabetes",
                  },
                  {
                    name: "Meera Kulkarni",
                    age: 29,
                    contact: "8xxxx 5xxxx",
                    condition: "Nutrition Plan",
                  },
                  {
                    name: "Ajay Patel",
                    age: 52,
                    contact: "7xxxx 3xxxx",
                    condition: "BP Monitoring",
                  },
                ].map((patient, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-300 rounded-xl p-4 mb-4 shadow-md bg-white"
                  >
                    <p className="text-lg font-semibold text-gray-800">
                      Name: {patient.name}
                    </p>
                    <p className="text-gray-700">Age: {patient.age}</p>
                    <p className="text-gray-700">Contact: {patient.contact}</p>
                    <p className="text-gray-700">
                      Condition: {patient.condition}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
          <footer className="text-sm text-gray-500 mt-6">
            © 2025 Chikitsa. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Doctorpage;
