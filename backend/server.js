// backend/server.js
const express = require("express");
const mongoose =require("mongoose");
const cors = require("cors");
const { Patient, Doctor, Appointment, MedicalRecord, Schedule } = require('./schema');
const bcrypt=require("bcrypt");
const dotenv=require('dotenv');
dotenv.config()

mongoURL= process.env.MongoURL;
Port=process.env.PORT

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

// Dummy data
const patients = [
  { name: "John Doe", age: 30, diagnosis: "Cold" },
  { name: "Jane Smith", age: 25, diagnosis: "Fever" },
];

// GET API
app.get("/api/patients", (req, res) => {
  res.json(patients);
});

// POST API
app.post("/api/send-data", (req, res) => {
  const data = req.body;
  console.log("Received:", data);
  res.json({ message: "Data received!", received: data });
});

app.post('/api/users', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password_hash: hashedPassword, role });
    const savedUser = await newUser.save();
    const { password_hash, ...userWithoutHash } = savedUser.toObject();
    res.status(201).json(userWithoutHash);
  } catch (error) {
    res.status(500).json({ message: 'Could not create user', error: error.message });
  }
});


app.listen(Port, () => {
  console.log("✅ Server running on http://localhost:5000");
});
