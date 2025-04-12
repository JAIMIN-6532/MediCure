import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  doctors: [],
  doctorsStatus: "idle",
  doctorsError: null,
  patients: [],
  patientsStatus: "idle",
  patientsError: null,
};

export const fetchAllDoctors = createAsyncThunk(
  "admin/fetchAllDoctors",
  async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/getalldoctors",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      //   console.log("Doctor fetched by ID:", response.data);
      return await response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllPatients = createAsyncThunk(
  "admin/fetchAllPatients",
  async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/getallpatients",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return await response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteDoctor = createAsyncThunk(
  "admin/deleteDoctor",
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/admin/doctor/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return doctorId; // return the deleted doctorId
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deletePatient = createAsyncThunk(
  "admin/deletePatient",
  async (patientId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/admin/patient/${patientId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return patientId; // return the deleted doctorId
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyDoctor = createAsyncThunk(
  "admin/verifyDoctor",
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/admin/doctor/verify/${doctorId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminReducer = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDoctors.pending, (state) => {
        state.doctorsStatus = "loading";
      })
      .addCase(fetchAllDoctors.fulfilled, (state, action) => {
        state.doctorsStatus = "succeeded";
        state.doctors = action.payload;
      })
      .addCase(fetchAllDoctors.rejected, (state, action) => {
        state.doctorsStatus = "failed";
        state.doctorsError = action.error.message || "Failed to fetch doctors";
      })
      // Patients cases
      .addCase(fetchAllPatients.pending, (state) => {
        state.patientsStatus = "loading";
      })
      .addCase(fetchAllPatients.fulfilled, (state, action) => {
        state.patientsStatus = "succeeded";
        state.patients = action.payload;
      })
      .addCase(fetchAllPatients.rejected, (state, action) => {
        state.patientsStatus = "failed";
        state.patientsError =
          action.error.message || "Failed to fetch patients";
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.doctors = state.doctors.filter(
          (doctor) => doctor._id !== action.payload
        );
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.patients = state.patients.filter(
          (patient) => patient._id !== action.payload
        );
      })
      .addCase(verifyDoctor.fulfilled, (state, action) => {
        const updatedDoctor = action.payload;
        const index = state.doctors.findIndex(
          (doc) => doc._id === updatedDoctor._id
        );

        if (index !== -1) {
          state.doctors[index] = updatedDoctor;
        }
      });
  },
});

export default adminReducer.reducer;
