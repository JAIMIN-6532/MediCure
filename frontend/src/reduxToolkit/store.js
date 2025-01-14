import {configureStore} from '@reduxjs/toolkit';
import doctorReducer from './reducers/DoctorReducer.js';
import authReducer from './reducers/AuthReducer.js';

const store = configureStore({
    reducer: {
        doctors: doctorReducer,
        auth: authReducer,
    }
})

export default store;