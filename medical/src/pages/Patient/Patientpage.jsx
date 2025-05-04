import React, { useState, useEffect } from "react";
import { MdSettings, MdLogout } from "react-icons/md";
import logo from "../../assets/logo.png";
import patientai from "../../assets/patient.webp";
import axios from "axios";

// Array of health tips to randomly select from
const HEALTH_TIPS = [
  {
    title: "Stay Hydrated",
    description: "Drink at least 8 glasses of water a day to support digestion, circulation, and energy levels."
  },
  {
    title: "Get Some Sunlight",
    description: "10-15 minutes of morning sun helps regulate your circadian rhythm and boosts Vitamin D."
  },
  {
    title: "Take Deep Breaths",
    description: "Practice deep breathing for 5 minutes daily to reduce stress and improve oxygen flow."
  },
  {
    title: "Stretch Regularly",
    description: "Take short breaks to stretch throughout the day to improve flexibility and reduce muscle tension."
  },
  {
    title: "Limit Screen Time Before Bed",
    description: "Avoid screens 1 hour before bedtime to improve sleep quality and reduce eye strain."
  },
  {
    title: "Eat More Leafy Greens",
    description: "Include dark leafy vegetables in at least one meal per day for essential vitamins and minerals."
  },
  {
    title: "Practice Gratitude",
    description: "Write down three things you're grateful for each day to boost mental wellbeing."
  },
  {
    title: "Stay Active",
    description: "Aim for at least 30 minutes of moderate physical activity most days of the week."
  }
];

