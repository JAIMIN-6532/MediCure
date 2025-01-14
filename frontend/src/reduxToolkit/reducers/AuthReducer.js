// src/redux/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  user:JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

// Thunks for asynchronous actions
// 1. Doctor Sign-in
export const doctorSignIn = createAsyncThunk(
  'auth/doctorSignIn',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/doctor/dsignin',
        credentials
      );
      return response.data; // The data from the API response
    } catch (error) {
      return rejectWithValue(error.response.data); // Error response from API
    }
  }
);

// 2. Doctor Sign-up
export const doctorSignUp = createAsyncThunk(
  'auth/doctorSignUp',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/doctor/dsignup',
        credentials
      );
      return response.data; // The data from the API response
    } catch (error) {
      return rejectWithValue(error.response.data); // Error response from API
    }
  }
);

// 3. Patient Sign-in
export const patientSignIn = createAsyncThunk(
  'auth/patientSignIn',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/patient/signin',
        credentials
      );
      return response.data; // The data from the API response
    } catch (error) {
      return rejectWithValue(error.response.data); // Error response from API
    }
  }
);

// 4. Patient Sign-up
export const patientSignUp = createAsyncThunk(
  'auth/patientSignUp',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/patient/signup',
        credentials
      );

      return response.data; // The data from the API response
    } catch (error) {
      return rejectWithValue(error.response.data); // Error response from API
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token'); // Remove token from localStorage on logout
      localStorage.removeItem('user'); // Remove user from localStorage on logout
    },
  },
  extraReducers: (builder) => {
    // Handling Doctor Sign-in
    builder.addCase(doctorSignIn.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(doctorSignIn.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload.user)); // Save user to localStorage
      localStorage.setItem('token', action.payload.token); // Save token to localStorage
    });
    builder.addCase(doctorSignIn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });

    // Handling Doctor Sign-up
    builder.addCase(doctorSignUp.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(doctorSignUp.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    });
    builder.addCase(doctorSignUp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });

    // Handling Patient Sign-in
    builder.addCase(patientSignIn.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(patientSignIn.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify(action.payload.user)); // Save user to localStorage
      localStorage.setItem('token', action.payload.token); // Save token to localStorage
      state.error = null;
    });
    builder.addCase(patientSignIn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });

    // Handling Patient Sign-up
    builder.addCase(patientSignUp.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(patientSignUp.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    });
    builder.addCase(patientSignUp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });
  },
});

// Export actions
export const { logout } = authSlice.actions;

// Export the reducer to be used in the store
export default authSlice.reducer;
