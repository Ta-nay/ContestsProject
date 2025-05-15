import React from 'react';
import './Filter.css';

const platforms = ['LeetCode', 'Codeforces', 'CodeChef'];

const Filter = ({ selectedPlatforms, onChange }) => {
  const togglePlatform = (platform) => {
    if (selectedPlatforms.includes(platform)) {
      onChange(selectedPlatforms.filter((p) => p !== platform));
    } else {
      onChange([...selectedPlatforms, platform]);
    }
  };

  return (
    <div className="filter-container">
      <h3>Filter Platforms</h3>
      <div className="filter-buttons">
        {platforms.map((platform) => (
          <button
            key={platform}
            className={`filter-btn ${platform.toLowerCase()} ${
              selectedPlatforms.includes(platform) ? 'active' : ''
            }`}
            onClick={() => togglePlatform(platform)}
          >
            {platform}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filter;
