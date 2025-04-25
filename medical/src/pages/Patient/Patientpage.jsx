import React from 'react';

const PatientPage = () => {
  return (
    <div className="min-h-screen bg-gray-300 p-4">
      <h1 className="text-lg font-semibold mb-4">Patient Page</h1>
      <div className="bg-white rounded shadow-md p-4 flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-black text-white p-4 rounded">
          <div className="flex flex-col items-center mb-4">
            <img
              src="https://via.placeholder.com/100"
              alt="Profile"
              className="rounded-full w-24 h-24 mb-2"
            />
          </div>
          <div className="bg-white text-black p-4 rounded space-y-2">
            <p><strong>Name:</strong> Ravi Kumar</p>
            <p><strong>Gender:</strong> Male</p>
            <p><strong>Age:</strong> 24</p>
            <p><strong>Blood Group:</strong> A+</p>
            <p><strong>Contact:</strong> 9xxxx 3xxxx</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 p-4 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex space-x-6">
              <span className="font-bold">Home</span>
              <span className="text-gray-700">Medical History</span>
            </div>
            <div className="text-2xl">⚙️</div>
          </div>

          {/* Appointment & Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black text-white p-4 rounded">
              <h2 className="font-bold mb-2">Your Appointments:</h2>
              <div className="bg-white text-black p-2 rounded mb-2">
                <p><strong>Date :</strong> 24 March 2025</p>
                <p><strong>Time :</strong> 2:30 p.m.</p>
                <p><strong>Doctor :</strong> Dr. Raj Chopra</p>
              </div>
              <div className="bg-green-100 text-black p-2 rounded text-sm space-y-1">
                <p>✅ Please arrive 10 minutes early.</p>
                <p>✅ Make sure to see that all relevant medical reports are uploaded in your profile.</p>
              </div>
            </div>

            <div className="bg-black text-white p-4 rounded">
              <h2 className="font-bold mb-2">Small Changes, Big Impact:</h2>
              <div className="bg-green-100 text-black p-2 rounded mb-2">
                <p className="font-bold">Stay Hydrated</p>
                <p className="text-sm">Drink at least 8 glasses of water a day to support digestion, circulation, and energy levels.</p>
              </div>
              <div className="bg-green-100 text-black p-2 rounded">
                <p className="font-bold">Get Some Sunlight</p>
                <p className="text-sm">10–15 minutes of morning sun helps regulate your circadian rhythm and boosts Vitamin D.</p>
              </div>
            </div>
          </div>

          {/* Recently Updated */}
          <div className="bg-black text-white p-4 rounded min-h-[100px]">
            <h2 className="font-bold">Recently Updated:</h2>
            {/* Future update items go here */}
          </div>

          <p className="text-center text-xs text-gray-600">© 2025 Chikitsa. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default PatientPage;