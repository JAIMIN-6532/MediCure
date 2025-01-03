import mongoose from "mongoose";
import DoctorModel from "./doctor.model.js";

export default class DoctorRepository{

    signUp = async({name,email,password})=>{
        try{
            // const {name,email,password} = req.body;
            const newDoctor = await DoctorModel.create({
                name,
                email,
                password
            });
            console.log(newDoctor);
            return newDoctor;
        }catch(err){
            console.log("repoerr",err);
            throw err;
        }
    }    

    findByEmail = async(email)=>{
        try{
            const doctor = await DoctorModel.findOne({email});
            return doctor;
        }catch(err){
            console.log(err);
            throw err;
        }
    }

    uploadDocument = async ({ doctorId, imageUrl, idPdfUrl, degreePdfUrl }) => {
        try {
          console.log("doctorId",doctorId);
          const objectId = new mongoose.Types.ObjectId(doctorId);
        const updatedDoctor = await DoctorModel.findOneAndUpdate(
          { _id: objectId }, // Condition to find the doctor by doctorId
          {
              $set: {
                  profileImageUrl: imageUrl,
                  idproofUrl: idPdfUrl,
                  degreeDocumentUrl: degreePdfUrl,
              },
          },
          { new: true } // This option ensures the updated document is returned
      );
        //   const updatedDoctor = await DoctorModel.findByIdAndUpdate(
        //     {_id : doctorId}, // doctorId is passed in the function
        //     {
        //         $set: {
        //             profileImageUrl: imageUrl,
        //             idproofUrl: idPdfUrl,
        //             degreeDocumentUrl: degreePdfUrl,
        //         },
        //     },
        //     { new: true } // This option returns the updated document
        // );
          console.log(updatedDoctor);
          return updatedDoctor;
        } catch (err) {
          console.log("reeeeeeepoooo",err);
          throw err;
        }
      };



}