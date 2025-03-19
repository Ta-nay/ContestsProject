import React from 'react'
import './Navbar.css'
const Navbar = () => {
  return (
    <div className="navbar">
        <div className="heading">
            <img src="https://www.tle-eliminators.com/static/media/tle-eliminators.866328c32b7a996da404503789dfe6c0.svg" alt="" id="logo" />
            <h2>TLE Eliminators </h2>
        </div>
        <div className="intro">
            <h2>Home</h2>
            <h2>Main</h2>
        </div>
        <div className="auth">
            <h2>login/signup</h2>
        </div>
    </div>
  )
}

export default Navbar