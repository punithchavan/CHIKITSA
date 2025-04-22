// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { User, Patient, Doctor, Appointment, MedicalRecord, Schedule, Admin } = require('./schema');
const bcrypt = require("bcrypt");
const dotenv = require('dotenv');
dotenv.config();

const mongoURL = process.env.MongoURL;
const Port = process.env.PORT;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// When successfully connected
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully');
});

// When connection throws an error
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

const app = express();
app.use(cors());
app.use(express.json());

// Route to create a new user (Admin, Doctor, or Patient)
app.post('/api/users', async (req, res) => {
  try {
    const { username, password, role, name, gender, dob, age, blood_group, uid, contact_info, address, hospital_name} = req.body;

    // Check if required fields are present
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Missing username, password, or role.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = new User({
      username: username.trim(),
      password_hash: hashedPassword,
      role: role.trim(),
    });

    // Save the user
    const savedUser = await newUser.save();

    // Initialize profile object
    let profile = null;

    // Add to respective role collection based on user role
    if (role === 'Doctor') {
      // Check if all required fields for doctor are provided
      if (!name || !gender || !age || !blood_group || !uid) {
        return res.status(400).json({ message: 'Doctor requires name, gender, age, blood group, and UID.' });
      }

      // Create new doctor profile
      const newDoctor = new Doctor({
        name,
        gender,
        age,
        blood_group,
        uid,
        contact_info,
      });

      profile = await newDoctor.save();
    }

    if (role === 'Patient') {
      // Check if all required fields for patient are provided
      if (!name || !gender || !dob || !age || !blood_group) {
        return res.status(400).json({ message: 'Patient requires name, gender, dob, age, and blood group.' });
      }

      // Create new patient profile
      const newPatient = new Patient({
        name,
        gender,
        dob,
        age,
        blood_group,
        contact_info,
        address,
      });

      profile = await newPatient.save();
    }

    if (role === 'Admin') {
      // Admin role doesn't require additional profile data, but save admin information
      if (!name || !hospital_name) {
        return res.status(400).json({ message: 'Admin requires name and hospital_name.' });
      }

      const newAdmin = new Admin({
        name,
        hospital_name,
      });

      profile = await newAdmin.save();
    }

    // Return success response with the user and profile data
    const { password_hash, ...userWithoutHash } = savedUser.toObject();
    res.status(201).json({
      user: userWithoutHash,
      profile,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not create user', error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Compare the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Prepare user object without password_hash for response
    const { password_hash, ...userWithoutHash } = user.toObject();

    res.json({
      message: "Login successful",
      user: userWithoutHash,  // Return the user data excluding the password
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/admin/connect', async (req, res) => {
  const { patientId, doctorId } = req.body;

  try {
      // 1. Find Patient and Doctor
      const patient = await Patient.findOne({ patient_id: patientId });
      const doctor = await Doctor.findOne({ doctor_id: doctorId });

      if (!patient) {
          return res.status(404).json({ message: 'Patient not found.' });
      }
      if (!doctor) {
          return res.status(404).json({ message: 'Doctor not found.' });
      }

      // 2. Create Appointment
      const newAppointment = new Appointment({
          patient_id: patient._id, // Use the ObjectId of the found patient
          doctor_id: doctor._id,   // Use the ObjectId of the found doctor
          appointment_date: new Date(), // Set a default date or get from request
          appointment_time: 'Not Specified', // Set a default time or get from request
          status: 'scheduled'
      });

      const savedAppointment = await newAppointment.save();

      // 3. Optional: Update Admin Data (Conceptual - you might need to adjust your admin schema)
      // Example: Increment a count of active connections in the admin document
      // await Admin.updateOne({}, { $inc: { active_connections: 1 } });

      res.status(201).json({ message: 'Connection created successfully.', appointment: savedAppointment });

  } catch (error) {
      console.error('Error creating connection:', error);
      res.status(500).json({ message: 'Failed to create connection.' });
  }
});

// Example route to fetch active connections for the table
app.get('/admin/active-connections', async (req, res) => {
  try {
      const activeAppointments = await Appointment.find({ status: 'scheduled' })
          .populate('patient_id', 'patient_id') // Populate with patient_id from Patient model
          .populate('doctor_id', 'doctor_id');   // Populate with doctor_id from Doctor model

      const connections = activeAppointments.map(appt => ({
          patientId: appt.patient_id.patient_id,
          doctorId: appt.doctor_id.doctor_id,
          status: appt.status
      }));

      res.status(200).json(connections);
  } catch (error) {
      console.error('Error fetching active connections:', error);
      res.status(500).json({ message: 'Failed to fetch active connections.' });
  }
});


app.listen(Port, () => {
  console.log("✅ Server running on http://localhost:5000");
});
