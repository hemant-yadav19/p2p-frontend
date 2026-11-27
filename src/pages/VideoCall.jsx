
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../config/socket";
import "./VideoCall.css";

export default function VideoCall() {

    const { meetingId } = useParams();
    const navigate = useNavigate();

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const localStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const remoteStreamRef = useRef(null);

    const pendingCandidatesRef = useRef([]);

    const [callStatus, setCallStatus] = useState("Preparing your camera...");
    const [error, setError] = useState("");

    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);

    const [remoteStream, setRemoteStream] = useState(null);

    const [isScreenSharing, setIsScreenSharing] = useState(false);
const [isFullscreen, setIsFullscreen] = useState(false);

const videoCallPageRef = useRef(null);
const screenStreamRef = useRef(null);

    useEffect(() => {

        let mounted = true;
        let meetingStarted = false;

        const configuration = {
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302"
                }
            ]
        };


        // Create WebRTC connection
        const createPeerConnection = () => {

            if (peerConnectionRef.current) {
                return peerConnectionRef.current;
            }

            const pc = new RTCPeerConnection(configuration);

            peerConnectionRef.current = pc;

            // Add local camera and microphone tracks
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => {
                    pc.addTrack(track, localStreamRef.current);
                });
            }

            // Send ICE candidates to the other participant
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit("webrtc:ice-candidate", {
                        meetingId,
                        candidate: event.candidate
                    });
                }
            };

            // Receive the other participant's video/audio
            pc.ontrack = (event) => {

                const stream = event.streams[0];

                if (stream) {
                    remoteStreamRef.current = stream;
                    setRemoteStream(stream);
                }
            };

            pc.onconnectionstatechange = () => {

                if (pc.connectionState === "connected") {
                    setCallStatus("Connected");
                }

                if (
                    pc.connectionState === "failed" ||
                    pc.connectionState === "disconnected"
                ) {
                    setCallStatus("Connection interrupted");
                }
            };

            return pc;
        };


        // Add ICE candidates received before remote description
        const addPendingCandidates = async (pc) => {

            const candidates = pendingCandidatesRef.current;

            pendingCandidatesRef.current = [];

            for (const candidate of candidates) {
                try {
                    await pc.addIceCandidate(candidate);
                } catch (error) {
                    console.log("ICE candidate error:", error);
                }
            }
        };


        // Create and send WebRTC offer
        const createOffer = async () => {

            try {
                const pc = createPeerConnection();

                const offer = await pc.createOffer();

                await pc.setLocalDescription(offer);

                socket.emit("webrtc:offer", {
                    meetingId,
                    offer: pc.localDescription
                });

                setCallStatus("Calling participant...");

            } catch (error) {
                console.log("Offer error:", error);
                setError("Could not start the video connection.");
            }
        };


        // Receive offer and send answer
        const handleOffer = async ({ offer }) => {

            try {
                const pc = createPeerConnection();

                await pc.setRemoteDescription(offer);

                await addPendingCandidates(pc);

                const answer = await pc.createAnswer();

                await pc.setLocalDescription(answer);

                socket.emit("webrtc:answer", {
                    meetingId,
                    answer: pc.localDescription
                });

                setCallStatus("Connecting...");

            } catch (error) {
                console.log("Offer handling error:", error);
                setError("Could not accept the video connection.");
            }
        };


        // Receive answer
        const handleAnswer = async ({ answer }) => {

            try {
                const pc = peerConnectionRef.current;

                if (!pc) return;

                await pc.setRemoteDescription(answer);

                await addPendingCandidates(pc);

                setCallStatus("Connecting...");

            } catch (error) {
                console.log("Answer error:", error);
            }
        };


        // Receive ICE candidate
        const handleIceCandidate = async ({ candidate }) => {

            try {
                const pc = peerConnectionRef.current;

                if (!pc || !pc.remoteDescription) {
                    pendingCandidatesRef.current.push(candidate);
                    return;
                }

                await pc.addIceCandidate(candidate);

            } catch (error) {
                console.log("ICE candidate error:", error);
            }
        };


        // Other participant joined
        const handlePeerJoined = ({ userName }) => {
            setCallStatus(`${userName} joined. Connecting...`);
        };


        // Other participant left
        const handlePeerLeft = () => {

            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }

            remoteStreamRef.current = null;
            setRemoteStream(null);

            pendingCandidatesRef.current = [];

            setCallStatus("The other participant left the meeting.");
        };


        // Join meeting after socket connects
        const handleConnect = () => {

            if (meetingStarted) return;

            meetingStarted = true;

            socket.emit("meeting:join", { meetingId }, async (response) => {

                if (!mounted) return;

                if (!response?.success) {
                    setError(response?.message || "Unable to join meeting.");
                    return;
                }

                setCallStatus("Joined meeting. Waiting for participant...");

                // If another user is already in the room,
                // this user creates the offer.
                if (response.peers && response.peers.length > 0) {
                    await createOffer();
                }
            });
        };


        const startCall = async () => {

            try {

                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Please log in before joining a meeting.");
                    return;
                }

                if (!navigator.mediaDevices?.getUserMedia) {
                    setError("Camera and microphone access is not available.");
                    return;
                }

                // Ask permission for camera and microphone
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                if (!mounted) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                localStreamRef.current = stream;

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Reuse the existing authenticated socket
                socket.auth = { token };

                // Register listeners before connecting
                socket.on("webrtc:offer", handleOffer);
                socket.on("webrtc:answer", handleAnswer);
                socket.on("webrtc:ice-candidate", handleIceCandidate);
                socket.on("meeting:peer-joined", handlePeerJoined);
                socket.on("meeting:peer-left", handlePeerLeft);

                socket.on("connect", handleConnect);

                socket.on("connect_error", (error) => {
                    if (mounted) {
                        setError(error.message || "Socket connection failed.");
                    }
                });

                if (socket.connected) {
                    handleConnect();
                } else {
                    socket.connect();
                }

            } catch (error) {

                console.log("Camera/microphone error:", error);

                if (mounted) {
                    setError(
                        "Unable to access camera or microphone. Please check your browser permissions."
                    );
                }
            }
        };


        startCall();


        // Cleanup when leaving the video-call page
        return () => {

            mounted = false;

            socket.off("connect", handleConnect);
            socket.off("webrtc:offer", handleOffer);
            socket.off("webrtc:answer", handleAnswer);
            socket.off("webrtc:ice-candidate", handleIceCandidate);
            socket.off("meeting:peer-joined", handlePeerJoined);
            socket.off("meeting:peer-left", handlePeerLeft);

            if (socket.connected) {
                socket.emit("meeting:leave", { meetingId });
            }

            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }

            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
                localStreamRef.current = null;
            }

            if (screenStreamRef.current) {
    screenStreamRef.current.getTracks().forEach(track => track.stop());
    screenStreamRef.current = null;
}
        };

    }, [meetingId]);


    // Display remote video when stream arrives
    useEffect(() => {

        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }

    }, [remoteStream]);

    useEffect(() => {
    const handleFullscreenChange = () => {
        setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
        document.removeEventListener(
            "fullscreenchange",
            handleFullscreenChange
        );
    };
}, []);

    // Microphone toggle
    const toggleMic = () => {

        if (!localStreamRef.current) return;

        const newState = !micOn;

        localStreamRef.current.getAudioTracks().forEach(track => {
            track.enabled = newState;
        });

        setMicOn(newState);
    };


    // Camera toggle
    const toggleCamera = () => {

        if (!localStreamRef.current) return;

        const newState = !cameraOn;

        localStreamRef.current.getVideoTracks().forEach(track => {
            track.enabled = newState;
        });

        setCameraOn(newState);
    };


    // Leave meeting
    // const leaveMeeting = () => {

    //     socket.emit("meeting:leave", { meetingId });

    //     if (peerConnectionRef.current) {
    //         peerConnectionRef.current.close();
    //         peerConnectionRef.current = null;
    //     }

    //     if (localStreamRef.current) {
    //         localStreamRef.current.getTracks().forEach(track => track.stop());
    //         localStreamRef.current = null;
    //     }

    //     navigate("/schedule");
    // };


    const leaveMeeting = () => {

    socket.emit("meeting:leave", { meetingId });

    if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
    }

    if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
    }

    if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
    }

    navigate("/schedule");
};


    // Start screen sharing
