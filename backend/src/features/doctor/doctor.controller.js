import DoctorRepository from "./doctor.repository.js"
import OtpController from "../otp/otp.controller.js";
import bcrypt from 'bcryptjs'
import { upload ,uploadFiles} from "../../middleware/uploadfile.middleware.js";

export default class DoctorController{

    constructor(){
        this.doctorRepository = new DoctorRepository();
        this.otpController = new OtpController(); 
    }

    signUp = async(req,res,next)=>{
        try{
            const {name,email,password,otp} = req.body;
            const hashedPassword = await bcrypt.hash(password,12);
            let isVerified = false;
            isVerified = await this.otpController.verifyOtp(email,otp);
            if(isVerified){
                const doctor = await this.doctorRepository.signUp({
                    name,
                    email,
                    password:hashedPassword
                });
                console.log("doctorrrrr",doctor);
                return res.status(201).json(doctor);
            }else {
                return res.status(400).send("Invalid OTP");
               }
        }catch(err){
            console.log("errrrr" ,err);
            next(err);
        }
    }

    uploadDocument = async (req, res, next) => {
        try {
          if (!req.files || !req.files['images'] || !req.files['id'] || !req.files['degree']) {
            return res.status(400).json({ message: 'All files are required' });
          }
    
          // URLs of uploaded files
          const imageUrl = `/uploads/images/${req.files['images'][0].filename}`;
          const idPdfUrl = `/uploads/id/${req.files['id'][0].filename}`;
          const degreePdfUrl = `/uploads/degree/${req.files['degree'][0].filename}`;
    
          // Assuming `doctorId` is passed in the URL parameter
          const  doctorId = req.params.doctorId;
          console.log("doctorId constroller",doctorId);
          console.log(req.params.doctorId);
          // Update the doctor document with the file URLs
          const updatedDoctor = await this.doctorRepository.uploadDocument({
            doctorId,
            imageUrl,
            idPdfUrl,
            degreePdfUrl,
          });
    
          console.log(updatedDoctor);
          return res.status(201).json({
            message: 'Documents uploaded successfully',
            doctor: updatedDoctor,
          });
        } catch (err) {
          console.error("errrrrrrrrrrrrrrrr",err.message);
          next(err);
        }
      };
    
}