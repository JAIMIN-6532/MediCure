import {configureStore} from '@reduxjs/toolkit';
import doctorReducer from './reducers/DoctorReducer.js';
import authReducer from './reducers/AuthReducer.js';
import appointmentReducer from "./reducers/BookingReducer.js";
import patientReducer from './reducers/PatientReducer.js'
import adminReducer from './reducers/AdminReducer.js'
const store = configureStore({
    reducer: {
        doctors: doctorReducer,
        auth: authReducer,
        appointments : appointmentReducer,
        patients: patientReducer,
        admin : adminReducer,
    }
})

export default store;