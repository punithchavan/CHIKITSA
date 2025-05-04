// Updated server.js
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
const { execSync } = require('child_process');

// Configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const mongoURL = process.env.MongoURL;
const Port = process.env.PORT;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
});

const app = express();
app.use(cors());
app.use(express.json());

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) return res.status(401).json({ error: "Incorrect password" });

        const { password_hash, ...userWithoutHash } = user.toObject();
        res.json({ message: "Login successful", user: userWithoutHash });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Upload medical record
app.post('/api/upload-medical-record', upload.single('file'), async (req, res) => {
    try {
        const { patientId, doctorId, description } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const encryptedDescription = encryptDescription(description);
        const inputFilePath = req.file.path;
        const encryptedFilePath = `${inputFilePath}.enc`;

        execSync(`python Encryption.py ${inputFilePath} ${encryptedFilePath}`);

        // Normalize the file path to use forward slashes
        const normalizedFilePath = encryptedFilePath.replace(/\\/g, '/');

        const newRecord = new MedicalRecord({
            patient_id: patientId,
            doctor_id: doctorId,
            description: encryptedDescription,
            pdf: normalizedFilePath
        });

        await newRecord.save();
        fs.unlinkSync(inputFilePath); // Clean up original file
        res.status(201).json({ message: 'Medical record uploaded successfully' });
    } catch (error) {
        console.error('Error uploading medical record:', error);
        res.status(500).json({ message: 'Failed to upload medical record' });
    }
});

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
                username,
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
                username,
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
                username,
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

// View admin active connection count and name
// Route to get active admin stats (active doctors, active patients, active connections)
// Updated /api/admin/dashboard-stats endpoint
app.get('/api/admin/dashboard-stats', async (req, res) => {
    try {
        // Get counts of active doctors and patients
        const activeAppointments = await Appointment.find({ status: 'scheduled' });
        
        // Get unique doctor and patient IDs from active appointments
        const activeDoctorIds = new Set();
        const activePatientIds = new Set();
        
        activeAppointments.forEach(appointment => {
            activeDoctorIds.add(appointment.doctor_id.toString());
            activePatientIds.add(appointment.patient_id.toString());
        });
        
        // Instead of using the Admin.active_connections field,
        // count the active connections directly from appointments
        const activeConnectionsCount = activeAppointments.length;
        
        const stats = {
            activeDoctors: activeDoctorIds.size,
            activePatients: activePatientIds.size,
            activeConnections: activeConnectionsCount
        };
        
        console.log('Active dashboard stats being sent:', stats);
        res.json(stats);
        
    } catch (error) {
        console.error('Error fetching admin dashboard stats:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
    }
});

// Also update the /admin/connect endpoint to not increment the counter
// since we're now counting active connections directly

// Update the update-appointment-status endpoint to not manipulate the counter
app.post('/admin/update-appointment-status', async (req, res) => {
    const { appointmentId, status } = req.body;

    try {
        const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status }, { new: true });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        // Remove the Admin.updateOne calls that manipulate active_connections
        // We're now counting active connections directly from appointments

        res.json({ message: 'Appointment status updated.', appointment });
    } catch (error) {
        console.error('Error updating appointment status:', error);
        res.status(500).json({ message: 'Failed to update appointment status.' });
    }
});
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
            .populate({ 
                path: 'patient_id', 
                select: 'patient_id name' 
            })
            .populate({ 
                path: 'doctor_id', 
                select: 'doctor_id name' 
            });

        const connections = appointments.map(app => ({
            patientId: app.patient_id.patient_id,
            patientName: app.patient_id.name,
            doctorId: app.doctor_id.doctor_id,
            doctorName: app.doctor_id.name,
            date: app.appointment_date.toISOString().split('T')[0], // YYYY-MM-DD format
            time: app.appointment_time,
            reason: app.notes,
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

  // Route to get doctor details by username
app.get('/api/doctor/:username', async (req, res) => {
    try {
        const username = req.params.username;
        
        // First find the user
        const user = await User.findOne({ username, role: 'Doctor' });
        console.log(user)
        if (!user) {
            return res.status(404).json({ message: 'Doctor user not found.' });
        }
        
        // Find doctor profile using uid field which should match user._id
        const doctor = await Doctor.findOne({username});
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found.' });
        }
        
        res.json(doctor);
    } catch (error) {
        console.error('Error fetching doctor details:', error);
        res.status(500).json({ message: 'Failed to get doctor details.' });
    }
});

// Route to get today's appointments for a doctor
app.get('/api/doctor/:doctorId/appointments/today', async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const startTime = "00:00";
        const endTime = "23:59";
        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Find appointments for the doctor that are scheduled for today
        const appointments = await Appointment.find({
            doctor_id: doctorId,
            appointment_date: { $gte: today, $lt: tomorrow },
            appointment_time:{ $gte: startTime, $lt: endTime },
            status: 'scheduled'
        }).populate('patient_id')
        .sort({ appointment_time: 1 }); 
        
        const formattedAppointments = appointments.map(appointment => {
            const patient = appointment.patient_id;
            return {
                name: patient.name,
                date: appointment.appointment_date.toLocaleDateString('en-IN'),
                time:appointment.appointment_time,
                reason: appointment.notes || 'General Consultation',
                patientId: patient._id,
                appointmentId: appointment._id
            };
        });
        
        res.json(formattedAppointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Failed to get appointments.' });
    }
});

// Route to get all patients assigned to a doctor
app.get('/api/doctor/:doctorId/patients', async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        
        // Find all appointments for this doctor to get the associated patients
        const appointments = await Appointment.find({
            doctor_id: doctorId
        }).populate('patient_id');
        
        // Extract unique patients from appointments
        const patientMap = new Map();
        appointments.forEach(appointment => {
            const patient = appointment.patient_id;
            if (patient && !patientMap.has(patient._id.toString())) {
                patientMap.set(patient._id.toString(), {
                    id: patient._id,
                    name: patient.name,
                    age: patient.age,
                    contact: patient.contact_info || 'Not provided',
                    condition: appointment.notes || 'General Checkup'
                });
            }
        });
        
        const patientList = Array.from(patientMap.values());
        res.json(patientList);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Failed to get patient list.' });
    }
});


