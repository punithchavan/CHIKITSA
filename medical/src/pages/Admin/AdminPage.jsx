import React, { useState, useEffect } from "react";
import { MdSettings, MdRefresh, MdError } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import logo from "../../assets/logo.png";
import patientai from "../../assets/admin.webp";

function Adminpage() {
    const [adminDetails, setAdminDetails] = useState(null);
    const [dashboardStats, setDashboardStats] = useState({
        activeDoctors: 0,
        activePatients: 0,
        activeConnections: 0
    });
    const [patientIdInput, setPatientIdInput] = useState("");
    const [doctorIdInput, setDoctorIdInput] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [appointmentReason, setAppointmentReason] = useState("");
    const [activeConnections, setActiveConnections] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingStats, setIsFetchingStats] = useState(false);
    const [isFetchingConnections, setIsFetchingConnections] = useState(false);

    // Set default date to today
    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
        setAppointmentDate(formattedDate);
    }, []);

    // Fetch all data when component mounts
    useEffect(() => {
        console.log("Initial data loading started");
        
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    fetchAdminDetails(),
                    fetchActiveConnections(),
                    fetchDashboardStats()
                ]);
            } catch (error) {
                console.error("Error loading initial data:", error);
                setError("Failed to load dashboard data. Please refresh the page.");
            } finally {
                setIsLoading(false);
                console.log("All data loaded");
            }
        };
        
        fetchAllData();
    }, []);

    const fetchDashboardStats = async () => {
        console.log("Fetching dashboard stats...");
        setIsFetchingStats(true);
        try {
            const response = await fetch('http://localhost:5000/api/admin/dashboard-stats');
            if (response.ok) {
                const data = await response.json();
                console.log("Dashboard stats received:", data);
                setDashboardStats(data);
                return data;
            } else {
                console.error('Failed to fetch dashboard stats:', response.status);
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error("Failed to fetch dashboard stats");
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            return null;
        } finally {
            setIsFetchingStats(false);
        }
    };

    const fetchAdminDetails = async () => {
        console.log("Fetching admin details...");
        try {
            const response = await fetch('http://localhost:5000/admin/stats');
            if (response.ok) {
                try {
                    const data = await response.json();
                    console.log("Admin details received:", data);
                    setAdminDetails(data);
                    return data;
                } catch (jsonError) {
                    console.error('Error parsing admin details JSON:', jsonError);
                    const text = await response.text();
                    console.error('Raw response:', text);
                    setAdminDetails(null);
                    throw new Error("Invalid admin details format");
                }
            } else {
                console.error('Failed to fetch admin details:', response.status);
                const text = await response.text();
                console.error('Error response body:', text);
                setAdminDetails(null);
                throw new Error("Failed to fetch admin details");
            }
        } catch (error) {
            console.error('Error fetching admin details:', error);
            setAdminDetails(null);
            return null;
        }
    };

    const fetchActiveConnections = async () => {
        console.log("Fetching active connections...");
        setIsFetchingConnections(true);
        try {
            const response = await fetch('http://localhost:5000/admin/active-connections');
            if (response.ok) {
                const data = await response.json();
                console.log("Active connections received:", data);
                setActiveConnections(data);
                return data;
            } else {
                console.error('Failed to fetch active connections');
                throw new Error("Failed to fetch active connections");
            }
        } catch (error) {
            console.error('Error fetching active connections:', error);
            return [];
        } finally {
            setIsFetchingConnections(false);
        }
    };

    const handleConnect = async () => {
        // Clear previous messages
        setError("");
        setSuccess("");
        // Input validation
        if (!patientIdInput.trim()) {
            setError("Patient ID is required");
            return;
        }
        
        if (!doctorIdInput.trim()) {
            setError("Doctor ID is required");
            return;
        }
        
        if (!appointmentDate) {
            setError("Appointment date is required");
            return;
        }
        
        if (!appointmentTime) {
            setError("Appointment time is required");
            return;
        }
        
        try {
            console.log("Connecting patient and doctor...");
            
            const response = await fetch('http://localhost:5000/admin/connect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    patientId: patientIdInput, 
                    doctorId: doctorIdInput,
                    appointmentDate: appointmentDate,
                    appointmentTime: appointmentTime,
                    notes: appointmentReason 
                }),
            });

            if (response.ok) {
                console.log('Connection successful!');
                setSuccess("Connection successfully created!");
                
                // Refetch all data to update counts and connections
                console.log("Refreshing data after connection...");
                
                // Use setTimeout to give the server a moment to update before refetching
                setTimeout(async () => {
                    try {
                        await Promise.all([
                            fetchDashboardStats(),
                            fetchActiveConnections()
                        ]);
                    } catch (error) {
                        console.error("Error refreshing data:", error);
                    }
                    
                    // Clear input fields
                    setPatientIdInput("");
                    setDoctorIdInput("");
                    setAppointmentReason("");
                    // Don't clear date and time for convenience
                }, 500);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to connect');
                console.error('Failed to connect:', errorData.message || 'Something went wrong');
            }
        } catch (error) {
            setError("Server error. Please try again.");
            console.error('Error connecting:', error);
        }
    };

    // Sync admin counter with actual connection count
    const syncConnectionCount = async () => {
        try {
            const response = await fetch('http://localhost:5000/admin/sync-connections', {
                method: 'POST'
            });
            
            if (response.ok) {
                const data = await response.json();
                setSuccess(`Connections synced successfully. Count: ${data.count}`);
                await fetchDashboardStats();
            } else {
                setError("Failed to sync connections");
            }
        } catch (error) {
            console.error("Error syncing connections:", error);
            setError("Server error while syncing connections");
        }
    };

    // Get admin name from local storage
    const getUserName = () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            return user.username || adminDetails?.name || "Admin";
        } catch (error) {
            return "Admin";
        }
    };
    
    // Format numbers with commas for better readability
    const formatNumber = (num) => {
        return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = '/';
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
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                  >
                    <MdLogout className="text-xl" />
                    <span>Logout</span>
                  </button>
                </div>
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
                            <strong>Admin Username:</strong> {getUserName()}
                        </p>
                        <p className="text-lg font-semibold">
                            <strong>Admin Level:</strong> 1
                        </p>
                        <p className="text-lg font-semibold">
                            <strong>Active Doctors:</strong> {isLoading || isFetchingStats ? "Loading..." : formatNumber(dashboardStats.activeDoctors)}
                        </p>
                        <p className="text-lg font-semibold">
                            <strong>Active Patients:</strong> {isLoading || isFetchingStats ? "Loading..." : formatNumber(dashboardStats.activePatients)}
                        </p>
                        <p className="text-lg font-semibold">
                            <strong>Active Connections:</strong> {isLoading || isFetchingStats ? "Loading..." : dashboardStats.activeConnections}
                        </p>
                        <div className="flex gap-2">
                            <button 
                                onClick={fetchDashboardStats}
                                disabled={isFetchingStats}
                                className={`mt-2 ${isFetchingStats ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'} text-gray-700 py-2 px-4 rounded-lg text-sm font-medium shadow-sm flex items-center justify-center`}
                            >
                                {isFetchingStats ? 'Refreshing...' : 'Refresh Stats'}
                                {!isFetchingStats && <MdRefresh className="ml-1" />}
                            </button>
                            <button 
                                onClick={syncConnectionCount}
                                className="mt-2 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-4 rounded-lg text-sm font-medium shadow-sm"
                            >
                                Sync Counts
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-[#f5f5f5] p-6 flex flex-col items-center">
                    <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">
                        Create New Connection
                    </h2>

                    <div className="flex flex-col gap-10 w-full max-w-4xl">
                        {/* Create New Connection Box */}
                        <div className="flex flex-col bg-white p-6 rounded-xl shadow-lg w-full space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 w-full mb-4">
                                <div className="w-full md:w-1/2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Patient ID</label>
                                    <input
                                        type="text"
                                        placeholder="PATxxx"
                                        className="bg-[#f0f0f0] px-6 py-3 rounded-full border border-gray-400 text-gray-700 font-medium w-full shadow-inner"
                                        value={patientIdInput}
                                        onChange={(e) => setPatientIdInput(e.target.value.toUpperCase())}
                                    />
                                </div>
                                <div className="w-full md:w-1/2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Doctor ID</label>
                                    <input
                                        type="text"
                                        placeholder="DOCxxx"
                                        className="bg-[#f0f0f0] px-6 py-3 rounded-full border border-gray-400 text-gray-700 font-medium w-full shadow-inner"
                                        value={doctorIdInput}
                                        onChange={(e) => setDoctorIdInput(e.target.value.toUpperCase())}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row md:items-center gap-4 w-full mb-4">
                                <div className="w-full md:w-1/2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Appointment Date</label>
                                    <input
                                        type="date"
                                        className="bg-[#f0f0f0] px-6 py-3 rounded-full border border-gray-400 text-gray-700 font-medium w-full shadow-inner"
                                        value={appointmentDate}
                                        onChange={(e) => setAppointmentDate(e.target.value)}
                                    />
                                </div>
                                <div className="w-full md:w-1/2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Appointment Time</label>
                                    <input
                                        type="time"
                                        className="bg-[#f0f0f0] px-6 py-3 rounded-full border border-gray-400 text-gray-700 font-medium w-full shadow-inner"
                                        value={appointmentTime}
                                        onChange={(e) => setAppointmentTime(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="w-full mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Reason for Appointment</label>
                                <input
                                    type="text"
                                    placeholder="Reason for appointment"
                                    className="bg-[#f0f0f0] px-6 py-3 rounded-full border border-gray-400 text-gray-700 font-medium w-full shadow-inner"
                                    value={appointmentReason}
                                    onChange={(e) => setAppointmentReason(e.target.value)}
                                />
                            </div>
                            
                            <div className="flex justify-center mt-4">
                                <button
                                    className="bg-[#333333] hover:bg-[#444444] text-white px-8 py-3 rounded-full font-semibold transition shadow-md"
                                    onClick={handleConnect}
                                >
                                    Connect
                                </button>
                            </div>
                        </div>

                        {/* Error/Success Messages */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full flex items-center">
                                <MdError className="mr-2" />
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        
                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative w-full">
                                <span className="block sm:inline">{success}</span>
                            </div>
                        )}

                        {/* Active Connections Table */}
                        <div className="bg-white p-6 rounded-xl shadow-lg w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-semibold text-gray-700">
                                    Active Connections ({activeConnections.length})
                                </h3>
                                <button 
                                    onClick={fetchActiveConnections} 
                                    disabled={isFetchingConnections}
                                    className={`${isFetchingConnections ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'} text-gray-700 px-3 py-1 rounded text-sm flex items-center`}>
                                    {isFetchingConnections ? 'Refreshing...' : 'Refresh'}
                                    {!isFetchingConnections && <MdRefresh className="ml-1" />}
                                </button>
                            </div>
                            <div className="w-full overflow-x-auto">
                                <div className="flex font-semibold text-gray-700 border-b pb-2 text-center">
                                    <div className="w-1/6">Patient ID</div>
                                    <div className="w-1/6">Doctor ID</div>
                                    <div className="w-1/6">Date</div>
                                    <div className="w-1/6">Time</div>
                                    <div className="w-1/6">Reason</div>
                                    <div className="w-1/6">Status</div>
                                </div>
                                {isLoading || isFetchingConnections ? (
                                    <div className="text-center py-4 text-gray-500">Loading connections...</div>
                                ) : activeConnections.length > 0 ? (
                                    activeConnections.map((connection, index) => (
                                        <div key={index} className="flex text-gray-600 mt-4 text-center">
                                            <div className="w-1/6">{connection.patientId}</div>
                                            <div className="w-1/6">{connection.doctorId}</div>
                                            <div className="w-1/6">{connection.date || "N/A"}</div>
                                            <div className="w-1/6">{connection.time || "N/A"}</div>
                                            <div className="w-1/6">{connection.reason || "N/A"}</div>
                                            <div className="w-1/6 text-green-600 font-semibold">
                                                {connection.status}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-gray-500">No active connections found</div>
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