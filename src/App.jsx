import React, { useEffect } from 'react'
import Register from './pages/Register'
import NavLayout from './components/Layout/NavLayout'
import { Route, Routes } from 'react-router-dom'
import DashBoard from './pages/DashBoard'
// import AllPages from './pages/AllPages'
import AddSkills from './pages/AddSkills'
//  import BothSkills from './pages/BothSkills'
import Home from './pages/Home'
import UserSkills from './pages/UserSkills'
import HomePage from './pages/HomePage'
import CenterPage from './pages/CenterPage'
import MatchingCandidate from './pages/MatchingCandidate'
import ProfileImage from './pages/ProfileImage'
import ProfilePage from './pages/ProfilePage'
import Connections from './pages/Connections'
import EditProfile from './pages/EditProfile'
import AllMatchedSkills from './pages/AllMatchedSkills'
import Schedule from "./pages/Schedule";
import VideoCall from './pages/VideoCall'

export default function App() {
  
    
  return (

    <div>

      
      <Routes>
        <Route path='/uploadProfile' element={<ProfileImage/>}/>
        <Route path='/auth' element={<Register/>}/>     
        <Route path='/homePage' element={<HomePage/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/profilePage/:id' element={<ProfilePage/>}/>
        {/* <Route element={<NavLayout/>}>  */}
        <Route path='/dashboard' element={<CenterPage/>}/>
        {/* </Route> */}
        <Route path='/skills' element={<AddSkills/>}/>
        <Route path="/completeSkills" element={<UserSkills/>}/>
        <Route path='/matchesFound' element={<MatchingCandidate/>}/>
        <Route path='/myConnections' element={<Connections/>}/>
        <Route path='/editProfile' element={<EditProfile/>}/>
        <Route path="/allMatchedSkills" element={<AllMatchedSkills />}/>
        <Route path="/schedule" element={<Schedule />} />
        <Route
    path="/video-call/:meetingId"
    element={<VideoCall />}
/>
      </Routes>
    </div>
  )
}
