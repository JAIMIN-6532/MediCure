import {configureStore} from '@reduxjs/toolkit';
import doctorReducer from './reducers/DoctorReducer.js';
import authReducer from './reducers/AuthReducer.js';
import appointmentReducer from "./reducers/BookingReducer.js";

const store = configureStore({
    reducer: {
        doctors: doctorReducer,
        auth: authReducer,
        appointments : appointmentReducer
    }
})

export default store;