const startScreenSharing = async () => {
    try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false
        });

        const screenTrack = screenStream.getVideoTracks()[0];

        const pc = peerConnectionRef.current;

        if (!pc) {
            screenStream.getTracks().forEach(track => track.stop());
            alert("Please connect to the participant first.");
            return;
        }

        const videoSender = pc.getSenders().find(
            sender => sender.track?.kind === "video"
        );

        if (!videoSender) {
            screenStream.getTracks().forEach(track => track.stop());
            alert("Video connection is not ready yet.");
            return;
        }

        // Replace camera video with screen video
        await videoSender.replaceTrack(screenTrack);

        screenStreamRef.current = screenStream;

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream;
        }

        setIsScreenSharing(true);

        // Stop sharing when the browser's Stop sharing button is clicked
        screenTrack.onended = () => {
            stopScreenSharing();
        };

    } catch (error) {
        console.log("Screen sharing error:", error);
    }
};


// Stop screen sharing and restore camera
const stopScreenSharing = async () => {
    try {
        const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
        const pc = peerConnectionRef.current;

        const videoSender = pc?.getSenders().find(
            sender => sender.track?.kind === "video"
        );

        if (videoSender && cameraTrack) {
            await videoSender.replaceTrack(cameraTrack);
        }

        screenStreamRef.current?.getTracks().forEach(track => {
            track.stop();
        });

        screenStreamRef.current = null;

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
        }

        setIsScreenSharing(false);

    } catch (error) {
        console.log("Error stopping screen share:", error);
    }
};


