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

// Initial state
const initialState = {
  doctors: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Slice to handle doctor data
const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log("state", state);
        state.doctors = action.payload;
        console.log("state.doctors", state.doctors);
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});



// Export the selector to get all doctors
export const selectAllDoctors = (state) => state.doctors;

// Export the reducer to be used in the store
// const doctorReducer = doctorSlice.reducer;
export default doctorSlice.reducer;
