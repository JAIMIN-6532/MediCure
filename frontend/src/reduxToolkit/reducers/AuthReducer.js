
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  user:JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

// 1. Doctor Sign-in
export const doctorSignIn = createAsyncThunk(
  'auth/doctorSignIn',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/doctor/dsignin`,
        credentials
      );
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data); 
    }
  }
);

// 2. Doctor Sign-up
export const doctorSignUp = createAsyncThunk(
  'auth/doctorSignUp',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/doctor/dsignup`,
        credentials
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data); 
    }
  }
);

// 3. Patient Sign-in
export const patientSignIn = createAsyncThunk(
  'auth/patientSignIn',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/patient/signin`,
        credentials
      );
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 4. Patient Sign-up
export const patientSignUp = createAsyncThunk(
  'auth/patientSignUp',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/patient/signup`,
        credentials
      );

      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data); 
    }
  }
);

// auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token'); 
      localStorage.removeItem('user'); 
    },
  },
  extraReducers: (builder) => {
    builder.addCase(doctorSignIn.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(doctorSignIn.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload.user)); 
      localStorage.setItem('token', action.payload.token); 
    });
    builder.addCase(doctorSignIn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });

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

    builder.addCase(patientSignIn.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(patientSignIn.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify(action.payload.user)); 
      localStorage.setItem('token', action.payload.token); 
      state.error = null;
    });
    builder.addCase(patientSignIn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });

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

export const { logout } = authSlice.actions;

export default authSlice.reducer;
