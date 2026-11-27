import React from 'react'
import "./Navbar.css";

export default function Navbar() {
  return (
    <div className='container'>
        <div className='leftContainer'>

    <nav className="navbar">
      
      <ul className="navbar-links">
        <li>
          <a href="/dashboard">Dashboard</a>
        </li>
        <li>
          <a href="/explore">Explore Skills</a>
        </li>
        <li>
          <a href="/exchanges">My Exchanges</a>
        </li>
      </ul>

      <div className="navbar-profile">

        <button className="logout-btn">Logout</button>
      </div>
    </nav>
 

        </div>
        {/* <div className='rightContainer'>
            rightContainer
        </div> */}
    </div>
  )
}
