import {configureStore} from '@reduxjs/toolkit';
import doctorReducer from './reducers/DoctorReducer.js';

const store = configureStore({
    reducer: {
        doctors: doctorReducer,
    }
})

export default store;