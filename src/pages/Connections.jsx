// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { acceptConnection, getUser, myConnection } from '../config/redux/action/authAction';
// import "./Connections.css";
// // import { connection } from 'mongoose';
// export default function Connections() {
//   const dispatch = useDispatch();
//   const authState = useSelector(state=>state.auth);
//   // console.log(authState.connections[0].userId.profilePicture);
//   const [isAccepted, setIsAccepted] = useState(true)
  
//   useEffect(() => {
//     dispatch(myConnection());
//     dispatch(getUser({token:localStorage.getItem("token")}));
//   },[]) 
  
  // useEffect(() => {
    // console.log(authState.connections[0].status_accepted);
    // console.log(authState.user[0]);        
  //   if(authState.connections[0].status_accepted){
  //     setIsAccepted(false);
  //   }
  // },[authState.connections])
  

//   useEffect( () => {
//      console.log(authState.connections?.[0]?.status_accepted);
    
//   if (authState.connections?.[0]?.status_accepted && authState.connections?.[0]?.connectionId ,  " ", authState.user?.[0]?._id) {   
//     setIsAccepted(false);
//     console.log("qwer",isAccepted);
    
//   }
//   console.log(isAccepted);
  
// }, [authState.connections]);

//   useEffect(() => {
//     console.log("sdfsd",isAccepted);
//   }, [isAccepted])
  


// useEffect(() => {
//     console.log("Connection status:", authState.connections?.[0]?.status_accepted);
// }, [authState.connections]);

// useEffect(() => {
//     console.log("Current isAccepted:", isAccepted);
// }, [isAccepted]);

//   return (
//     <div>
//       <div className="connections">
//         <div className="mainConnections">
//           { authState.connections.map((connection)=>
//           <div className="connectionCards">
            
//             <img src={`http://localhost:7000${connection.userId.profilePicture}`}/>
//             {connection.userId.name}

//             { connection.status_accepted !== true && <button onClick={()=>dispatch(acceptConnection({
//               token:localStorage.getItem("token"),
//               connectionId:connection._id,
//               requestId:"accept"
//             }))}>Accept</button>}
//           </div>)}
//         </div>      
//       </div>
//     </div>
//   )
// }




import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    acceptConnection,
    getUser,
    myConnection
} from '../config/redux/action/authAction';

import "./Connections.css";

export default function Connections() {

    const dispatch = useDispatch();
    const authState = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(myConnection());
        dispatch(getUser({
            token: localStorage.getItem("token")
        }));
    }, [dispatch]);

    const connections = authState.connections || [];

    // Separate pending and accepted connections
    const pendingConnections = connections.filter(
        connection => connection.status_accepted !== true
    );

    const acceptedConnections = connections.filter(
        connection => connection.status_accepted === true
    );

    const handleAccept = async (connection) => {

        await dispatch(acceptConnection({
            token: localStorage.getItem("token"),
            connectionId: connection._id,
            requestId: "accept"
        }));

        // Refresh connections after accepting
        dispatch(myConnection());
    };

    return (
        <div className="connectionsPage">

            <div className="connectionsHeader">
                <h1>My Connections</h1>
                <p>Manage your connections and build your network.</p>
            </div>


            {/* PENDING REQUESTS */}

            <section className="connectionSection">

                <div className="sectionHeading">
                    <h2>Connection Requests</h2>
                    <span>{pendingConnections.length}</span>
                </div>

                {pendingConnections.length === 0 ? (

                    <div className="connectionEmpty">
                        <div className="emptyIcon">👥</div>
                        <h3>No pending requests</h3>
                        <p>
                            You don't have any new connection requests.
                        </p>
                    </div>

                ) : (

                    <div className="connectionGrid">

                        {pendingConnections.map(connection => (

                            <div
                                className="connectionCard"
                                key={connection._id}
                            >

                                <img
                                    src={
                                        connection.userId?.profilePicture
                                            ? `http://localhost:7000${connection.userId.profilePicture}`
                                            : "/default-profile.png"
                                    }
                                    alt="profile"
                                />

                                <h3>
                                    {connection.userId?.name || "Unknown User"}
                                </h3>

                                <p className="connectionStatus pending">
                                    Wants to connect with you
                                </p>

                                <button
                                    className="acceptButton"
                                    onClick={() => handleAccept(connection)}
                                >
                                    Accept Request
                                </button>

                            </div>

                        ))}

                    </div>

                )}

            
            </section>  
            {/* MY NETWORK */}

            <section className="connectionSection">

                <div className="sectionHeading">
                    <h2>My Network</h2>
                    <span>{acceptedConnections.length}</span>
                </div>
    
                {acceptedConnections.length === 0 ? (

                    <div className="connectionEmpty">
                        <div className="emptyIcon">🌐</div>
                        <h3>Your network is empty</h3>
                        <p>
                            Accept connection requests to build your network.
                        </p>
                    </div>

                ) : (

                    <div className="connectionGrid">

                        {acceptedConnections.map(connection => (

                            <div
                                className="connectionCard"
                                key={connection._id}
                            >

                                <img
                                    src={
                                        connection.userId?.profilePicture
                                            ? `http://localhost:7002${connection.userId.profilePicture}`
                                            : "/default-profile.png"
                                    }
                                    alt="profile"
                                />

                                <h3>
                                    {connection.userId?.name || "Unknown User"}
                                </h3>

                                <p className="connectionStatus accepted">
                                    Connected with you
                                </p>

                                <button
                                    className="connectedButton"
                                    disabled
                                >
                                    ✓ Connected
                                </button>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </div>
    );
}
