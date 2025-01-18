
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state
const initialState = {
  appointments: [],
  bookappointmentStatus: 'idle', // Can be 'idle', 'loading', 'succeeded', 'failed'
  bookappointmentError: null,
  status: 'idle', // Can be 'idle', 'loading', 'succeeded', 'failed'
  errorA: null,
};

// Create the async thunk for fetching appointments By DoctorId 
export const fetchAppointmentSlots = createAsyncThunk(
  'appointments/fetchAppointments',
  async (doctorId) => {
    const response = await axios.get(`http://localhost:3000/api/appointment/availableslots/${doctorId}`); // Modify the URL as needed
    console.log("response", response.data);
    return response.data; // Assuming the backend returns an array of appointments 
  }
);

// Create the async thunk for booking an appointment
export const bookAppointment = createAsyncThunk(
  'appointments/bookAppointment',
  async (appointmentData) => {
    const response = await axios.post('http://localhost:3000/api/appointment/bookappointment', appointmentData ,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }); // Modify the URL as needed
    console.log("response inside reducer", response.data);
    return response.data; // Assuming the backend returns the newly created appointment
  }
);

// Create the slice
const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointmentSlots.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAppointmentSlots.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.appointments = action.payload; // Store the fetched appointments
      })
      .addCase(fetchAppointmentSlots.rejected, (state, action) => {
        state.status = 'failed';
        state.errorA = action.error.message;
      })
      .addCase(bookAppointment.pending, (state) => {
        state.bookappointmentStatus = 'loading';
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.bookappointmentStatus = 'succeeded';
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.bookappointmentStatus = 'failed';
        state.bookappointmentError = action.error.message;
        
      });
  },
});

// Export the async thunk to use it in the component
export default appointmentsSlice.reducer;
