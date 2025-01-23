import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state
const initialState = {
  appointments: [],
  lockSlotStatus: "idle", // Can be 'idle', 'loading', 'succeeded', 'failed'
  lockSlotError: null,
  releaseSlotStatus: "idle", // Can be 'idle', 'loading', 'succeeded', 'failed'
  releaseSlotError: null,
  bookappointmentStatus: "idle", // Can be 'idle', 'loading', 'succeeded', 'failed'
  bookappointmentError: null,
  status: "idle", // Can be 'idle', 'loading', 'succeeded', 'failed'
  errorA: null,
};


// Create the async thunk for locking an appointment slot
export const lockSlot = createAsyncThunk(
  "appointments/lockSlot",
  async (appointmentData) => {
    console.log("appointmentData", appointmentData);
    const localDate = new Date(appointmentData.date);
    const formattedDate =
      localDate.getFullYear() +
      "-" +
      (localDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      localDate.getDate().toString().padStart(2, "0") +
      "T" +
      localDate.getHours().toString().padStart(2, "0") +
      ":" +
      localDate.getMinutes().toString().padStart(2, "0") +
      ":" +
      localDate.getSeconds().toString().padStart(2, "0") +
      "." +
      localDate.getMilliseconds().toString().padStart(3, "0") +
      "Z"; // Corrected format without any extra dots
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/api/appointment/bookappointment/lock`,
      {
        ...appointmentData,
        date: formattedDate, // Use the correctly formatted local date
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    ); // Modify the URL as needed
    console.log("response inside reducer", response.data);
    return response.data; // Assuming the backend returns the locked appointment
  }
);

// Create the async thunk for releasing an appointment slot
export const releaseSlot = createAsyncThunk(
  "appointments/releaseSlot",
  async (appointmentData) => {
    console.log("appointmentData", appointmentData);
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/api/appointment/bookappointment/release`,
      appointmentData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    ); // Modify the URL as needed
    console.log("response inside reducer", response.data);
    return response.data; // Assuming the backend returns the released appointment
  }
);


// Create the async thunk for fetching appointments By DoctorId
export const fetchAppointmentSlots = createAsyncThunk(
  "appointments/fetchAppointments",
  async (doctorId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/appointment/availableslots/${doctorId}`
    ); // Modify the URL as needed
    console.log("response", response.data);
    return response.data; // Assuming the backend returns an array of appointments
  }
);

// Create the async thunk for booking an appointment
// export const bookAppointment = createAsyncThunk(
//   "appointments/bookAppointment",
//   async (appointmentData) => {
//     console.log("appointmentData", appointmentData);
//     const localDate = new Date(appointmentData.date);

//     // Manually format the date to ISO 8601 format, preserving local time
//     const formattedDate =
//       localDate.getFullYear() +
//       "-" +
//       (localDate.getMonth() + 1).toString().padStart(2, "0") +
//       "-" +
//       localDate.getDate().toString().padStart(2, "0") +
//       "T" +
//       localDate.getHours().toString().padStart(2, "0") +
//       ":" +
//       localDate.getMinutes().toString().padStart(2, "0") +
//       ":" +
//       localDate.getSeconds().toString().padStart(2, "0") +
//       "." +
//       localDate.getMilliseconds().toString().padStart(3, "0") +
//       localDate.toISOString().slice(19); // Slice the timezone offset (e.g., +05:30)

//     console.log("Formatted local date:", formattedDate);

//     // You can also convert it into a specific format, based on your needs.
//     // If you want to send the date as UTC or local time, ensure consistency
//     // console.log("localDateISOString:", localDateISOString);
//     const response = await axios.post(
//       "http://localhost:3000/api/appointment/bookappointment",
//       {
//         ...appointmentData,
//         date: formattedDate, // Use the formatted local date
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     ); // Modify the URL as needed
//     console.log("response inside reducer", response.data);
//     return response.data; // Assuming the backend returns the newly created appointment
//   }
// );
export const bookAppointment = createAsyncThunk(
  "appointments/bookAppointment",
  async (appointmentData) => {
    console.log("appointmentData", appointmentData);

    // Manually format the date to ISO 8601 format, preserving local time
    const localDate = new Date(appointmentData.date);
    const formattedDate =
      localDate.getFullYear() +
      "-" +
      (localDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      localDate.getDate().toString().padStart(2, "0") +
      "T" +
      localDate.getHours().toString().padStart(2, "0") +
      ":" +
      localDate.getMinutes().toString().padStart(2, "0") +
      ":" +
      localDate.getSeconds().toString().padStart(2, "0") +
      "." +
      localDate.getMilliseconds().toString().padStart(3, "0") +
      "Z"; // Corrected format without any extra dots

    console.log("Formatted local date:", formattedDate);

    // Send the request with correctly formatted date
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/api/appointment/bookappointment`,
      {
        ...appointmentData,
        date: formattedDate, // Use the correctly formatted local date
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("response inside reducer", response.data);
    return response.data;
  }
);


// Create the slice
const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointmentSlots.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAppointmentSlots.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.appointments = action.payload; // Store the fetched appointments
      })
      .addCase(fetchAppointmentSlots.rejected, (state, action) => {
        state.status = "failed";
        state.errorA = action.error.message;
      })
      .addCase(bookAppointment.pending, (state) => {
        state.bookappointmentStatus = "loading";
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.bookappointmentStatus = "succeeded";
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.bookappointmentStatus = "failed";
        state.bookappointmentError = action.error.message;
      })
      .addCase(lockSlot.pending, (state) => {
        state.lockSlotStatus = "loading";
      })
      .addCase(lockSlot.fulfilled, (state, action) => {
        state.lockSlotStatus = "succeeded";
      })
      .addCase(lockSlot.rejected, (state, action) => {
        state.lockSlotStatus = "failed";
        state.lockSlotError = action.error.message;
      })
      .addCase(releaseSlot.pending, (state) => {
        state.releaseSlotStatus = "loading";
      })
      .addCase(releaseSlot.fulfilled, (state, action) => {
        state.releaseSlotStatus = "succeeded";
      })
      .addCase(releaseSlot.rejected, (state, action) => {
        state.releaseSlotStatus = "failed";
        state.releaseSlotError = action.error.message;
      });
  },
});

// Export the async thunk to use it in the component
export default appointmentsSlice.reducer;
