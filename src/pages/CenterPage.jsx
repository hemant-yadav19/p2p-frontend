import React, { useEffect, useState } from 'react'
import "./CenterPage.css";
// import NavLayout from '../components/Layout/NavLayout';
import { useDispatch, useSelector } from 'react-redux';
import { getMatchedSkill, getSkills, getUser, myConnection, sendConnectionRequest } from '../config/redux/action/authAction';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
export default function CenterPage() {
    const navigate = useNavigate();
    const authState = useSelector((state)=>state.auth);
    // console.log(authState.skills);
    const dispatch = useDispatch();
    // console.log(authState.skillMa;       


    const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);
    const [isConnectionNull, setIsConnectionNull] = useState(true);

    useEffect(() => {
       dispatch(getSkills());
       dispatch(getUser({token:localStorage.getItem("token")}));       
        dispatch(getMatchedSkill());
        dispatch(myConnection());
    },[dispatch])

    

   
  useEffect(() => {

    if (!Array.isArray(authState.connections)) return;

    if (!authState.user || authState.user.length === 0) return;
    // console.log(authState.user);    
    const currentUserId = authState.user[0]._id;
const connection = authState.connections.find((user) => {
    return user.connectionId === currentUserId;
});

    // console.log("Matched connection:", connection);

    if (connection) {

        setIsCurrentUserInConnection(true);

        if (connection.status_accepted === true) {
            setIsConnectionNull(false);
        } else {
            setIsConnectionNull(true);
        }

    } else {

        setIsCurrentUserInConnection(false);
        setIsConnectionNull(true);

    }

}, [authState.connections, authState.user]);


    return (
        
<div className='HomePage'>
        {/* <NavLayout/> */}
         <div className='mainLeftSide'> 
            <div className='dashboardHeading'><h1>p2p</h1></div>
        <div className='leftSide'>
            
            <div className='dashboardIcons'  >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>home
            </div>
            <div className='dashboardIcons'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>Search
            </div>
            <div className='dashboardIcons'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>my skills
            </div>
            
            <div className='dashboardIcons' onClick={()=>navigate("/myConnections")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>my connections
            </div>
            <div className='dashboardIcons' onClick={()=>navigate("/schedule")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg> schedule meeting
                </div>
        </div>
        </div>
        {/*  */}


        
        <div className='rightSide'>
            <div className="navbar">
                <div className="leftNav">
                    search
                </div>
                <div className="rightNav">
                   
                    <img
  src={
    authState.user?.[0]?.profilePicture
      ? `${BASE_URL}${authState.user[0].profilePicture}`
      : "https://img.magnific.com/premium-vector/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4195.jpg?semt=ais_hybrid&w=740&q=80"
  }
  alt="profilePicture"
/>
  

                    <p>  {authState.user.length > 0      
        ? authState.user[0].name
        : "Loading..."}</p>
                     <p style={{cursor:"pointer"}} onClick={()=>navigate(`/profilePage/${localStorage.getItem("token")}`)}>profile</p> 
                     <p onClick={()=>navigate("/skills")}>add</p> 
                </div>  
                </div>
                                                                                
        <div className="firstRowBoxesMain">
        <div className='firstRowBoxes'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
</svg>
                
            <h5>Total Skills</h5>
            <h4>8</h4>
            <p>Skills you have listed</p>
        </div>
        
        <div className='firstRowBoxes'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>

            <h5>Exchange Request</h5>
            <h4>3</h4>
            <p>Active Requests</p>
        </div>
        <div className='firstRowBoxes'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>

            <h5>Successful Exchange</h5>
            <h4>2</h4>
            <p>Completed so far</p>
            </div>
        </div>





        {/* <h3 style={{marginLeft:"2rem"}}> Your skills</h3> */}
        {/* <div className='skillCardMain'>
            
            {authState.skills.map((skill)=>{
           return ( <div className='skillCard' >

           
                <p style={{fontWeight:"bold", fontSize:"25px", paddingInline:"1rem"}}> {skill.name}</p>
               <p style={{color:"grey",fontWeight:"500",paddingInline:"1rem",fontSize:"17px"}}> {skill.category}</p>
               <p style={{paddingInline:"1rem"}}>{skill.description}</p>
                <div className='spanElement'> <span>offering</span></div>
            </div>);
            })}
        </div> */}



            <div className="skillCardMain">

    {authState.skills.map((skill) => (
        <div className="skillCard" key={skill._id}>

            <div className="skillCardTop">
                <span className="skillStatus">
                    Offering
                </span>

                <div className="skillIcon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.7}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.25 6.75 21 12l-3.75 5.25M6.75 6.75 3 12l3.75 5.25M14.25 4.5l-4.5 15"
                        />
                    </svg>
                </div>
            </div>

            <h3>{skill.name}</h3>

            <p className="skillCategory">
                {skill.category}
            </p>

            <div className="skillCardBottom">
                <span>My Skill</span>
                <span className="skillArrow">↗</span>
            </div>

        </div>
    ))}

</div>


           <div className="peoplesContainer">

    <div className="suggestedHeader">
        <h1>Suggested Skills</h1>

        {authState.skillMatchedUsers.length > 3 && (
            <button onClick={() => navigate("/allMatchedSkills")}>
                See All →
            </button>
        )}
    </div>

    {authState.skillMatchedUsers.slice(0, 3).map((match) => {

        const connection = authState.connections?.find((conn) =>
            conn.userId?._id === match.user._id ||
            conn.connectionId === match.user._id
        );

        return (
            <div
                className="peoplesMain"
                key={match.user._id + match.skillName}
                onClick={() => navigate(`/profilePage/${match.user.token}`)}
                style={{ cursor: "pointer" }}
            >

                <div className="profile">
                    <img
                        src={
                            match.user.profilePicture
                                ? `${BASE_URL}${match.user.profilePicture}`
                                : "https://img.magnific.com/premium-vector/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4195.jpg?semt=ais_hybrid&w=740&q=80"
                        }
                        alt="profilePicture"
                    />
                </div>

                <div className="peoplesInfo">
                    <h5>{match.user.name}</h5>
                    <p>Offering {match.skillName}</p>
                    <p>{match.level}</p>
                </div>

                <button
                    className="requestBTN"
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



    </div>  

    // </div>

)
}
 


