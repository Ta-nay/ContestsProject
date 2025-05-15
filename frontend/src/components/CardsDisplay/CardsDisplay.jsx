import React from 'react';
import './CardsDisplay.css';
import Cards from '../Cards/Cards';

const CardsDisplay = ({ contests }) => {
  if (!contests || contests.length === 0) {
    return <div className="no-contests">No contests available</div>;
  }

  return (
    <div className="cards-container">
      <h1 className="title"></h1>
      <div className="cards-grid">
        {contests.map((contest, index) => (
          <Cards
            key={index}
            title={contest.title}
            platform={contest.platform}
            startTime={contest.startTime}
            duration={contest.duration}
            url={contest.url}
          />
        ))}
      </div>
    </div>
  );
};

export default CardsDisplay;
