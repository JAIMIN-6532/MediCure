// const { generateToken04 } = require('../server/zegoServerAssistant');

import generateToken04 from "./server/zegoServerAssistant.js";
import dotenv from "dotenv";
dotenv.config();
// Please modify appID to your own appId. appid is a number.
export default async function zegoCloud(req, res, next) {
  try {
    const { appointmentId,userId } = req.body;
    // let aid;
    // if(appointmentId){
    //     aid = appointmentId.toString();
    // }
    // else{
    //     aid = appointmentId.toString();
    // }
    const appId = Number(process.env.APP_ID);
    const serverSecret = String(process.env.APP_SERVERSECRET);
    const effectiveTimeInSeconds = 3600;
    const payloadObject = {
      room_id: appointmentId, // Please modify to the user's roomID
      // The token generated in this example allows loginRoom.
      // The token generated in this example does not allow publishStream.
      privilege: {
          1: 1,   // loginRoom: 1 pass , 0 not pass
          2: 1    // publishStream: 1 pass , 0 not pass
      },
      stream_id_list: null
  }; 
  const payload = JSON.stringify(payloadObject);
    const token = generateToken04(
      appId,
      userId,
      serverSecret,
      effectiveTimeInSeconds,
      payload
    );
    return res.status(200).json({ token, appId });
  } catch (error) {
    // console.error("Error generating token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