app.listen(Port, () => {
    console.log(`✅ Server running on http://localhost:${Port})`)
});

async function syncActiveConnectionsCount() {
    try {
        const activeAppointmentsCount = await Appointment.countDocuments({ status: 'scheduled' });
        
        // Update the admin model with the accurate count
        await Admin.updateOne({}, { $set: { active_connections: activeAppointmentsCount } });
        
        console.log(`✅ Active connections synced. Count: ${activeAppointmentsCount}`);
        return activeAppointmentsCount;
    } catch (error) {
        console.error('❌ Failed to sync active connections count:', error);
        throw error;
    }
}

// Add an endpoint to manually trigger synchronization
app.post('/admin/sync-connections', async (req, res) => {
    try {
        const count = await syncActiveConnectionsCount();
        res.json({ message: 'Active connections synced successfully', count });
    } catch (error) {
        res.status(500).json({ message: 'Failed to sync active connections' });
    }
});

// Updated admin/connect endpoint
app.post('/admin/connect', async (req, res) => {
    const { patientId, doctorId, appointmentDate, appointmentTime, notes } = req.body;
    try {
        const patient = await Patient.findOne({ patient_id: patientId });
        const doctor = await Doctor.findOne({ doctor_id: doctorId });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found.' });
        }

        // Format the date properly
        let appDate;
        try {
            appDate = new Date(appointmentDate);
            if (isNaN(appDate.getTime())) {
                throw new Error('Invalid date');
            }
        } catch (error) {
            return res.status(400).json({ message: 'Invalid appointment date format.' });
        }

        const newAppointment = new Appointment({
            patient_id: patient._id,
            doctor_id: doctor._id,
            appointment_date: appDate,
            appointment_time: appointmentTime || 'Not Specified',
            notes: notes || 'General Consultation',
            status: 'scheduled'
        });

        const savedAppointment = await newAppointment.save();

        res.status(201).json({
            message: 'Connection created successfully.',
            appointment: savedAppointment
        });

    } catch (error) {
        console.error('Error creating connection:', error);
        res.status(500).json({ message: 'Failed to create connection.' });
    }
});


