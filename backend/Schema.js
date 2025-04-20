const mongoose = require('mongoose');

// Define User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'doctor', 'staff'], required: true },
  created_at: { type: Date, default: Date.now }
});

// Define Patient schema
const patientSchema = new mongoose.Schema({
  patient_id: { type: String, unique: true, required: true }, // Patient ID field
  name: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  dob: { type: Date, required: true },
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
const doctorSchema = new mongoose.Schema({
  doctor_id: { type: String, unique: true, required: true }, // Doctor ID field
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  qualification: { type: String, required: true },
  contact_info: { type: String },
  availability: { type: String }
});

// Pre-save hook for generating doctor_id (DOCxxxx)
doctorSchema.pre('save', function(next) {
  if (!this.doctor_id) {
    // Generate a random 4-digit number for Doctor ID
    const randomId = Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999
    this.doctor_id = `DOC${randomId}`; // Prefix with 'DOC'
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
  appointment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  diagnosis: { type: String },
  prescription: { type: String },
  tests_suggested: { type: String },
  record_date: { type: Date, default: Date.now },
  pdf_path: { type: String }
});

// Define Schedule schema
const scheduleSchema = new mongoose.Schema({
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  day_of_week: { type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true }
});

// Create models
const User = mongoose.model('User', userSchema);
const Patient = mongoose.model('Patient', patientSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);
const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = { User, Patient, Doctor, Appointment, MedicalRecord, Schedule };
