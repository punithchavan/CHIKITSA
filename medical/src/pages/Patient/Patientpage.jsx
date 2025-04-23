import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import patientai from "../../assets/patientai.png";
import { MdSettings } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";

function Patientpage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("home");

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f0f0] overflow-hidden">
      {/* Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center px-4 py-4 bg-white border-b border-gray-300 shadow-sm">
        {/* Left: Logo */}
        <div className="flex items-center mb-2 sm:mb-0">
          <img src={logo} alt="chikitsa_logo" className="w-10 h-10" />
          <p className="ml-3 text-xl font-bold text-gray-800">CHIKITSA</p>
        </div>

        {/* Center: Tabs */}
        <div className="flex gap-6 text-gray-700 font-medium text-base">
          <button
            className={`hover:text-black pb-1 ${selectedTab === "home" ? "border-b-2 border-black" : ""}`}
            onClick={() => setSelectedTab("home")}
          >
            Home
          </button>
          <button
            className={`hover:text-black pb-1 ${selectedTab === "services" ? "border-b-2 border-black" : ""}`}
            onClick={() => setSelectedTab("services")}
          >
            Book Appointment
          </button>
        </div>

        {/* Right: Settings */}
        <div className="mt-2 sm:mt-0">
          <MdSettings size={26} className="text-black" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left Sidebar */}
        <div className="bg-white w-full md:w-[22%] flex flex-col items-center py-8 gap-6 shadow-inner border-r border-gray-200">
          <img
            src={patientai}
            alt="Admin avatar"
            className="w-24 h-24 rounded-full border-2 border-gray-400 shadow-md"
          />
          <div className="bg-[#f4f4f4] text-gray-800 w-[90%] rounded-lg text-sm leading-relaxed shadow-md px-6 py-4 space-y-4">
            <p><strong>Name:</strong> Ravi Kumar</p>
            <p><strong>Gender:</strong> Male</p>
            <p><strong>Age:</strong> 24</p>
            <p><strong>Blood Group:</strong> A+</p>
            <p><strong>Contact:</strong> 9xxxx 3xxxx</p>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-[#f5f5f5] p-4 sm:p-6 overflow-auto">
          {selectedTab === "home" && (
            <div className="flex flex-col gap-6 bg-white rounded-xl p-4 shadow-md">
              {/* Appointments */}
              <div>
                <p className="text-lg font-semibold text-gray-800 mb-2">Upcoming Appointments:</p>
                <div className="bg-white p-3 rounded-lg shadow-sm overflow-y-auto h-64 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                  {[
                    { date: "2023-10-01", time: "10:00 AM", doctor: "Dr. Raj Chopra", hospital: "Apollo Hospital", reason: "Routine Checkup" },
                    { date: "2023-10-02", time: "11:00 AM", doctor: "Dr. Priya Sharma", hospital: "Max Hospital", reason: "Follow-up" },
                    { date: "2023-10-03", time: "12:00 PM", doctor: "Dr. Anil Verma", hospital: "Fortis Hospital", reason: "Consultation" },
                    { date: "2023-10-04", time: "01:00 PM", doctor: "Dr. Neha Gupta", hospital: "AIIMS", reason: "Checkup" },
                    { date: "2023-10-05", time: "02:00 PM", doctor: "Dr. Rahul Singh", hospital: "Manipal Hospital", reason: "Consultation" },
                  ].map((appointment, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:items-center p-2 border-b border-gray-300 text-gray-700">
                      <div><strong>Date:</strong> {appointment.date}</div>
                      <div><strong>Time:</strong> {appointment.time}</div>
                      <div><strong>Doctor:</strong> {appointment.doctor}</div>
                      <div><strong>Hospital:</strong> {appointment.hospital}</div>
                      <div><strong>Reason:</strong> {appointment.reason}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* History */}
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-gray-800">History:</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Filters</p>
                    <button className="text-gray-600 hover:text-gray-800"><FaFilter /></button>
                  </div>
                </div>
                <div className="bg-white p-3 mt-2 rounded-lg shadow-sm overflow-y-auto h-64 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                  {[
                    { date: "2023-09-01", doctor: "Dr. Raj Chopra", hospital: "Apollo Hospital", reason: "Routine Checkup" },
                    { date: "2023-09-02", doctor: "Dr. Priya Sharma", hospital: "Max Hospital", reason: "Follow-up" },
                    { date: "2023-09-03", doctor: "Dr. Anil Verma", hospital: "Fortis Hospital", reason: "Consultation" },
                    { date: "2023-09-04", doctor: "Dr. Neha Gupta", hospital: "AIIMS", reason: "Checkup" },
                    { date: "2023-09-05", doctor: "Dr. Rahul Singh", hospital: "Manipal Hospital", reason: "Consultation" },
                  ].map((history, index) => (
                    <div key={index} className="flex justify-between items-start sm:items-center p-2 border-b border-gray-300 text-gray-700">
                       <div><strong>Date:</strong> {history.date}</div>
                      <div><strong>Doctor:</strong> {history.doctor}</div>
                      <div><strong>Hospital:</strong> {history.hospital}</div>
                      <div className="flex items-center gap-2">
                      <span><strong>Reason:</strong> {history.reason}</span>
                      <button className="text-gray-500 hover:text-gray-700 p-2"><FaDownload /></button>
                    </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === "services" && (
            <div className="text-gray-800 text-lg font-medium bg-white p-6 rounded-xl shadow-md">
              Book your appointment here!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Patientpage;