// Update the endpoint for doctor's appointments to include new fields
app.get('/api/doctor/:doctorId/appointments/today', async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        
        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Find appointments for the doctor that are scheduled for today
        const appointments = await Appointment.find({
            doctor_id: doctorId,
            appointment_date: { $gte: today, $lt: tomorrow },
            status: 'scheduled'
        }).populate('patient_id');
        
        const formattedAppointments = appointments.map(appointment => {
            const patient = appointment.patient_id;
            return {
                name: patient.name,
                date: appointment.appointment_date.toISOString().split('T')[0], // Consistent date format
                time: appointment.appointment_time,
                reason: appointment.notes || 'General Consultation',
                status: appointment.status,
                patientId: patient._id,
                appointmentId: appointment._id
            };
        });
        
        res.json(formattedAppointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Failed to get appointments.' });
    }
});

// Add these endpoints to your server.js file

// Get patient details by username
app.get('/api/patient/:username', async (req, res) => {
    try {
      const username = req.params.username;
      
      // First, find the user with the patient role
      const user = await User.findOne({ username, role: 'Patient' });
      if (!user) {
        return res.status(404).json({ message: 'Patient user not found.' });
      }
      
      // Then find the patient profile
      const patient = await Patient.findOne({ username });
      if (!patient) {
        return res.status(404).json({ message: 'Patient profile not found.' });
      }
      
      res.json(patient);
    } catch (error) {
      console.error('Error fetching patient details:', error);
      res.status(500).json({ message: 'Failed to get patient details.' });
    }
});
  
// Get patient's appointments with proper sorting by datetime
app.get('/api/patient/:patientId/appointments', async (req, res) => {
    try {
      const patientId = req.params.patientId;
      const now = new Date(); // Local current datetime
  
      const appointments = await Appointment.find({
        patient_id: patientId,
        status: 'scheduled'
      }).populate('doctor_id');
  
      const formattedAppointments = await Promise.all(
        appointments
          .filter(appointment => {
            let appointmentDate;
            // Support both Date object and string format
            if (typeof appointment.appointment_date === 'string') {
              const [year, month, day] = appointment.appointment_date.split('-').map(Number);
              appointmentDate = new Date(year, month - 1, day);
            } else {
              appointmentDate = new Date(appointment.appointment_date);
            }
  
            const [hours, minutes] = appointment.appointment_time.split(':').map(Number);
  
            const appointmentDateTime = new Date(
              appointmentDate.getFullYear(),
              appointmentDate.getMonth(),
              appointmentDate.getDate(),
              hours,
              minutes
            );
  
            return appointmentDateTime >= now;
          })
          .map(async appointment => {
            const doctor = appointment.doctor_id;
  
            let appointmentDate;
            if (typeof appointment.appointment_date === 'string') {
              const [year, month, day] = appointment.appointment_date.split('-').map(Number);
              appointmentDate = new Date(year, month - 1, day);
            } else {
              appointmentDate = new Date(appointment.appointment_date);
            }
  
            const [hours, minutes] = appointment.appointment_time.split(':').map(Number);
  
            const fullDateTime = new Date(
              appointmentDate.getFullYear(),
              appointmentDate.getMonth(),
              appointmentDate.getDate(),
              hours,
              minutes
            );
  
            return {
              appointmentId: appointment._id,
              date: appointment.appointment_date instanceof Date
                ? appointment.appointment_date.toISOString().split('T')[0]
                : appointment.appointment_date,
              time: appointment.appointment_time,
              doctorName: doctor.name,
              doctorId: doctor._id,
              reason: appointment.notes || 'General Consultation',
              status: appointment.status,
              fullDateTime: fullDateTime.toISOString()
            };
          })
      );
  
      // Sort by datetime
      formattedAppointments.sort((a, b) => new Date(a.fullDateTime) - new Date(b.fullDateTime));
  
      const cleanedAppointments = formattedAppointments.map(({ fullDateTime, ...rest }) => rest);
  
      res.json(cleanedAppointments);
    } catch (error) {
      console.error('Error fetching patient appointments:', error);
      res.status(500).json({ message: 'Failed to get patient appointments.' });
    }
  });
  
  
  

