import FeedbackModel from "./feedback.model.js";
import PatientModel from "../patient/patient.model.js";
import DoctorModel from "../doctor/doctor.model.js";
import mongoose from "mongoose";

export default class FeedbackRepository {
  addFeedback = async (feedback) => {
    try {
      const newFeedback = await FeedbackModel.create(feedback);

      newFeedback.save();
      if (newFeedback) {
        const patientUpdated = await PatientModel.findByIdAndUpdate(
          new mongoose.Types.ObjectId(newFeedback.patient),
          { $push: { feedbacks: newFeedback._id } },
          { new: true }
        );
        const doctorUpdated = await DoctorModel.findByIdAndUpdate(
          new mongoose.Types.ObjectId(newFeedback.doctor),
          { $push: { feedbacks: newFeedback._id } },
          { new: true }
        );
      }
      return newFeedback;
    } catch (error) {
      // console.error(error);
      return res.status(500).json({ message: "Error adding feedback" });
    }
  };

  getFeedbackById = async (id) => {
    try {
      const feedbacks = await FeedbackModel.findById(id);
      return feedbacks;
    } catch (error) {
      // console.error(error);
      return res.status(500).json({ message: "Error getting feedback" });
    }
  };

  getAvgRatingByDoctorId = async (did) => {
    try {
      const doctorId = new mongoose.Types.ObjectId(did);
      const avgRating = await FeedbackModel.aggregate([
        { $match: { doctor:doctorId} },
        {
          $group: {
            _id: "$doctor",
            avgRating: { $avg: "$rating" },
          },
        },
      ]);
      return avgRating;
    } catch (error) {
      // console.error(error);
      return res.status(500).json({ message: "Error getting feedback" });
    }
  };

  getAllDoctorsAvgRating = async () => {
    try {
      const avgRating = await FeedbackModel.aggregate([
        {
          $group: {
            _id: "$doctor",
            avgRating: { $avg: "$rating" },
          },
        },
      ]);
      return avgRating;
    } catch (error) {
      // console.error(error);
      return res.status(500).json({ message: "Error getting feedback" });
    }
  };

}
