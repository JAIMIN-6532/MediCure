import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch doctors from API
export const fetchDoctors = createAsyncThunk(
  "doctors/fetchDoctors",
  async () => {
    // console.log("fetchDoctors", process.env.REACT_APP_API_URL);
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/doctor/getAllDoctors`
    );
    console.log("response", response.data);
    // console.log(process.env.REACT_APP_API_URL);
    const data = await response.data;
    return data;
  }
);

// Async thunk to fetch a doctor by ID from API
export const fetchDoctorById = createAsyncThunk(
  "doctors/fetchDoctorById",
  async (doctorId) => {
    console.log("Doctor ID in fetchDoctorById:", doctorId);
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/doctor/doctorinfo/${doctorId}`
    );
    console.log("Doctor fetched by ID:", response.data);
    return response.data; // returns the doctor's data
  }
);

export const fetchDoctorAvgRatingByDoctorId = createAsyncThunk(
  "doctors/fetchDoctorAvgRatingByDoctorId",
  async (doctorId) => {
    console.log("Doctor ID in fetchDoctorAvgRatingByDoctorId:", doctorId);
    const response = await axios.get(
      `${
        import.meta.env.VITE_APP_API_URL
      }/api/feedback/getavgrating/${doctorId}`
    );
    console.log("Doctor fetched by ID:", response.data);

    return response.data; // returns the doctor's data
  }
);

export const fetchAppointmentsByDoctorId = createAsyncThunk(
  "doctors/fetchAppointmentsByDoctorId",
  async (doctorId) => {
    console.log("Doctor ID in fetchAppointmentsByDoctorId:", doctorId);
    const response = await axios.get(
      `${
        import.meta.env.VITE_APP_API_URL
      }/api/doctor/getappointment/${doctorId}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    console.log("Doctor fetched by ID:", response.data);
    return response.data; // returns the doctor's data
  }
);

// Initial state
const initialState = {
  doctors: [], // stores all doctors data
  selectedDoctor: {}, // stores the fetched doctor data by ID
  appointments: [], // stores the fetched appointments data by doctor ID
  avgRating: null, // Store the avgRating
  fetchDoctorsStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed' for fetching doctors
  fetchDoctorByIdStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed' for fetching a single doctor
  fetchDoctorAvgRatingStatus: "idle", // Track the fetch status for avgRating
  fetchAppointmentsStatus: "idle", // Track the fetch status for appointments
  error: null,
};

// Slice to handle doctor data
const doctorSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    resetDoctorState: (state) => {
      state.selectedDoctor = {}; // Reset the selectedDoctor data
      state.fetchDoctorByIdStatus = "idle"; // Reset the fetching status to idle
      state.avgRating = null; // Reset avgRating
      state.fetchDoctorAvgRatingStatus = "idle"; // Reset fetch status
      state.appointments = []; // Reset appointments
      state.fetchAppointmentsStatus = "idle"; // Reset fetch status
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetching all doctors
      .addCase(fetchDoctors.pending, (state) => {
        state.fetchDoctorsStatus = "loading";
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.fetchDoctorsStatus = "succeeded";
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.fetchDoctorsStatus = "failed";
        state.error = action.error.message;
      })

      // Fetching a single doctor by ID
      .addCase(fetchDoctorById.pending, (state) => {
        state.fetchDoctorByIdStatus = "loading";
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.fetchDoctorByIdStatus = "succeeded";
        state.selectedDoctor = action.payload; // store the selected doctor data
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.fetchDoctorByIdStatus = "failed";
        state.error = action.error.message;
      })

      // Fetching average rating
      .addCase(fetchDoctorAvgRatingByDoctorId.pending, (state) => {
        state.fetchDoctorAvgRatingStatus = "loading";
      })
      .addCase(fetchDoctorAvgRatingByDoctorId.fulfilled, (state, action) => {
        state.fetchDoctorAvgRatingStatus = "succeeded";

        // Check if avgRating is an array and has at least one item
        if (
          Array.isArray(action.payload?.avgRating) &&
          action.payload.avgRating.length > 0
        ) {
          console.log(
            "action.payload",
            action.payload?.avgRating[0]?.avgRating
          );
          state.avgRating = action.payload.avgRating[0]?.avgRating; // Use the first rating if available
        } else {    
          state.avgRating = 0; // No ratings available, set avgRating to 0
        }
      })
      .addCase(fetchDoctorAvgRatingByDoctorId.rejected, (state, action) => {
        state.fetchDoctorAvgRatingStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAppointmentsByDoctorId.pending, (state) => {
        state.fetchAppointmentsStatus = "loading";
      })
      .addCase(fetchAppointmentsByDoctorId.fulfilled, (state, action) => {
        state.fetchAppointmentsStatus = "succeeded";
        state.appointments = action.payload;
      })
      .addCase(fetchAppointmentsByDoctorId.rejected, (state, action) => {
        state.fetchAppointmentsStatus = "failed";
        state.error = action.error.message;
      });
  },
});

// Export selectors to get doctors and selected doctor
export const selectAllDoctors = (state) => state.doctors.doctors;
export const selectSelectedDoctor = (state) => state.doctors.selectedDoctor;
export const selectFetchDoctorsStatus = (state) =>
  state.doctors.fetchDoctorsStatus;
export const selectFetchDoctorByIdStatus = (state) =>
  state.doctors.fetchDoctorByIdStatus;
export const selectAvgRating = (state) => state.doctors.avgRating;
export const { resetDoctorState } = doctorSlice.actions;

// Export the reducer to be used in the store
export default doctorSlice.reducer;
