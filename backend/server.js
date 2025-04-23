// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { User, Patient, Doctor, Appointment, MedicalRecord, Admin } = require('./schema');
const bcrypt = require("bcrypt");
const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');

const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
// Configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save uploaded PDFs here
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage: storage });


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
            if (!name || !hospital_name) {
                return res.status(400).json({ message: 'Admin requires name and hospital_name.' });
            }

            const newAdmin = new Admin({
                name,
                hospital_name,
                password_hash: hashedPassword  // ✅ Add this line to store hashed password
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
        const patient = await Patient.findOne({ patient_id: patientId });
        const doctor = await Doctor.findOne({ doctor_id: doctorId });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found.' });
        }

        const newAppointment = new Appointment({
            patient_id: patient._id,
            doctor_id: doctor._id,
            appointment_date: new Date(),
            appointment_time: 'Not Specified',
            status: 'scheduled'
        });

        const savedAppointment = await newAppointment.save();

        // ✅ Step 3: Update Admin's active_connections count
        await Admin.updateOne({}, { $inc: { active_connections: 1 } });

        res.status(201).json({
            message: 'Connection created successfully.',
            appointment: savedAppointment
        });

    } catch (error) {
        console.error('Error creating connection:', error);
        res.status(500).json({ message: 'Failed to create connection.' });
    }
});

// View admin active connection count and name

// Updated admin/stats endpoint
app.get('/admin/stats', async (req, res) => {
    try {
        // Find any admin - since we're just looking for stats
        const admin = await Admin.findOne({}, { password_hash: 0, __v: 0 });
        if (!admin) {
            return res.status(404).json({ error: 'Admin details not found' });
        }
        res.json(admin);
    } catch (err) {
        console.error('Error fetching admin stats:', err);
        res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
});


// Route to fetch active connections for the table
app.get('/admin/active-connections', async (req, res) => {
    try {
        const appointments = await Appointment.find({ status: 'scheduled' })
            .populate({ path: 'patient_id', select: 'patient_id' })
            .populate({ path: 'doctor_id', select: 'doctor_id' });

        const connections = appointments.map(app => ({
            patientId: app.patient_id.patient_id,
            doctorId: app.doctor_id.doctor_id,
            status: app.status,
        }));

        res.json(connections);
    } catch (err) {
        console.error('Failed to fetch active connections:', err);
        res.status(500).json({ message: 'Failed to fetch active connections.' });
    }
});

// Route to update appointment status (for decrementing active connections)
app.post('/admin/update-appointment-status', async (req, res) => {
    const { appointmentId, status } = req.body;

    try {
        const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status }, { new: true });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        // Check the previous status to avoid double decrementing/incrementing
        const originalAppointment = await Appointment.findById(appointmentId);
        if (originalAppointment?.status === 'scheduled' && status !== 'scheduled') {
            await Admin.updateOne({}, { $inc: { active_connections: -1 } });
        } else if (originalAppointment?.status !== 'scheduled' && status === 'scheduled') {
            await Admin.updateOne({}, { $inc: { active_connections: 1 } });
        }

        res.json({ message: 'Appointment status updated.', appointment });
    } catch (error) {
        console.error('Error updating appointment status:', error);
        res.status(500).json({ message: 'Failed to update appointment status.' });
    }
});

const fileUpload = multer({ dest: 'uploads/' });

app.post('/upload-record', fileUpload.single('file'), async (req, res) => {
    const { patientId, doctorId } = req.body;
    const uploadedFilePath = req.file.path;
    const encryptedOutputPath = `encrypted/${req.file.filename}.json`;

    try {
        // Ensure 'encrypted/' folder exists
        if (!fs.existsSync('encrypted')) {
            fs.mkdirSync('encrypted');
        }

        // Run Python script to encrypt the uploaded file
        const command = `python3 Encrypt.py "${uploadedFilePath}" "${encryptedOutputPath}"`;
        exec(command, async (error, stdout, stderr) => {
            if (error) {
                console.error('Encryption error:', stderr);
                return res.status(500).json({ message: 'Encryption failed' });
            }

            // Save encrypted record in DB
            const newRecord = new MedicalRecord({
                patient_id: patientId,
                doctor_id: doctorId,
                pdf: encryptedOutputPath
            });

            await newRecord.save();
            res.status(201).json({ message: 'File uploaded and encrypted successfully' });
        });
    } catch (error) {
        console.error('Upload or DB error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.listen(Port, () => {
    console.log("✅ Server running on http://localhost:5000");
});