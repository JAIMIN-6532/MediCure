import FeedbackRepository from "./feedback.repository.js";

export default class FeedbackController {   

    constructor(){
        this.feedbackRepository = new FeedbackRepository();
    }

     addFeedback = async(req, res,next)=> {
        try {
            const newfeedback = await this.feedbackRepository.addFeedback(req.body);
            return res.status(201).json({ message: "Feedback added successfully", newfeedback });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error adding feedback" });
        }
    }

    getFeedbackById = async(req, res,next)=> {
        try {
            const feedbacks = await this.feedbackRepository.getFeedbackById(req.params.id);
            if(feedbacks === null){
                return res.status(404).json({ message: "Feedback not found" });
            }
            return res.status(200).json({ feedbacks });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error getting feedback" });
        }
    }

}