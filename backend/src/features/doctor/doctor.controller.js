import DoctorRepository from "./doctor.repository.js"
import OtpController from "../otp/otp.controller.js";

export default class DoctorController{

    constructor(){
        this.doctorRepository = new DoctorRepository(); 
    }
    
}