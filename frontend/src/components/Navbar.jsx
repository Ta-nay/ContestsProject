import React from 'react'
import './Navbar.css'
import { useContext } from 'react'
import ThemeContext from '../contexts/ThemeContext'

const Navbar = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div className="navbar">
        <div className="heading">
            <img src="https://www.tle-eliminators.com/static/media/tle-eliminators.866328c32b7a996da404503789dfe6c0.svg" alt="" id="logo" />
            <h2>TLE Eliminators & Ta-nay </h2>
        </div>
        <div className="intro">
            <h2>Home</h2>
            <h2>Main</h2>
        </div>
        <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>
    </div>
  )
}

export default Navbar