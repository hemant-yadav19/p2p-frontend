// import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { getUser } from '../config/redux/action/authAction';
// import "./ProfilePage.css";
// export default function ProfilePage() {
//   const authState = useSelector((state)=>state.auth);
//   const dispatch = useDispatch();
//   console.log(authState.user);
//   useEffect(() => {
//     dispatch(getUser({token:localStorage.getItem("token")}));
  
//   }, [])
  

//   return (
//     <div className='profilePage'>
//       <div className="mainProfilePage">
//         <div className="profilePicture">
//           <img src={`http://localhost:7000${authState.profilePicture}`} alt='prifile'/>
//         </div>
//         <p>{authState.user[0].name}</p>
//         <button>complete your profile</button>
//           <div className="completePofileInfo">
            
//           </div>
//         bio
//         location
//         availability
//         rating
//       </div>
//     </div>
//   )
// }





import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../config/redux/action/authAction";
import "./ProfilePage.css";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../config";



export default function ProfilePage() {


  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id}=useParams();  

  useEffect(() => {
    dispatch(getUser({
      token: id
    }));
    // console.log(authState.user[0]);
  }, [dispatch]);

  // Handle both array and object responses
  const user = Array.isArray(authState.user)
    ? authState.user[0]
    : authState.user;

  if (!user) {
    return (
      <div className="profileLoading">
        <h3>Loading profile...</h3>
      </div>
    );
  }

  const availability = user.availability || [];

  const completionFields = [
    user.name,
    user.email,
    user.bio,
    user.location,
    user.profilePicture,
    availability.length > 0
  ];

  const completedFields = completionFields.filter(Boolean).length;

  const completionPercentage = Math.round(
    (completedFields / completionFields.length) * 100
  );

  const days = [
    "mon", "tue", "wed", "thu", "fri", "sat", "sun"
  ];

  const dayNames = {
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday"
  };

  const getAvailability = (day) => {
    return availability.find((item) => item.day === day);
  };

  return (
    <div className="profilePage">

      {/* Header */}
      <div className="profileHeader">
        <div>
          <h1>My Profile</h1>
          <p>Manage your personal information and skill exchange details.</p>
        </div>

        <button className="editProfileBtn" onClick={()=>navigate("/editProfile")}>
          Edit Profile
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="profileMainCard">

        <div className="profileCover"></div>

        <div className="profileMainContent">

          <div className="profileAvatar">
            <img
              src={
                user.profilePicture
                  ? `${BASE_URL}${authState.user[0].profilePicture}`
                  : "https://img.magnific.com/premium-vector/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4195.jpg?semt=ais_hybrid&w=740&q=80"
              }
              alt="Profile"
            />
          </div>

          <div className="profileBasicInfo">
            <div>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>

            <span className="accountBadge">
              {user.role || "user"}
            </span>
          </div>

          <div className="profileStats">

            <div className="profileStat">
              <h3>{Number(user.ratingAvg || 0).toFixed(1)} / 5</h3>
              <p>Average Rating</p>
            </div>

            <div className="profileStat">
              <h3>{user.ratingCount || 0}</h3>
              <p>Total Reviews</p>
            </div>

            <div className="profileStat">
              <h3>{availability.length}</h3>
              <p>Available Days</p>
            </div>

          </div>

        </div>
      </div>

      {/* Profile Completion */}
      <div className="profileCompletion cardSection">

        <div className="sectionHeading">
          <div>
            <h2>Profile Completion</h2>
            <p>Complete your profile to help others know you better.</p>
          </div>

          <h2 className="completionNumber">
            {completionPercentage}%
          </h2>
        </div>

        <div className="progressBar">
          <div
            className="progressFill"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>

        <p className="completionText">
          {completedFields} out of {completionFields.length} profile details completed.
        </p>

      </div>

      {/* Personal Information */}
      <div className="profileDetailsGrid">

        <div className="cardSection personalInfo">

          <h2>Personal Information</h2>

          <div className="infoItem">
            <span>Full Name</span>
            <strong>{user.name || "Not added"}</strong>
          </div>

          <div className="infoItem">
            <span>Email Address</span>
            <strong>{user.email || "Not added"}</strong>
          </div>

          <div className="infoItem">
            <span>Location</span>
            <strong>{user.location || "Not added"}</strong>
          </div>

          <div className="infoItem">
            <span>Time Zone</span>
            <strong>{user.timezone || "Not added"}</strong>
          </div>

          <div className="infoItem">
            <span>Email Verification</span>
            <strong className={user.emailVerified ? "verified" : "notVerified"}>
              {user.emailVerified ? "Verified" : "Not Verified"}
            </strong>
          </div>

          <div className="infoItem">
            <span>Account Created</span>
            <strong>
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Not available"}
            </strong>
          </div>

        </div>

        {/* Bio */}
        <div className="cardSection bioSection">

          <h2>About Me</h2>

          <p>
            {user.bio || "You haven't added your bio yet."}
          </p>

        </div>

      </div>

      {/* Availability */}
      <div className="cardSection availabilitySection">

        <div className="sectionHeading">
          <div>
            <h2>My Availability</h2>
            <p>Days and timings when you are available for skill exchange.</p>
          </div>
        </div>

        <div className="availabilityList">

          {days.map((day) => {
            const schedule = getAvailability(day);

            return (
              <div className="availabilityItem" key={day}>

                <span className="availabilityDay">
                  {dayNames[day]}
                </span>

                {schedule ? (
                  <span className="availableTime">
                    {schedule.from} - {schedule.to}
                  </span>
                ) : (
                  <span className="unavailableTime">
                    Not Available
                  </span>
                )}

              </div>
            );
          })}

        </div>

      </div>

      {/* Preferences */}
      <div className="cardSection preferencesSection">

        <h2>Skill Exchange Preferences</h2>

        <div className="preferenceGrid">

          <div className="preferenceItem">
            <span>Learning Mode</span>
            <strong>
              {user.onlineOnly ? "Online Only" : "Flexible"}
            </strong>
          </div>

          <div className="preferenceItem">
            <span>Time Zone</span>
            <strong>{user.timezone || "Asia/Kolkata"}</strong>
          </div>

          <div className="preferenceItem">
            <span>Account Type</span>
            <strong>{user.role || "user"}</strong>
          </div>

        </div>

      </div>

    </div>
  );
}