// Get random health tips
const getRandomHealthTips = (count = 2) => {
  const shuffled = [...HEALTH_TIPS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const HomeView = ({ patientDetails, appointments, medicalRecords, cancelAppointment }) => {
  const [healthTips, setHealthTips] = useState(getRandomHealthTips());
  const [showMoreAppointments, setShowMoreAppointments] = useState(false);

  const nextAppointment = appointments && appointments.length > 0 ? appointments[0] : null;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const refreshTips = () => {
    setHealthTips(getRandomHealthTips());
  };

  return (
    <div className="space-y-6">
      {/* Appointments and Health Tips Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Your Next Appointment */}
        <div className="flex-1 bg-white border-2 border-black-400 rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-black-600 mb-4">Your Next Appointment:</h2>
          {nextAppointment ? (
            <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50 flex flex-col gap-3 text-gray-700 text-lg">
              <div className="flex gap-2">
                <span className="font-semibold">📅 Date:</span> {formatDate(nextAppointment.date)}
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">⏰ Time:</span> {nextAppointment.time}
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">👨‍⚕️ Doctor:</span> Dr. {nextAppointment.doctorName}
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">📝 Reason:</span> {nextAppointment.reason}
              </div>
            </div>
          ) : (
            <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50 flex flex-col gap-3 text-gray-700 text-lg">
              <p>No upcoming appointments scheduled.</p>
            </div>
          )}
        </div>

        {/* Small Changes, Big Impact */}
        <div className="flex-1 bg-teal-50 border-2 border-black-400 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-black-700">Small Changes, Big Impact:</h2>
            <button
              onClick={refreshTips}
              className="bg-teal-600 text-white px-3 py-1 rounded-lg hover:bg-teal-700 transition"
            >
              Refresh Tips
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthTips.map((tip, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg text-teal-600 mb-1">{tip.title}</h3>
                <p className="text-gray-700">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Medical History Section */}
      <div className="bg-white border-2 border-black-400 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-black-600 mb-4">Medical History</h2>
        {medicalRecords && medicalRecords.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {medicalRecords.map((record, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-teal-700">{record.description}</h3>
                  <span className="text-gray-500 text-sm">{new Date(record.date).toLocaleDateString()}</span>
                </div>
                <div className="mt-2 flex gap-2">
                  <span className="text-gray-700 font-medium">Doctor:</span>
                  <span>{record.doctorName}</span>
                </div>
                {record.pdf && (
                  <div className="mt-3">
                    <a
                      href={`http://localhost:5000/${record.pdf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 transition inline-flex items-center gap-1"
                    >
                      View Document
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 italic">
            No medical records available yet. Your medical history will appear here once records are added.
          </p>
        )}
      </div>
    </div>
  );
};

const PatientPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  // Get username from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const username = user?.username;
  
  // Handle logout
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Redirect to login page
    window.location.href = '/';
  };
  
  useEffect(() => {
    // Function to fetch patient data
    const fetchPatientData = async () => {
      if (!username) {
        console.log("No username found in localStorage");
        setError("Please log in to view your details");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching patient data for username:", username);
        setLoading(true);
        
        // Fetch patient profile
        const patientResponse = await axios.get(`http://localhost:5000/api/patient/${username}`);
        console.log("Patient data received:", patientResponse.data);
        setPatientDetails(patientResponse.data);
        
        // Only proceed if we have a valid patient ID
        if (patientResponse.data && patientResponse.data._id) {
          const patientId = patientResponse.data._id;
          
          try {
            // Fetch appointments
            const appointmentsResponse = await axios.get(`http://localhost:5000/api/patient/${patientId}/appointments`);
            console.log("Appointments received:", appointmentsResponse.data);
            
            // Sort appointments by date and time
            const sortedAppointments = appointmentsResponse.data.sort((a, b) => {
              const dateA = new Date(`${a.date} ${a.time}`);
              const dateB = new Date(`${b.date} ${b.time}`);
              return dateA - dateB;
            });
            
            const scheduledAppointments = sortedAppointments.filter(app => app.status === 'scheduled');
            setAppointments(scheduledAppointments);

          } catch (appointmentsErr) {
            console.error("Error fetching appointments:", appointmentsErr);
            // Don't fail everything if appointments can't be loaded
          }
          
          try {
            // Fetch medical records
            const recordsResponse = await axios.get(`http://localhost:5000/api/patient/${patientId}/medical-records`);
            console.log("Medical records received:", recordsResponse.data);
            setMedicalRecords(recordsResponse.data);
          } catch (recordsErr) {
            console.error("Error fetching medical records:", recordsErr);
            // Don't fail everything if records can't be loaded
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError("Failed to load patient data. Please try again later.");
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [username]);

  // Function to cancel appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/appointment/${appointmentId}/cancel`);
      
      if (response.status === 200) {
        // Update appointments list
        setAppointments(appointments.map(app => 
          app.appointmentId === appointmentId ? { ...app, status: 'cancelled' } : app
        ));
        
        // Remove cancelled appointments from the display
        setAppointments(appointments.filter(app => app.appointmentId !== appointmentId));
        
        alert("Appointment cancelled successfully");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("Failed to cancel appointment. Please try again.");
    }
  };

  // If there's no username in localStorage, show an error
  if (!username && !loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f0f0f0] items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-8 py-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
          <p>No user data found. Please log in again.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f0f0] overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-300 shadow-sm">
        <div className="flex items-center gap-4">
          <img src={logo} alt="logo" className="h-10 w-auto" />
          <div className="text-2xl font-bold text-gray-800">CHIKITSA</div>
        </div>

        <div className="flex items-center gap-4">
          <MdSettings className="text-3xl cursor-pointer text-gray-700 hover:text-gray-900 transition" />
          {/* Logout Button */}
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
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Sidebar - Patient Info */}
        <div className="bg-white text-gray-800 w-full lg:w-72 flex flex-col items-center py-8 gap-6 shadow-inner border-r border-gray-200">
          <img
            src={patientai}
            alt="Patient avatar"
            className="w-24 h-24 rounded-full border-2 border-gray-400 shadow-md"
          />
          {loading ? (
            <div className="text-gray-800 py-4">Loading patient details...</div>
          ) : error ? (
            <div className="text-red-600 p-4">{error}</div>
          ) : patientDetails ? (
            <div className="border border-gray-300 rounded-xl p-6 bg-gray-50 shadow-sm w-[90%] flex flex-col gap-4 text-gray-800">
              <p>
                <strong>Name:</strong> {patientDetails.name}
              </p>
              <p>
                <strong>Gender:</strong> {patientDetails.gender}
              </p>
              <p>
                <strong>Age:</strong> {patientDetails.age}
              </p>
              <p>
                <strong>Blood Group:</strong> {patientDetails.blood_group}
              </p>
              <p>
                <strong>Contact:</strong> {patientDetails.contact_info || "Not provided"}
              </p>
            </div>
          ) : (
            <div className="text-gray-600 p-4">No patient details available</div>
          )}
        </div>

        {/* Main View */}
        <div className="flex-grow p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-xl text-gray-600">Loading patient data...</div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <HomeView 
              patientDetails={patientDetails} 
              appointments={appointments}
              medicalRecords={medicalRecords}
              cancelAppointment={cancelAppointment}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientPage;