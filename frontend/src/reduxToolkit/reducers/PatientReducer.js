import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPatientById = createAsyncThunk(
  "patients/fetchPatientById",
  async (patientId) => {
    // console.log("Patient ID in fetchPatientById:", patientId);
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/patient/${patientId}`
    );
    // console.log("Patient fetched by ID:", response.data);
    return response.data;
  }
);

export const fetchAppointmentsByPatientId = createAsyncThunk(
  "patients/fetchAppointmentsByPatientId",
  async (patientId) => {
    // console.log("Patient ID in fetchAppointmentsByPatientId:", patientId);
    const response = await axios.get(
      `${
        import.meta.env.VITE_APP_API_URL
      }/api/patient/getappointment/${patientId}`
    );
    // console.log("Appointments fetched by Patient ID:", response.data);
    return response.data;
  }
);

const initialState = {
  selectedPatient: {},
  patientappointments: [],
  fetchPatientByIdStatus: "idle",
  fetchPatientAppointmentStatus: "idle",
  error: null,
};

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientById.pending, (state) => {
        state.fetchPatientByIdStatus = "loading";
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.fetchPatientByIdStatus = "succeeded";
        state.selectedPatient = action.payload;
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
        state.patientappointments = action.payload;
      })
      .addCase(fetchAppointmentsByPatientId.rejected, (state, action) => {
        state.fetchPatientAppointmentStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export default patientSlice.reducer;
