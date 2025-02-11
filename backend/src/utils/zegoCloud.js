// const { generateToken04 } = require('../server/zegoServerAssistant');

import generateToken04 from "./server/zegoServerAssistant.js";
import dotenv from "dotenv";
dotenv.config();
// Please modify appID to your own appId. appid is a number.
export default async function zegoCloud(req, res, next) {
  try {
    const { appointmentId } = req.body;
    const appId = Number(process.env.APP_ID);
    const serverSecret = process.env.APP_SERVERSECRET;
    const effectiveTimeInSeconds = 3600;
    const payload = "";
    const token = generateToken04(
      appId,
      appointmentId.toString(),
      serverSecret.toString(),
      effectiveTimeInSeconds,
      payload
    );
    return res.status(200).json({ token, appId });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
