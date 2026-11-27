
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUser, updateDetails, uploadProfilePicture } from "../config/redux/action/authAction";
import "./EditProfile.css";
import { BASE_URL } from "../config";

const API = `${BASE_URL}`;

const days = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" }
];

const initialAvailability = days.map((day) => ({
  day: day.key,
  from: "18:00",
  to: "21:00",
  enabled: false
}));

export default function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authState = useSelector((state) => state.auth);

  const user = Array.isArray(authState.user)
    ? authState.user[0]
    : authState.user;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    onlineOnly: true,
    timezone: "Asia/Kolkata",
    availability: initialAvailability
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Get user details
  useEffect(() => {
    if (!user) {
      dispatch(getUser({
        token: localStorage.getItem("token")
      }));
    }
  }, [dispatch, user]);

  // Fill form when user data arrives
  useEffect(() => {
    if (!user) return;

    setFormData({
      name: user.name || "",
      email: user.email || "",
      bio: user.bio || "",
      location: user.location || "",
      onlineOnly: user.onlineOnly ?? true,
      timezone: user.timezone || "Asia/Kolkata",
      availability: days.map((day) => {
        const existing = user.availability?.find(
          (item) => item.day === day.key
        );

        return {
          day: day.key,
          from: existing?.from || "18:00",
          to: existing?.to || "21:00",
          enabled: !!existing
        };
      })
    });

    setPreview(
      user.profilePicture
        ? `${API}${user.profilePicture}`
        : ""
    );

    

  }, [user]);

  
  // Handle normal inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Handle profile image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;
    // dispatch(uploadProfilePicture());  
    // if (!file.type.startsWith("image/")) {
    //   setMessage("Please select a valid image.");
    //   return;
    // }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be smaller than 5 MB.");
      return;
    }
    dispatch(uploadProfilePicture({file:file}))
    // setProfilePicture();
    setPreview(URL.createObjectURL(file));
    setMessage("");
  };

  // Handle availability checkbox
  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map((item) =>
        item.day === day
          ? { ...item, enabled: !item.enabled }
          : item
      )
    }));
  };

  // Handle availability timings
  const handleTimeChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map((item) =>
        item.day === day
          ? { ...item, [field]: value }
          : item
      )
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setMessage("Name and email are required.");
      return;
    }
    
    const activeAvailability = formData.availability
      .filter((item) => item.enabled)
      .map(({ day, from, to }) => ({ day, from, to }));

    for (const item of activeAvailability) {
      if (item.from >= item.to) {
        setMessage("End time must be later than start time.");
        return;
      }
    }
    
    const data = new FormData();

    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("bio", formData.bio);
    data.append("location", formData.location);
    data.append("onlineOnly", String(formData.onlineOnly));
    data.append("timezone", formData.timezone);
    data.append("availability", JSON.stringify(activeAvailability));

    if (profilePicture) {
      data.append("profilePicture", profilePicture);
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      

      

    //   if (!response.ok) {
    //     throw new Error(result.message || "Profile update failed.");
    //   }

      await dispatch(getUser({token:localStorage.getItem("token")}));

      setProfilePicture(null);
      setMessage("Profile updated successfully!");

      setTimeout(() => {
        navigate(`/profilePage/${localStorage.getItem("token")}`);
      }, 1000);

    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="editLoading">Loading your profile...</div>;
  }

  return (
    <div className="editProfilePage">

      <div className="editProfileHeader">
        <div>
          <h1>Edit Your Profile</h1>
          <p>Update your information and skill exchange availability.</p>
        </div>

        <button
          type="button"
          className="backBtn"
          onClick={() => navigate(`/profilePage/${localStorage.getItem("token")}`)}
        >
          Back to Profile
        </button>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Profile Picture */}
        <div className="editCard">

          <h2>Profile Picture</h2>
          <p className="editDescription">
            Upload a picture so other learners can recognize you.
          </p>

          <div className="imageUploadArea">

            <div className="imagePreview">
              {preview ? (
                <img src={preview} alt="Profile preview" />
              ) : (
                <span>{formData.name.charAt(0).toUpperCase() || "U"}</span>
              )}
            </div>

            <div className="uploadContent">
              <label htmlFor="profilePicture" className="uploadBtn">
                Choose Image
              </label>

              <input
                type="file"
                id="profilePicture"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />

              <p>PNG, JPG or JPEG. Maximum size 5 MB.</p>
            </div>

          </div>
        </div>

        {/* Basic Information */}
        <div className="editCard">

          <h2>Basic Information</h2>

          <div className="editFormGrid">

            <div className="editInputGroup">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                maxLength={80}
              />
            </div>

            <div className="editInputGroup">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="editInputGroup">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
              />
            </div>

            <div className="editInputGroup">
              <label>Time Zone</label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
              >
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Asia/Dubai">Asia/Dubai</option>
                <option value="Asia/Singapore">Asia/Singapore</option>
                <option value="Australia/Sydney">Australia/Sydney</option>
              </select>
            </div>

          </div>

          <div className="editInputGroup bioInput">
            <label>About Me / Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell other learners about yourself, your interests and skills..."
              maxLength={500}
              rows={5}
            />

            <small>{formData.bio.length}/500 characters</small>
          </div>

        </div>

        {/* Learning Preferences */}
        <div className="editCard">

          <h2>Learning Preferences</h2>

          <p className="editDescription">
            Choose how you prefer to exchange skills.
          </p>

          <label className="onlinePreference">

            <div>
              <strong>Online Only</strong>
              <p>Prefer online skill exchange sessions.</p>
            </div>

            <input
              type="checkbox"
              name="onlineOnly"
              checked={formData.onlineOnly}
              onChange={handleChange}
            />

          </label>

          <p className="editDescription preferenceHint">
            Unchecked means you are open to both online and in-person sessions.
          </p>

        </div>

        {/* Availability */}
        <div className="editCard">

          <h2>Weekly Availability</h2>

          <p className="editDescription">
            Select the days and timings when you are available.
          </p>

          <div className="availabilityForm">

            {formData.availability.map((item) => {

              const dayLabel = days.find(
                (day) => day.key === item.day
              )?.label;

              return (
                <div
                  className={`availabilityFormRow ${
                    item.enabled ? "activeDay" : ""
                  }`}
                  key={item.day}
                >

                  <label className="dayCheckbox">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => handleDayToggle(item.day)}
                    />

                    <span>{dayLabel}</span>
                  </label>

                  {item.enabled ? (

                    <div className="timeInputs">

                      <div>
                        <label>From</label>
                        <input
                          type="time"
                          value={item.from}
                          onChange={(e) =>
                            handleTimeChange(
                              item.day,
                              "from",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>

                      <div>
                        <label>To</label>
                        <input
                          type="time"
                          value={item.to}
                          onChange={(e) =>
                            handleTimeChange(
                              item.day,
                              "to",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>

                    </div>

                  ) : (
                    <span className="dayUnavailable">
                      Not Available
                    </span>
                  )}

                </div>
              );
            })}

          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="editMessage">
            {message}
          </div>
        )}

        {/* Buttons */}
        <div className="editFormActions">

          <button
            type="button"
            className="cancelEditBtn"
            onClick={() => navigate("/profilePage")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="saveProfileBtn"
            disabled={loading}
            onClick={()=>dispatch(updateDetails(formData))}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
}
