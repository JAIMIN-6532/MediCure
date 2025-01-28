import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch a patient by ID from API
export const fetchPatientById = createAsyncThunk(
    "patients/fetchPatientById",
    async (patientId) => {
      console.log("Patient ID in fetchPatientById:", patientId);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/patient/getpatient/${patientId}`
      );
      console.log("Patient fetched by ID:", response.data);
      return response.data; // returns the patient's data
    }
    );

// Async thunk to fetch appointments by patient ID from API
export const fetchAppointmentsByPatientId = createAsyncThunk(
    "patients/fetchAppointmentsByPatientId",
    async (patientId) => {
      console.log("Patient ID in fetchAppointmentsByPatientId:", patientId);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/patient/getappointment/${patientId}`
      );
      console.log("Appointments fetched by Patient ID:", response.data);
      return response.data; // returns the patient's data
    }
    );


const initialState = {
    selectedPatient: {}, // stores the fetched doctor data by ID
    patientappointments: [], // stores the fetched appointments data by patient ID
   
    // fetchPaStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed' for fetching doctors
    fetchPatientByIdStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed' for fetching a single doctor
    // fetchDoctorAvgRatingStatus: "idle", // Track the fetch status for avgRating
    fetchPatientAppointmentStatus: "idle", // Track the fetch status for appointments
    error: null,
  };

  const patientSlice = createSlice({
    name: "patients",
    initialState,
    reducers: {
      
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPatientById.pending, (state) => {
            state.fetchPatientByIdStatus = "loading";
          })
            .addCase(fetchPatientById.fulfilled, (state, action) => {
                state.fetchPatientByIdStatus = "succeeded";
                state.selectedPatient = action.payload; // store the selected doctor data
            })
            .addCase(fetchPatientById.rejected, (state, action) => {
                state.fetchPatientByIdStatus = "failed";
                state.error = action.error.message;
            })
            .addCase(fetchAppointmentsByPatientId.pending, (state) => {
                state.fetchPatientAppointmentStatus = "loading";
              })
                .addCase(fetchAppointmentsByPatientId.fulfilled, (state, action) => {
                    state.fetchPatientAppointmentStatus = "succeeded";
                    state.patientappointments = action.payload; // store the selected doctor data
                })
                .addCase(fetchAppointmentsByPatientId.rejected, (state, action) => {
                    state.fetchPatientAppointmentStatus = "failed";
                    state.error = action.error.message;
                })
    
    },
  });


  
  export default patientSlice.reducer;

