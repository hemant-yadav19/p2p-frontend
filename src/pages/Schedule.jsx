
import React, { useEffect, useMemo, useState } from "react";
import "./Schedule.css";
import { BASE_URL } from "../config";

const API = `${BASE_URL}`;

export default function Schedule() {
    const token = localStorage.getItem("token");

    const [matches, setMatches] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [currentUserId, setCurrentUserId] = useState("");
    const [participantId, setParticipantId] = useState("");
    const [skill, setSkill] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [duration, setDuration] = useState(60);
    const [description, setDescription] = useState("");
    
 
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Get matched users and existing sessions
    // const fetchPageData = async () => {
    //     try {
    //         setLoading(true);
    //         setError("");

    //         if (!token) {
    //             setError("Please login first.");
    //             return;
    //         }

    //         const [matchResponse, sessionResponse] = await Promise.all([
    //             fetch(`${API}/match/token?token=${encodeURIComponent(token)}`),
    //             fetch(`${API}/mySessions?token=${encodeURIComponent(token)}`)
    //         ]);

    //         const matchData = await matchResponse.json();
    //         const sessionData = await sessionResponse.json();

    //         if (!matchResponse.ok) {
    //             throw new Error(matchData.message || "Unable to fetch matched users");
    //         }

    //         if (!sessionResponse.ok) {
    //             throw new Error(sessionData.message || "Unable to fetch sessions");
    //         }

    //         setMatches(matchData.matches || []);
    //         setSessions(sessionData.sessions || []);

    //     } catch (err) {
    //         setError(err.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };




    const fetchPageData = async () => {
    try {
        const token = localStorage.getItem("token");

        const [matchResponse, sessionResponse, userResponse] =
            await Promise.all([
                fetch(`${API}/match/token?token=${encodeURIComponent(token)}`),
                fetch(`${API}/mySessions?token=${encodeURIComponent(token)}`),
                fetch(`${API}/getUser/token?token=${encodeURIComponent(token)}`)
            ]);

        const matchData = await matchResponse.json();
        const sessionData = await sessionResponse.json();
        const userData = await userResponse.json();

        setMatches(matchData.matches || []);
        setSessions(sessionData.sessions || []);
        setCurrentUserId(userData.user?._id || "");

    } catch (error) {
        console.error("Error fetching page data:", error);
    }  finally {
            setLoading(false);
        }
};


    useEffect(() => {
        fetchPageData();
    }, []);

    // Create a unique list of matched users
    const matchedUsers = useMemo(() => {
        const uniqueUsers = new Map();

        matches.forEach((match) => {
            if (match.user?._id) {
                uniqueUsers.set(match.user._id, match.user);
            }
        });

        return Array.from(uniqueUsers.values());
    }, [matches]);

    // Skills offered by the selected matched user
    const availableSkills = useMemo(() => {
        return [
            ...new Set(
                matches
                    .filter(
                        match =>
                            match.user?._id === participantId
                    )
                    .map(match => match.skillName)
            )
        ];
    }, [matches, participantId]);

    // When participant changes, reset selected skill
    const handleParticipantChange = (e) => {
        setParticipantId(e.target.value);
        setSkill("");
    };

    // Create session invitation
    const handleSchedule = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!participantId || !skill || !date || !startTime) {
            setError("Please fill all required fields.");
            return;
        }

        try {
            setSubmitting(true);

            const response = await fetch(`${API}/scheduleSession`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token,
                    participantId,
                    skill,
                    date,
                    startTime,
                    duration: Number(duration),
                    description
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to schedule session");
            }

            setMessage("Session invitation sent successfully!");

            setParticipantId("");
            setSkill("");
            setDate("");
            setStartTime("");
            setDuration(60);
            setDescription("");

            await fetchPageData();

        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Accept or reject invitation
    const handleRespond = async (sessionId, action) => {
        try {
            setError("");
            setMessage("");

            const response = await fetch(`${API}/respondSession`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token,
                    sessionId,
                    action
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to respond to invitation");
            }

            setMessage(data.message);
            await fetchPageData();

        } catch (err) {
            setError(err.message);
        }
    };

    // Cancel a session created by the logged-in user
    const handleCancel = async (sessionId) => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this session?"
        );

        if (!confirmCancel) return;

        try {
            setError("");
            setMessage("");

            const response = await fetch(`${API}/cancelSession`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token,
                    sessionId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to cancel session");
            }

            setMessage(data.message);
            await fetchPageData();

        } catch (err) {
            setError(err.message);
        }
    };

    const formatDate = (value) => {
        return new Date(value).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            timeZone: "UTC"
        });
    };

    const getOtherUser = (session) => {
        const hostId = session.host?._id;
        const currentUserId = session.participant?._id;

        // This helper is only used to display the other person's name.
        return session.host?.name || session.participant?.name || "User";
    };

    // const currentUserId = useMemo(() => {
    //     const currentSession = sessions[0];

    //     if (!currentSession) return null;

    //     // Identify the logged-in user from their role in a session.
    //     // This is not reliable when there are no sessions, so use the
    //     // participant/host IDs only for session card actions below.
    //     return null;
    // }, [sessions]);

    if (loading) {
        return <div className="scheduleLoading">Loading schedule...</div>;
    }

    return (
        <div className="schedulePage">

            <div className="scheduleHeader">
                <div>
                    <h1>Schedule a Session</h1>
                    <p>Plan your next skill exchange with a matched user.</p>
                </div>
            </div>

            {message && (
                <div className="scheduleMessage successMessage">
                    {message}
                </div>
            )}

            {error && (
                <div className="scheduleMessage errorMessage">
                    {error}
                </div>
            )}

            <div className="scheduleContent">

                {/* CREATE SESSION FORM */}
                <section className="scheduleFormCard">
                    <h2>Create New Session</h2>
                    <p className="scheduleSubheading">
                        Send an invitation to one of your matched users.
                    </p>

                    <form onSubmit={handleSchedule}>

                        <div className="scheduleField">
                            <label>Select matched user</label>

                            <select
                                value={participantId}
                                onChange={handleParticipantChange}
                                required
                            >
                                <option value="">Choose a user</option>

                                {matchedUsers.map(user => (
                                    <option key={user._id} value={user._id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="scheduleField">
                            <label>Select skill</label>

                            <select
                                value={skill}
                                onChange={e => setSkill(e.target.value)}
                                disabled={!participantId}
                                required
                            >
                                <option value="">Choose a skill</option>

                                {availableSkills.map(item => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="scheduleTwoColumns">

                            <div className="scheduleField">
                                <label>Session date</label>

                                <input
                                    type="date"
                                    value={date}
                                    min={new Date().toLocaleDateString("en-CA")}
                                    onChange={e => setDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="scheduleField">
                                <label>Start time</label>

                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={e => setStartTime(e.target.value)}
                                    required
                                />
                            </div>

                        </div>

                        <div className="scheduleField">
                            <label>Duration</label>

                            <select
                                value={duration}
                                onChange={e => setDuration(e.target.value)}
                            >
                                <option value={30}>30 minutes</option>
                                <option value={60}>60 minutes</option>
                                <option value={90}>90 minutes</option>
                                <option value={120}>120 minutes</option>
                            </select>
                        </div>

                        <div className="scheduleField">
                            <label>Description</label>

                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="What would you like to learn or discuss?"
                                rows={4}
                                maxLength={500}
                            />
                        </div>

                        <button
                            type="submit"
                            className="scheduleSubmitBtn"
                            disabled={submitting || matchedUsers.length === 0}
                        >
                            {submitting ? "Sending..." : "Send Session Invitation"}
                        </button>

                        {matchedUsers.length === 0 && (
                            <p className="scheduleHint">
                                No matched users found. Add wanted skills to your profile
                                to discover matches.
                            </p>
                        )}

                    </form>
                </section>


                {/* SESSION LIST */}
                <section className="sessionsListSection">
                    <h2>My Sessions</h2>
                    <p className="scheduleSubheading">
                        View your invitations and scheduled sessions.
                    </p>

                    {sessions.length === 0 ? (
                        <div className="emptySessions">
                            <h3>No sessions yet</h3>
                            <p>Your scheduled sessions will appear here.</p>
                        </div>
                    ) : (
                        <div className="sessionCards">

                            {sessions.map(session => (
                                <article className="sessionCard" key={session._id}>

                                    <div className="sessionCardTop">
                                        <div>
                                            <h3>{session.skill}</h3>
                                            <p>
                                                {formatDate(session.date)} · {session.startTime}
                                            </p>
                                        </div>

                                        <span className={`sessionStatus ${session.status}`}>
                                            {session.status}
                                        </span>
                                    </div>

                                    <div className="sessionDetails">
                                        <p>
                                            <strong>Host:</strong>{" "}
                                            {session.host?.name}
                                        </p>

                                        <p>
                                            <strong>Participant:</strong>{" "}
                                            {session.participant?.name}
                                        </p>

                                        <p>
                                            <strong>Duration:</strong>{" "}
                                            {session.duration} minutes
                                        </p>

                                        {session.description && (
                                            <p>
                                                <strong>Description:</strong>{" "}
                                                {session.description}
                                            </p>
                                        )}
                                    </div>

                                        {session.status === "pending" &&
 session.participant?._id === currentUserId && (
    <>
        <button onClick={() => respondToSession(session._id, "accept")}>
            Accept
        </button>

        <button onClick={() => respondToSession(session._id, "reject")}>
            Reject
        </button>
    </>
)}

{session.status === "pending" &&
 session.host?._id === currentUserId && (
    <button onClick={() => cancelSession(session._id)}>
        Cancel Invitation
    </button>
)}

                                    {/* The invited user can accept or reject */}
                                    {session.status === "pending" &&
                                        session.participant && (
                                            <div className="sessionActions">
                                                <button
                                                    className="acceptSessionBtn"
                                                    onClick={() =>
                                                        handleRespond(session._id, "accept")
                                                    }
                                                >
                                                    Accept
                                                </button>

                                                <button
                                                    className="rejectSessionBtn"
                                                    onClick={() =>
                                                        handleRespond(session._id, "reject")
                                                    }
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}

                                    {session.status === "pending" && (
                                        <button
                                            className="cancelSessionBtn"
                                            onClick={() => handleCancel(session._id)}
                                        >
                                            Cancel invitation
                                        </button>
                                    )}
                                    {session.status === "accepted" && (
    <button
        className="joinMeetingBtn"
        onClick={() => {
            window.location.href = `/video-call/${session.meetingId}`;
        }}
    >
        Join Meeting
    </button>
)}
                                </article>
                            ))}

                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}
