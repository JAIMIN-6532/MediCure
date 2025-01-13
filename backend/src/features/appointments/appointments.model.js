import mongoose from 'mongoose';
const appointmentSchema = new mongoose.Schema({
  patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
  },
  doctor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // e.g., "10:00 AM - 10:30 AM"
  type: { 
    type: String, 
    enum: ['Online', 'Offline'], 
   
  },
  status: { 
    type: String, 
    enum: ['Ongoing', 'Confirmed', 'Cancelled', 'Completed'], 
    default: 'Confirmed' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const AppointmentModel = mongoose.model('Appointment', appointmentSchema);

export default AppointmentModel;
