import React from 'react'
import './Cards.css'



const Cards = ({title,platform,startTime,duration,url}) => {
  return (
    <div>
    <div className="contest-card">
      <h2 className="contest-title">{title}</h2>
      <div className="contest-detail">Platform: {platform}</div>
      <div className="contest-detail">Start Time: {startTime}</div>
      {duration && <div className="contest-detail">Duration: {duration} minutes</div>}
      <a href={url} target="_blank" rel="noopener noreferrer" className="contest-link">
        Join Contest
      </a>
    </div>
    </div>
  )
}

export default Cards