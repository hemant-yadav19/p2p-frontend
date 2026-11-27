import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate();
 const handleGetStarted = ()=>{
  navigate("/auth");
 }

  return (
    <div className='homeContainer'>
      <div className='leftSectionHome'>
        <h1>Exchange <span style={{color:"blue"}}>Skills.</span></h1>
        <h1>Build Your Future</h1>
        <p>SkillSwap is peer-to-peer platform where you can teach what you know and learn what you need.</p>
        <div onClick={handleGetStarted}>Get Started <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
</svg>
</div>

      </div>


      <div className='rightSectionHome'>
        <img src='../public/heroo.png'/>
      </div>
    </div>
  )
}
