import PaymentModel from "./payment.model.js";
import razorpayInstace from "../../utils/rezorpay.js";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import dotenv from "dotenv";
dotenv.config();

export default class PaymentRepository {
  createOrder = async (req, res, next) => {
    try {
      const order = await razorpayInstace.orders.create({
        amount: req.body.amount * 100,
        currency: "INR",
        receipt: "reciept#1",
        // payment_capture: 1,
        notes: {
          appointmenttype: "Online",
        },
      });
      console.log(order);
      // console.log(req);
      console.log(req.userID);
      // console.log("user.userID",req.user.userID);
      const payment = new PaymentModel({
        patient: req.userID,
        doctor: req.body.doctor,
        // appointment: req.body.appointment,
        orderId: order.id,
        status: order.status,
        amount: order.amount / 100,
        currency: order.currency,
        receipt: order.receipt,
        notes: order.notes,
      });
      const savedPayment = await payment.save();
      return savedPayment.toJSON();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  validateWebhook = async (req, res, next) => {
    try {
      const webhookSignature = req.get("x-razorpay-signature");
      const isvalidWebhook = validateWebhookSignature(
        JSON.stringify(req.body),
        webhookSignature,
        process.env.RAZORPAY_WEBHOOK_SECRET
      );
      if (!isvalidWebhook) {
        return res.status(400).json({ message: "Invalid Webhook Signature" });
      }
      const paymentDetails = req.body.payload.payment.entity;
      PaymentModel.status = paymentDetails.status;
      const savedpayment = await PaymentModel.save();
      // if(req.body.event === "payment.failed"){}
      // if(req.body.event === "payment.captured"){
      // }
      return savedpayment;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  verifyPayment = async (req, res, next) => {
    // const payment = await PaymentModel.findOne({_id: req.params.lsid});
    const { orderId } = req.body;

    const payment = await PaymentModel.findOne({ orderId: orderId });
    if(payment.status){
        return true;
    } 
    return false;
  };
}
