const mongoose = require('mongoose');

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

// Define Medical Record schema
const medicalRecordSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  appointment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment'},
  diagnosis: { type: String },
  prescription: { type: String },
  tests_suggested: { type: String },
  record_date: { type: Date, default: Date.now },
  pdf_path: { type: String }
});



const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
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


// Create models
const User = mongoose.model('User', userSchema);
const Patient = mongoose.model('Patient', patientSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);
const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
const Admin = mongoose.model('Admin', adminSchema);

module.exports = { User, Patient, Doctor, Appointment, MedicalRecord, Admin };