// Endpoint to cancel appointment
app.post('/api/appointment/:appointmentId/cancel', async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }
    
    appointment.status = 'cancelled';
    await appointment.save();
    
    res.json({ message: 'Appointment cancelled successfully.', appointment });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Failed to cancel appointment.' });
  }
});
  
  
  // Get patient's medical records
  app.get('/api/patient/:patientId/medical-records', async (req, res) => {
    try {
      const patientId = req.params.patientId;
      
      // Find all medical records for this patient
      const records = await MedicalRecord.find({
        patient_id: patientId
      }).populate('doctor_id');
      
      // Format records for the frontend
      const formattedRecords = records.map(record => {
        const doctor = record.doctor_id;
        
        return {
          recordId: record._id,
          date: record.createdAt || new Date(),
          description: record.description,
          doctorName: doctor ? doctor.name : 'Unknown Doctor',
          doctorId: doctor ? doctor._id : null,
          pdf: record.pdf 
        };
      });
      
      // Sort by date (newest first)
      const sortedRecords = formattedRecords.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      
      res.json(sortedRecords);
    } catch (error) {
      console.error('Error fetching patient medical records:', error);
      res.status(500).json({ message: 'Failed to get patient medical records.' });
    }
  });
  
  // Add a route to handle appointment cancellation
  app.post('/api/appointment/:appointmentId/cancel', async (req, res) => {
    try {
      const appointmentId = req.params.appointmentId;
      
      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { status: 'cancelled' },
        { new: true }
      );
      
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found.' });
      }
      
      res.json({ 
        message: 'Appointment cancelled successfully',
        appointment 
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      res.status(500).json({ message: 'Failed to cancel appointment.' });
    }
  });

  // Add these endpoints to server.js

// Get patient by name
app.get('/api/patient/by-name/:name', async (req, res) => {
    try {
      const name = req.params.name;
      
      // Find the patient with the given name
      const patient = await Patient.findOne({ name: name });
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found.' });
      }
      
      res.json(patient);
    } catch (error) {
      console.error('Error fetching patient by name:', error);
      res.status(500).json({ message: 'Failed to get patient by name.' });
    }
  });
  
  // Get existing medical record
  app.get('/api/medical-record/:patientId/:doctorId', async (req, res) => {
    try {
      const { patientId, doctorId } = req.params;
      
      // Find the most recent medical record for this patient-doctor pair
      const medicalRecord = await MedicalRecord.findOne({
        patient_id: patientId,
        doctor_id: doctorId
      }).sort({ uploadedAt: -1 });
      
      if (!medicalRecord) {
        return res.status(404).json({ message: 'No medical record found.' });
      }
      
      res.json(medicalRecord);
    } catch (error) {
      console.error('Error fetching medical record:', error);
      res.status(500).json({ message: 'Failed to get medical record.' });
    }
  });
  
  // Create a new medical record
  app.post('/api/create-medical-record', upload.single('file'), async (req, res) => {
    try {
      const { patientId, doctorId, description } = req.body;
      if (!patientId || !doctorId || !description) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      if (!patientId || !doctorId) {
        return res.status(400).json({ message: 'Patient ID and Doctor ID are required.' });
      }
      
      // Create a new medical record
      const newRecord = new MedicalRecord({
        patient_id: patientId,
        doctor_id: doctorId,
        description: description || '',
        pdf: req.file ? req.file.path : null,
        uploadedAt: new Date()
      });
      
      await newRecord.save();
      
      res.status(201).json({ 
        message: 'Medical record created successfully',
        record: newRecord
      });
    } catch (error) {
      console.error('Error creating medical record:', error);
      res.status(500).json({ message: 'Failed to create medical record.' });
    }
  });
  
  // Update an existing medical record
  app.put('/api/update-medical-record', upload.single('file'), async (req, res) => {
    try {
      const { recordId, patientId, doctorId, description } = req.body;
      
      if (!recordId) {
        return res.status(400).json({ message: 'Record ID is required.' });
      }
      
      // Find the existing record
      const existingRecord = await MedicalRecord.findById(recordId);
      if (!existingRecord) {
        return res.status(404).json({ message: 'Medical record not found.' });
      }
      
      // Update the record
      existingRecord.description = description || existingRecord.description;
      existingRecord.uploadedAt = new Date(); // Update the upload timestamp
      
      // If a new file was uploaded, update the pdf field
      if (req.file) {
        // Delete the old file if it exists
        if (existingRecord.pdf) {
          try {
            fs.unlinkSync(existingRecord.pdf);
          } catch (unlinkError) {
            console.error('Error deleting old file:', unlinkError);
            // Continue even if delete fails
          }
        }
        existingRecord.pdf = req.file.path;
      }
      
      await existingRecord.save();
      
      res.status(200).json({ 
        message: 'Medical record updated successfully',
        record: existingRecord
      });
    } catch (error) {
      console.error('Error updating medical record:', error);
      res.status(500).json({ message: 'Failed to update medical record.' });
    }
  });
  
  // Get all medical records for a patient
  app.get('/api/patient/:patientId/all-medical-records', async (req, res) => {
    try {
      const patientId = req.params.patientId;
      
      const records = await MedicalRecord.find({
        patient_id: patientId
      }).sort({ uploadedAt: -1 });
      
      // Since doctor_id is a String in your schema, we need to fetch doctor names separately
      const formattedRecords = await Promise.all(records.map(async record => {
        let doctorName = 'Unknown Doctor';
        let doctorIdValue = record.doctor_id;
        
        // Try to find the doctor by ID
        try {
          const doctor = await Doctor.findOne({ _id: record.doctor_id });
          if (doctor) {
            doctorName = doctor.name;
          }
        } catch (err) {
          console.error('Error finding doctor:', err);
        }
        
        return {
          recordId: record._id,
          date: record.uploadedAt,
          description: record.description,
          doctorName: doctorName,
          doctorId: doctorIdValue,
          pdf: record.pdf
        };
      }));
      
      res.json(formattedRecords);
    } catch (error) {
      console.error('Error fetching patient medical records:', error);
      res.status(500).json({ message: 'Failed to get patient medical records.' });
    }
  });

