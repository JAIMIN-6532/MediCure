import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDoctors = createAsyncThunk(
  "doctors/fetchDoctors",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/doctor/getAllDoctors`
    );
    console.log("response", response.data);
    const data = await response.data;
    return data;
  }
);

export const fetchDoctorById = createAsyncThunk(
  "doctors/fetchDoctorById",
  async (doctorId) => {
    console.log("Doctor ID in fetchDoctorById:", doctorId);
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/doctor/doctorinfo/${doctorId}`
    );
    console.log("Doctor fetched by ID:", response.data);
    return response.data;
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

    return response.data;
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
    return response.data;
  }
);

// Initial state
const initialState = {
  doctors: [],
  selectedDoctor: {},
  appointments: [],
  avgRating: null,
  fetchDoctorsStatus: "idle",
  fetchDoctorByIdStatus: "idle",
  fetchDoctorAvgRatingStatus: "idle",
  fetchAppointmentsStatus: "idle",
  error: null,
};

const doctorSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    resetDoctorState: (state) => {
      state.selectedDoctor = {};
      state.fetchDoctorByIdStatus = "idle";
      state.avgRating = null;
      state.fetchDoctorAvgRatingStatus = "idle";
      state.appointments = [];
      state.fetchAppointmentsStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder

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

      .addCase(fetchDoctorById.pending, (state) => {
        state.fetchDoctorByIdStatus = "loading";
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.fetchDoctorByIdStatus = "succeeded";
        state.selectedDoctor = action.payload;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.fetchDoctorByIdStatus = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchDoctorAvgRatingByDoctorId.pending, (state) => {
        state.fetchDoctorAvgRatingStatus = "loading";
      })
      .addCase(fetchDoctorAvgRatingByDoctorId.fulfilled, (state, action) => {
        state.fetchDoctorAvgRatingStatus = "succeeded";

        if (
          Array.isArray(action.payload?.avgRating) &&
          action.payload.avgRating.length > 0
        ) {
          console.log(
            "action.payload",
            action.payload?.avgRating[0]?.avgRating
          );
          state.avgRating = action.payload.avgRating[0]?.avgRating;
        } else {
          state.avgRating = 0;
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

export const selectAllDoctors = (state) => state.doctors.doctors;
export const selectSelectedDoctor = (state) => state.doctors.selectedDoctor;
export const selectFetchDoctorsStatus = (state) =>
  state.doctors.fetchDoctorsStatus;
export const selectFetchDoctorByIdStatus = (state) =>
  state.doctors.fetchDoctorByIdStatus;
export const selectAvgRating = (state) => state.doctors.avgRating;
export const { resetDoctorState } = doctorSlice.actions;

export default doctorSlice.reducer;
