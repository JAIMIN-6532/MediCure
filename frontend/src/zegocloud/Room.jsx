import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Room = () => {
  //   const { id } = useParams();
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const roomContainerRef = useRef(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [stream, setStream] = useState(null);
  const [userCount, setUserCount] = useState(0); // Track number of users in the room
  const [timer, setTimer] = useState(null); // Timer state to track session time
  const sessionDuration = 30 * 60 * 1000; // Session duration in milliseconds (e.g., 30 minutes)

  // Function to get media stream and handle permissions
  const getUserMedia = async () => {
    try {
      if (stream) {
        console.log("Using existing stream");
        return stream;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);
      return mediaStream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Please allow camera and microphone access");
      return null;
    }
  };

  // Function to start the timer and end the session after the specified time
  const startTimer = () => {
    const timeout = setTimeout(() => {
      alert("Session time has ended");
      endSession();
    }, sessionDuration);

    setTimer(timeout); // Save the timer ID to clear it later if needed
  };

  // Function to end the session
  const endSession = () => {
    console.log("Ending the session...");
    // You can add ZEGOCLOUD's end room functionality here (e.g., leave the room, stop video/audio)
    // For example, ZegoUIKitPrebuilt.leaveRoom() to leave the room
    // Assuming you have a ZEGOCLOUD API to end the session or leave the room
    if (stream) {
      stream.getTracks().forEach((track) => track.stop()); // Stop media tracks
    }
    navigate("/"); // Navigate back to appointments or wherever
  };

  // Initialize and join the room
  const myMeeting = async (element) => {
    const userStream = await getUserMedia();
    if (!userStream) return;

    const appID = Number(`${import.meta.env.VITE_APP_ID}`);
    const serverSecret = `${import.meta.env.VITE_APP_SERVERSECRET}`;

    const res = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/doctor/generateToken`,{
      appointmentId,
    })
    console.log("zego res:",res);
    const {token} = await res.json();
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(appID,token,appointmentId.toString(),Date.now().toString(),"name");

    // const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
    //   appID,
    //   serverSecret.toString(),
    //   appointmentId.toString(),
    //   Date.now().toString(),
    //   "test"
    // );

    const zc = ZegoUIKitPrebuilt.create(kitToken);

    // Join the room with the media stream
    zc.joinRoom({
      container: element,
      sharedLinks: [
        {
          url: `https://medicure-frontend-qii7.onrender.com/room/${appointmentId}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: false,
      userStream: userStream,
      maxUsers: 2,
      onLeaveRoom: () => {
        console.log("User left the room");
        // setUserCount(userCount - 1);
        endSession();
        // navigate("/");
      },
    });

    // After joining, update user count
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

  // Join room once the component has mounted
  useEffect(() => {
    if (roomContainerRef.current && !hasJoined) {
      myMeeting(roomContainerRef.current);
    }
  }, [appointmentId, hasJoined, userCount]); // Only run effect when room ID changes or user hasn't joined

  return (
    <div
      ref={roomContainerRef}
      style={{ height: "100vh", paddingTop: "80px" }}
    />
  );
};

export default Room;
