const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Doctor', 'Patient'], required: true },
  created_at: { type: Date, default: Date.now }
});

// Define Patient schema
const patientSchema = new mongoose.Schema({
  patient_id: { type: String, unique: true }, // Patient ID field
  name: { type: String, required: true },
  username: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  dob: { type: Date },
  age: { type: Number, required: true }, 
  blood_group: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], required: true }, 
  contact_info: { type: String },
  address: { type: String },
  created_at: { type: Date, default: Date.now }
});
// Pre-save hook for generating patient_id (PATxxxx)
patientSchema.pre('save', function(next) {
  if (!this.patient_id) {
    // Generate a random 4-digit number for Patient ID
    const randomId = Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999
    this.patient_id = `PAT${randomId}`; // Prefix with 'PAT'
  }
  next();
});

// Define Doctor schema
// Define Doctor schema
const doctorSchema = new mongoose.Schema({
  doctor_id: { type: String, unique: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  age: { type: Number }, 
  blood_group: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] }, 
  uid: { type: String, unique: true }, 
  contact_info: { type: String }
});

// Pre-save hook for generating doctor_id (DOCxxxx)
doctorSchema.pre('save', function(next) {
  if (!this.doctor_id) {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    this.doctor_id = `DOC${randomId}`;
  }
  next();
});


// Define Appointment schema
const appointmentSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  appointment_date: { type: Date, required: true },
  appointment_time: { type: String, required: true },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], required: true },
  notes: { type: String }
});

const medicalRecordSchema = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true,
    index: true // Index for faster queries
  },
  doctor_id: {
    type: String,
    required: true,
    index: true // Index for faster queries
  },
  pdf: {
    type: String, // Path to the encrypted PDF file
    validate: {
      validator: function (v) {
        return /^(http|https|[\\/]*uploads[\\/])/.test(v); // Allow both forward and backslashes
      },
      message: props => `${props.value} is not a valid file path or URL!`
    }
  },
  description: {
    type: String, // This will store the encrypted description
    required: true
  },
  pdfEncryptionMetadata: {
    algorithm: { type: String, default: 'AES-GCM' },
    keyVersion: { type: String, default: 'v1' }
  },
  decryptionStatus: {
    type: String,
    enum: ['encrypted', 'decrypted'],
    default: 'encrypted'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

  
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  hospital_name: { type: String, required: true },
  password_hash: { type: String, required: true },
  active_connections: { type: Number, default: 0 }, // ✅ Add this line
  created_at: { type: Date, default: Date.now }
});

const bcrypt = require('bcrypt');

adminSchema.pre('save', async function (next) {
  if (this.isModified('password_hash')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password_hash = await bcrypt.hash(this.password_hash, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

function encryptDescription(description) {
    const inputFilePath = path.join(__dirname, 'temp_description.txt');
    const encryptedFilePath = path.join(__dirname, 'temp_encrypted.json');

    try {
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
    } catch (error) {
        console.error('Error in encryptDescription:', error);
        throw new Error('Encryption failed');
    }
}

app.get('/api/patient/:patientId/medical-records', async (req, res) => {
    try {
        const patientId = req.params.patientId;

        const records = await MedicalRecord.find({ patient_id: patientId });

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

                // Decrypt the description
                const decryptedDescription = decryptDescription(record.description);

                return {
                    recordId: record._id,
                    date: record.createdAt || new Date(),
                    description: decryptedDescription, // Send decrypted description
                    doctorName: doctorName,
                    doctorId: record.doctor_id,
                    pdf: record.pdf,
                };
            })
        );

        const sortedRecords = formattedRecords.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        res.json(sortedRecords);
    } catch (error) {
        console.error('Error fetching patient medical records:', error);
        res.status(500).json({ message: 'Failed to get patient medical records.' });
    }
});

// Create models
const User = mongoose.model('User', userSchema);
const Patient = mongoose.model('Patient', patientSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);
const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
const Admin = mongoose.model('Admin', adminSchema);

module.exports = { User, Patient, Doctor, Appointment, MedicalRecord, Admin };
