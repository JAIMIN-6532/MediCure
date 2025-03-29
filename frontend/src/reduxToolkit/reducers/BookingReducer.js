import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//  initial state
const initialState = {
  appointments: [],
  lockSlotStatus: "idle",
  lockSlotError: null,
  releaseSlotStatus: "idle",
  releaseSlotError: null,
  bookappointmentStatus: "idle",
  bookappointmentError: null,
  status: "idle",
  errorA: null,
};

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
      "Z";
    const response = await axios.post(
      `${
        import.meta.env.VITE_APP_API_URL
      }/api/appointment/bookappointment/lock`,
      {
        ...appointmentData,
        date: formattedDate,
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

export const releaseSlot = createAsyncThunk(
  "appointments/releaseSlot",
  async (appointmentData) => {
    console.log("appointmentData", appointmentData);
    const response = await axios.post(
      `${
        import.meta.env.VITE_APP_API_URL
      }/api/appointment/bookappointment/release`,
      appointmentData,
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

export const fetchAppointmentSlots = createAsyncThunk(
  "appointments/fetchAppointments",
  async (doctorId) => {
    console.log("doctorId", doctorId);
    const response = await axios.get(
      `${
        import.meta.env.VITE_APP_API_URL
      }/api/appointment/availableslots/${doctorId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log("response", response);
    return response.data;
  }
);

export const bookAppointment = createAsyncThunk(
  "appointments/bookAppointment",
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
      "Z";

    console.log("Formatted local date:", formattedDate);
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/api/appointment/bookappointment`,
      {
        ...appointmentData,
        date: formattedDate,
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

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setAvailableSlots(state, action) {
      state.appointments = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointmentSlots.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAppointmentSlots.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.appointments = action.payload;
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

export const { setAvailableSlots } = appointmentsSlice.actions;
export const updateAvailableSlots = (updatedAppointments) => {
  return (dispatch) => {
    dispatch(setAvailableSlots(updatedAppointments));
  };
};
export default appointmentsSlice.reducer;
