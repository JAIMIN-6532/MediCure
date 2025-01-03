const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true }, // In years
  consultationFee: { type: Number, required: true },
  availability: [
    {
      day: { type: String, required: true }, // e.g., Monday
      slots: [{ type: String }], // e.g., ["9:00 AM - 10:00 AM"]
    },
  ],
  serviceType: {
    type: String,
    enum: ['Online', 'Offline', 'Both'], // Options for the type of service
    required: true,
  },
  profileImage: { type: String }, // URL for profile picture
  degreeDocument: { 
    type: String, 
    required: true 
  }, // URL for the uploaded degree PDF
  registrationNumber: { 
    type: String, 
    required: true, 
    unique: true 
  }, // Medical registration number
  verificationStatus: { 
    type: String, 
    enum: ['Pending', 'Verified', 'Rejected'], 
    default: 'Pending' 
  }, // Status of verification
  appointments: [
    { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const DoctorModel = mongoose.model('Doctor', doctorSchema);

export default DoctorModel;
