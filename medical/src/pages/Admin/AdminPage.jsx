import React, { useState, useEffect } from "react";
import { MdSettings } from "react-icons/md";
import logo from "../../assets/logo.png";
import patientai from "../../assets/patientAi.png";

function Adminpage() {
    const [patientIdInput, setPatientIdInput] = useState("");
    const [doctorIdInput, setDoctorIdInput] = useState("");
    const [activeConnections, setActiveConnections] = useState([]);

    useEffect(() => {
        fetchActiveConnections();
    }, []);

    const fetchActiveConnections = async () => {
        try {
            const response = await fetch('/admin/active-connections');
            if (response.ok) {
                const data = await response.json();
                setActiveConnections(data);
            } else {
                console.error('Failed to fetch active connections');
            }
        } catch (error) {
            console.error('Error fetching active connections:', error);
        }
    };

    const handleConnect = async () => {
        try {
            const response = await fetch('/admin/connect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ patientId: patientIdInput, doctorId: doctorIdInput }),
            });

            if (response.ok) {
                console.log('Connection successful!');
                fetchActiveConnections(); // Refetch to update the table
                setPatientIdInput(""); // Clear input fields
                setDoctorIdInput("");
            } else {
                const errorData = await response.json();
                console.error('Failed to connect:', errorData.message || 'Something went wrong');
                // Optionally, display an error message to the user
            }
        } catch (error) {
            console.error('Error connecting:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f0f0f0]">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#fff] border-b border-gray-300 shadow-sm">
                <div className="flex items-center gap-4">
                    <img src={logo} alt="logo" className="h-10 w-auto" />
                    <div className="text-2xl font-bold leading-none text-gray-800">
                        CHIKITSA
                    </div>
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
                            <strong>Name:</strong> Mukesh
                        </p>
                        <p className="text-lg font-semibold">
                            <strong>Admin Level:</strong> 1
                        </p>
                        <p className="text-lg font-semibold">
                            <strong>Total Doctors:</strong> 150
                        </p>
                        <p className="text-lg font-semibold">
                            <strong>Total Patients:</strong> 2,450
                        </p>
                        <p className="text-lg font-semibold">
                            <strong>Active Connections:</strong> {activeConnections.length}
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-[#f5f5f5] p-6 flex flex-col items-center">
                    <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">
                        Create New Connection
                    </h2>

                    <div className="flex flex-col gap-10 w-full max-w-4xl">
                        {/* Create New Connection Box */}
                        <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-xl shadow-lg w-full space-y-4 md:space-y-0">
                            <div className="flex flex-col md:flex-row gap-4 w-full">
                                <input
                                    type="text"
                                    placeholder="PATxxx"
                                    className="bg-[#f0f0f0] px-6 py-3 rounded-full border border-gray-400 text-gray-700 font-medium w-full md:w-40 shadow-inner"
                                    value={patientIdInput}
                                    onChange={(e) => setPatientIdInput(e.target.value.toUpperCase())}
                                />
                                <input
                                    type="text"
                                    placeholder="DOCxxx"
                                    className="bg-[#f0f0f0] px-6 py-3 rounded-full border border-gray-400 text-gray-700 font-medium w-full md:w-40 shadow-inner"
                                    value={doctorIdInput}
                                    onChange={(e) => setDoctorIdInput(e.target.value.toUpperCase())}
                                />
                            </div>
                            <button
                                className="bg-[#333333] hover:bg-[#444444] text-white px-8 py-3 rounded-full font-semibold transition w-full md:w-auto shadow-md"
                                onClick={handleConnect}
                            >
                                Connect
                            </button>
                        </div>

                        {/* Active Connections Table */}
                        <div className="bg-white p-6 rounded-xl shadow-lg w-full">
                            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                                Active Connections
                            </h3>
                            <div className="w-full">
                                <div className="flex font-semibold text-gray-700 border-b pb-2 text-center">
                                    <div className="w-1/3">Patient ID</div>
                                    <div className="w-1/3">Doctor ID</div>
                                    <div className="w-1/3">Status</div>
                                </div>
                                {activeConnections.map(connection => (
                                    <div key={`${connection.patientId}-${connection.doctorId}`} className="flex text-gray-600 mt-4 text-center">
                                        <div className="w-1/3">{connection.patientId}</div>
                                        <div className="w-1/3">{connection.doctorId}</div>
                                        <div className="w-1/3 text-green-600 font-semibold">
                                            {connection.status}
                                        </div>
                                    </div>
                                ))}
                                {activeConnections.length === 0 && (
                                    <div className="flex text-gray-600 mt-4 text-center">
                                        <div className="w-full">No active connections found.</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Adminpage;