// Encrypt medical record description
function encryptDescription(description) {
    const inputFilePath = path.join(__dirname, 'temp_description.txt');
    const encryptedFilePath = path.join(__dirname, 'temp_encrypted.json');

    // Write the description to a temporary file
    fs.writeFileSync(inputFilePath, description, 'utf-8');

    // Call the Python script to encrypt the file
    execSync(`python Encryption.py ${inputFilePath} ${encryptedFilePath}`);

    // Read the encrypted data
    const encryptedData = fs.readFileSync(encryptedFilePath, 'utf-8');

    // Clean up temporary files
    fs.unlinkSync(inputFilePath);
    fs.unlinkSync(encryptedFilePath);

    return encryptedData;
}

// Decrypt medical record description
function decryptDescription(encryptedData) {
    const encryptedFilePath = path.join(__dirname, 'temp_encrypted.json');
    const decryptedFilePath = path.join(__dirname, 'temp_decrypted.txt');

    // Write the encrypted data to a temporary file
    fs.writeFileSync(encryptedFilePath, encryptedData, 'utf-8');

    // Call the Python script to decrypt the file
    execSync(`python Encryption.py ${encryptedFilePath} ${decryptedFilePath}`);

    // Read the decrypted data
    const decryptedData = fs.readFileSync(decryptedFilePath, 'utf-8');

    // Clean up temporary files
    fs.unlinkSync(encryptedFilePath);
    fs.unlinkSync(decryptedFilePath);

    return decryptedData;
}

app.get('/api/patient/:patientId/medical-records', async (req, res) => {
    try {
        const patientId = req.params.patientId;

        // Find all medical records for this patient
        const records = await MedicalRecord.find({ patient_id: patientId });

        // Fetch doctor names for each record
        const formattedRecords = await Promise.all(
            records.map(async (record) => {
                let doctorName = 'Unknown Doctor';
                if (record.doctor_id) {
                    try {
                        const doctor = await Doctor.findById(record.doctor_id);
                        if (doctor) {
                            doctorName = doctor.name;
                        }
                    } catch (err) {
                        console.error(`Error fetching doctor with ID ${record.doctor_id}:`, err);
                    }
                }

                const decryptedDescription = decryptDescription(record.description);

                return {
                    recordId: record._id,
                    date: record.createdAt || new Date(),
                    description: decryptedDescription,
                    doctorName: doctorName,
                    doctorId: record.doctor_id,
                    pdf: record.pdf,
                };
            })
        );

        console.log('Formatted Records:', formattedRecords); // Debug the records

        // Sort by date (newest first)
        const sortedRecords = formattedRecords.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        res.json(sortedRecords);
    } catch (error) {
        console.error('Error fetching patient medical records:', error);
        res.status(500).json({ message: 'Failed to get patient medical records.' });
    }
});