const toggleFullscreen = async () => {
    try {
        if (!document.fullscreenElement) {
            await videoCallPageRef.current?.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    } catch (error) {
        console.log("Fullscreen error:", error);
    }
};

    return (

       <div className="videoCallPage" ref={videoCallPageRef}>

            <div className="videoCallHeader">
                <h2>Skill Exchange Meeting</h2>
                <p>Meeting ID: {meetingId}</p>
            </div>


            <div className="videoCallStatus">
                {callStatus}
            </div>


            {error && (
                <div className="videoCallError">
                    {error}
                </div>
            )}


            <div className="videoGrid">

                <div className="videoBox">

                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                    />

                    <span>You</span>

                </div>


                <div className="videoBox">

                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                    />

                    {!remoteStream && (
                        <div className="waitingMessage">
                            Waiting for the other participant...
                        </div>
                    )}

                    <span>Participant</span>

                </div>

            </div>


           <div className="videoControls">

    <button
        className={!micOn ? "controlActive" : ""}
        onClick={toggleMic}
    >
        {micOn ? "🎤 Mute" : "🔇 Unmute"}
    </button>

    <button
        className={!cameraOn ? "controlActive" : ""}
        onClick={toggleCamera}
    >
        {cameraOn ? "📷 Camera Off" : "Camera On"}
    </button>

    <button
        className={isScreenSharing ? "controlActive" : ""}
        onClick={isScreenSharing ? stopScreenSharing : startScreenSharing}
    >
        {isScreenSharing ? "Stop Sharing" : "Share Screen"}
    </button>

    <button onClick={toggleFullscreen}>
        {isFullscreen ? "Exit Fullscreen" : "Full Screen"}
    </button>

    <button
        className="leaveCallBtn"
        onClick={leaveMeeting}
    >
        Leave Meeting
    </button>

</div>

        </div>

    );

}
