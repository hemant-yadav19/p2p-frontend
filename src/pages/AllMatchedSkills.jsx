import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    getMatchedSkill,
    myConnection,
    sendConnectionRequest
} from "../config/redux/action/authAction";

import "./AllMatchedSkills.css";
import { BASE_URL } from "../config";

export default function AllMatchedSkills() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authState = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getMatchedSkill());
        dispatch(myConnection());
    }, [dispatch]);

    return (
        <div className="allMatchedContainer">

            <div className="allMatchedHeader">
                <button onClick={() => navigate(-1)}>
                    ← Back
                </button>

                <h1>All Suggested Skills</h1>
                <p>People you can exchange skills with</p>
            </div>

            <div className="allMatchedGrid">

                {authState.skillMatchedUsers?.map((match) => {

                    const connection = authState.connections?.find((conn) =>
                        conn.userId?._id === match.user._id ||
                        conn.connectionId === match.user._id
                    );

                    return (
                        <div
                            className="matchedUserCard"
                            key={match.user._id + match.skillName}
                            onClick={() =>
                                navigate(`/userProfile/${match.user._id}`)
                            }
                        >

                            <img
                                src={
                                    match.user.profilePicture
                                        ? `${BASE_URL}${match.user.profilePicture}`
                                        : "/default-profile.png"
                                }
                                alt="profile"
                            />

                            <h3>{match.user.name}</h3>

                            <p>Offering {match.skillName}</p>
                            <p>{match.level}</p>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();

                                    if (!connection) {
                                        dispatch(sendConnectionRequest({
                                            token: localStorage.getItem("token"),
                                            connectionId: match.user._id
                                        }));
                                    }
                                }}
                                disabled={!!connection}
                            >
                                {!connection
                                    ? "Send Request"
                                    : connection.status_accepted
                                        ? "Connected"
                                        : "Pending..."
                                }
                            </button>

                        </div>
                    );
                })}

            </div>

        </div>
    );
}