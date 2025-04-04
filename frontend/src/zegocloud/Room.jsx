import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Room = () => {
  const { appointmentId } = useParams();
  const user = JSON.parse(localStorage?.getItem("user")); 
  const userId = user?._id || "123456789" ;
  
  // console.log("appointmentId In ROOM:", appointmentId);
  const navigate = useNavigate();
  const roomContainerRef = useRef(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [stream, setStream] = useState(null);
  const [userCount, setUserCount] = useState(0); // track number of users in the room
  const [timer, setTimer] = useState(null); // timer state to track session time
  const sessionDuration = 30 * 60 * 1000; // session duration in milliseconds (30 minutes)

  // function to get media stream and handle permissions
  const getUserMedia = async () => {
    try {
      if (stream) {
        // console.log("Using existing stream");
        return stream;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);
      return mediaStream;
    } catch (error) {
      // console.error("Error accessing media devices:", error);
      alert("Please allow camera and microphone access");
      return null;
    }
  };

  // function to start the timer and end the session after the specified time
  const startTimer = () => {
    const timeout = setTimeout(() => {
      alert("Session time has ended");
      endSession();
    }, sessionDuration);

    setTimer(timeout); // save the timer ID to clear it later if needed
  };

  // function to end the session
  const endSession = () => {
    // console.log("Ending the session...");
    if (stream) {
      stream.getTracks().forEach((track) => track.stop()); // stop media tracks
    }
    navigate("/"); 
  };

  // initialize and join the room
  const myMeeting = async (element) => {
    const userStream = await getUserMedia();
    if (!userStream) return;

    const appID = Number(`${import.meta.env.VITE_APP_ID}`);
    const serverSecret = `${import.meta.env.VITE_APP_SERVERSECRET}`;
    // console.log("userId in Room function:", userId);
    // console.log("appointmentId in Room function:", appointmentId);
    const res = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/api/doctor/generateToken`,
      {
        appointmentId: appointmentId.toString(),
        userId: userId.toString(),
      }
    );
    // console.log("zego res:", res);
    // console.log("appoinmentId in ROom function:", appointmentId);
    const { token } = res.data;
    // console.log("token in Room function:", token);
    const tkn = token.toString();
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      appID,
      token,
      appointmentId,
      userId,
      "Name"
    );

    const zc = ZegoUIKitPrebuilt.create(kitToken);

    // join the room with the media stream
    zc.joinRoom({
      container: element,
      sharedLinks: [
        {
          url: `https://medi-cure-tau.vercel.app/room/${appointmentId}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: false,
      userStream: userStream,
      maxUsers: 2,
      onLeaveRoom: () => {
        // console.log("User left the room");
        endSession();

      },
    });

    // after joining, update user count
    setUserCount(userCount + 1);
    setHasJoined(true);
    startTimer();
  };

  // Cleanup media stream on component unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    };
  }, [stream]);

  useEffect(() => {
    if (roomContainerRef.current && !hasJoined) {
      myMeeting(roomContainerRef.current);
    }
  }, [appointmentId, hasJoined, userCount]); // only run effect when room ID changes or user hasn't joined

  return (
    <div
      ref={roomContainerRef}
      style={{ height: "100vh", paddingTop: "80px" }}
    />
  );
};

export default Room;