app.use((req, res, next) => {
    res.status(404).json({ message: 'File not found' });
});




// Helper function to encrypt a file using Encryption.py
function encryptFile(inputFilePath, outputFilePath) {
    try {
        execSync(`python Encryption.py ${inputFilePath} ${outputFilePath}`);
        return outputFilePath;
    } catch (error) {
        console.error('Error encrypting file:', error);
        throw new Error('Failed to encrypt file');
    }
}

// Helper function to decrypt a file using Encryption.py
function decryptFile(inputFilePath, outputFilePath) {
    try {
        execSync(`python Encryption.py ${inputFilePath} ${outputFilePath}`);
        const decryptedData = fs.readFileSync(outputFilePath, 'utf-8');
        fs.unlinkSync(outputFilePath); // Clean up temporary decrypted file
        return decryptedData;
    } catch (error) {
        console.error('Error decrypting file:', error);
        throw new Error('Failed to decrypt file');
    }
}

// Create a new medical record with encryption
app.post('/api/create-medical-record', upload.single('file'), async (req, res) => {
    try {
        const { patientId, doctorId, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const inputFilePath = req.file.path;
        const encryptedFilePath = `${inputFilePath}.enc`;

        // Encrypt the uploaded PDF file
        encryptFile(inputFilePath, encryptedFilePath);

        // Save the encrypted file path and description to the database
        const newRecord = new MedicalRecord({
            patient_id: patientId,
            doctor_id: doctorId,
            description, // Save plain description (optional: encrypt description if needed)
            pdf: encryptedFilePath,
        });

        await newRecord.save();
        fs.unlinkSync(inputFilePath); // Clean up original file

        res.status(201).json({ message: 'Medical record created successfully', record: newRecord });
    } catch (error) {
        console.error('Error creating medical record:', error);
        res.status(500).json({ message: 'Failed to create medical record' });
    }
});

// Update an existing medical record with encryption
app.put('/api/update-medical-record', upload.single('file'), async (req, res) => {
    try {
        const { recordId, description } = req.body;

        const existingRecord = await MedicalRecord.findById(recordId);
        if (!existingRecord) {
            return res.status(404).json({ message: 'Medical record not found' });
        }

        // Update description if provided
        if (description) {
            existingRecord.description = description;
        }

        // Encrypt and update the file if a new file is uploaded
        if (req.file) {
            const inputFilePath = req.file.path;
            const encryptedFilePath = `${inputFilePath}.enc`;

            // Encrypt the uploaded PDF file
            encryptFile(inputFilePath, encryptedFilePath);

            // Delete the old encrypted file
            if (existingRecord.pdf) {
                fs.unlinkSync(existingRecord.pdf);
            }

            existingRecord.pdf = encryptedFilePath;
            fs.unlinkSync(inputFilePath); // Clean up original file
        }

        await existingRecord.save();
        res.status(200).json({ message: 'Medical record updated successfully', record: existingRecord });
    } catch (error) {
        console.error('Error updating medical record:', error);
        res.status(500).json({ message: 'Failed to update medical record' });
    }
});

// View medical records with decryption
app.get('/api/patient/:patientId/medical-records', async (req, res) => {
    try {
        const patientId = req.params.patientId;

        // Find all medical records for this patient
        const records = await MedicalRecord.find({ patient_id: patientId });

        // Decrypt the PDF files and format the records
        const formattedRecords = await Promise.all(
            records.map(async (record) => {
                let decryptedPdfPath = `${record.pdf}.decrypted.pdf`;

                // Decrypt the PDF file
                decryptFile(record.pdf, decryptedPdfPath);

                return {
                    recordId: record._id,
                    date: record.createdAt || new Date(),
                    description: record.description,
                    doctorId: record.doctor_id,
                    pdf: decryptedPdfPath, // Path to the decrypted PDF
                };
            })
        );

        res.json(formattedRecords);
    } catch (error) {
        console.error('Error fetching medical records:', error);
        res.status(500).json({ message: 'Failed to fetch medical records' });
    }
});