import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch doctors from API
export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async () => {
    const response = await axios.get('http://localhost:3000/api/doctor/getAllDoctors');
    console.log("response", response.data);
    const data = await response.data;
    return data;
  }
);

// Async thunk to fetch a doctor by ID from API
export const fetchDoctorById = createAsyncThunk(
  'doctors/fetchDoctorById',
  async (doctorId) => {
    console.log("Doctor ID in fetchDoctorById:", doctorId);
    const response = await axios.get(`http://localhost:3000/api/doctor/doctorinfo/${doctorId}`);
    console.log("Doctor fetched by ID:", response.data);
    return response.data; // returns the doctor's data
  }
);

// Initial state
const initialState = {
  doctors: [], // stores all doctors data
  selectedDoctor: {}, // stores the fetched doctor data by ID
  fetchDoctorsStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed' for fetching doctors
  fetchDoctorByIdStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed' for fetching a single doctor
  error: null,
};

// Slice to handle doctor data
const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    resetDoctorState: (state) => {
      state.selectedDoctor = {}; // Reset the selectedDoctor data
      state.fetchDoctorByIdStatus = 'idle'; // Reset the fetching status to idle
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetching all doctors
      .addCase(fetchDoctors.pending, (state) => {
        state.fetchDoctorsStatus = 'loading';
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.fetchDoctorsStatus = 'succeeded';
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.fetchDoctorsStatus = 'failed';
        state.error = action.error.message;
      })
      
      // Fetching a single doctor by ID
      .addCase(fetchDoctorById.pending, (state) => {
        state.fetchDoctorByIdStatus = 'loading';
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.fetchDoctorByIdStatus = 'succeeded';
        state.selectedDoctor = action.payload; // store the selected doctor data
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.fetchDoctorByIdStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export selectors to get doctors and selected doctor
export const selectAllDoctors = (state) => state.doctors.doctors;
export const selectSelectedDoctor = (state) => state.doctors.selectedDoctor;
export const selectFetchDoctorsStatus = (state) => state.doctors.fetchDoctorsStatus;
export const selectFetchDoctorByIdStatus = (state) => state.doctors.fetchDoctorByIdStatus;

export const { resetDoctorState } = doctorSlice.actions;

// Export the reducer to be used in the store
export default doctorSlice.reducer;
