import React, { useState, useEffect } from "react";
import { MdSettings, MdClose } from "react-icons/md";
import logo from "../../assets/logo.png";
import patientai from "../../assets/patientai.png";
import axios from "axios";

function Doctorpage() {
  const [selectedTab, setSelectedTab] = useState("schedule");
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [appointmentStatus, setAppointmentStatus] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (!user?.username) {
          setError("No user data found. Please log in again.");
          setLoading(false);
          return;
        }

        const username = user.username;

        const doctorResponse = await axios.get(`http://localhost:5000/api/doctor/${username}`);
        setDoctorDetails(doctorResponse.data);

        const appointmentsResponse = await axios.get(`http://localhost:5000/api/doctor/${doctorResponse.data._id}/appointments/today`);
        setAppointments(appointmentsResponse.data);

        const patientsResponse = await axios.get(`http://localhost:5000/api/doctor/${doctorResponse.data._id}/patients`);
        setPatients(patientsResponse.data);
      } catch (error) {
        setError(`Error loading data: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadMedicalRecord = async () => {
    if (!selectedFile || !selectedPatient) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('patientId', selectedPatient.patientId);
    formData.append('doctorId', doctorDetails._id);
    formData.append('description', description);

    try {
      await axios.post('http://localhost:5000/api/upload-medical-record', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Medical record uploaded successfully");
      setShowModal(false);
    } catch (error) {
      alert("Failed to upload medical record");
    }
  };

  const handleStatusChange = async (status) => {
    if (!selectedPatient || !selectedPatient.appointmentId) return;
    try {
      await axios.post('http://localhost:5000/admin/update-appointment-status', {
        appointmentId: selectedPatient.appointmentId,
        status
      });
      setAppointmentStatus(status);
      if (status !== 'scheduled') {
        const updatedAppointments = await axios.get(`http://localhost:5000/api/doctor/${doctorDetails._id}/appointments/today`);
        setAppointments(updatedAppointments.data);
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setAppointmentStatus(patient.status || "scheduled");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
    setSelectedFile(null);
    setDescription("");
    setAppointmentStatus("");
  };

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
            className={`hover:text-black pb-1 ${selectedTab === "schedule" ? "border-b-2 border-black" : ""}`}
            onClick={() => setSelectedTab("schedule")}
          >
            Schedule
          </button>
          <button
            className={`hover:text-black pb-1 ${selectedTab === "patientList" ? "border-b-2 border-black" : ""}`}
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
          <img src={patientai} alt="Doctor avatar" className="w-24 h-24 rounded-full border-2 border-gray-400 shadow-md" />
          {loading ? (
            <div className="text-gray-800">Loading doctor details...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="text-gray-800 text-sm space-y-2">
              <p><strong>Name:</strong> {doctorDetails.name}</p>
              <p><strong>Gender:</strong> {doctorDetails.gender}</p>
              <p><strong>Age:</strong> {doctorDetails.age}</p>
              <p><strong>Blood Group:</strong> {doctorDetails.blood_group}</p>
              <p><strong>Contact:</strong> {doctorDetails.contact_info}</p>
              <p><strong>Doctor ID:</strong> {doctorDetails.doctor_id}</p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[#f5f5f5] p-6 flex flex-col items-center">
          {loading ? (
            <p className="text-lg text-gray-700">Loading data...</p>
          ) : error ? (
            <p className="text-lg text-red-600">{error}</p>
          ) : selectedTab === "schedule" ? (
            <>
              <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">Today's Schedule</h2>
              <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-4 overflow-y-auto h-[70vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                {appointments.length === 0 ? (
                  <p className="text-center text-gray-600 mt-10">No appointments scheduled for today.</p>
                ) : (
                  appointments.map((appointment, idx) => (
                    <button
                      key={idx}
                      className="border border-gray-300 rounded-xl p-4 mb-4 shadow-md bg-white hover:bg-gray-200 text-left w-full"
                      onClick={() => handlePatientClick(appointment)}
                    >
                      <p className="text-lg font-semibold text-gray-800">Name: {appointment.name}</p>
                      <p className="text-gray-700">Appointment Date: {appointment.date}</p>
                      <p className="text-gray-700">Reason for Visit: {appointment.reason}</p>
                    </button>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">Patient List</h2>
              <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-4 overflow-y-auto h-[70vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                {patients.length === 0 ? (
                  <p className="text-center text-gray-600 mt-10">No patients assigned yet.</p>
                ) : (
                  patients.map((patient, idx) => (
                    <button
                      key={idx}
                      className="border border-gray-300 rounded-xl p-4 mb-4 shadow-md bg-white hover:bg-gray-200 text-left w-full"
                      onClick={() => handlePatientClick(patient)}
                    >
                      <p className="text-lg font-semibold text-gray-800">Name: {patient.name}</p>
                      <p className="text-gray-700">Age: {patient.age}</p>
                      <p className="text-gray-700">Contact: {patient.contact}</p>
                      <p className="text-gray-700">Condition: {patient.condition}</p>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
          <footer className="text-sm text-gray-500 mt-6">© 2025 Chikitsa. All rights reserved.</footer>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-150 h-150 p-6 relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <MdClose className="text-2xl" />
            </button>

            {/* Status */}
            <h2 className="text-2xl font-bold text-black mt-4">Status of the Appointment</h2>
            <div className="flex justify-between mt-4">
              <button
                className={`w-60 p-4 border-2 ${appointmentStatus === 'cancelled' ? 'border-red-500 bg-red-100' : 'border-gray-300'} rounded-lg`}
                onClick={() => handleStatusChange('cancelled')}
              >
                Cancelled
              </button>
              <button
                className={`w-60 p-4 border-2 ${appointmentStatus === 'completed' ? 'border-green-500 bg-green-100' : 'border-gray-300'} rounded-lg`}
                onClick={() => handleStatusChange('completed')}
              >
                Completed
              </button>
            </div>

            {/* Medical Record Description */}
            <h2 className="text-2xl font-bold text-black mt-8">Medical Records</h2>
            <textarea
              className="mt-4 p-4 border-2 border-gray-300 rounded-lg h-32 resize-none w-full"
              placeholder="Enter medical records description here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Upload PDF */}
            <h2 className="text-2xl font-bold text-black mt-8">Report Link</h2>
            <div className="mt-4">
              <label className="text-lg font-semibold text-gray-700">Upload PDF:</label>
              <div className="mt-2 flex items-center gap-4">
                <input type="file" id="files" accept=".pdf" className="hidden" onChange={handleFileChange} />
                <label htmlFor="files" className="p-4 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 text-black">
                  {selectedFile ? selectedFile.name : "Select File"}
                </label>
                {selectedFile && (
                  <button onClick={handleUploadMedicalRecord} className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Upload Record
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctorpage;
