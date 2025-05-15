import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import { useState, useEffect } from 'react';
import CardsDisplay from './components/CardsDisplay/CardsDisplay';
import Reminder from './components/Reminders/Reminder';
import Filter from './components/Filters/Filter';

function App() {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['LeetCode', 'Codeforces', 'CodeChef']);

  useEffect(() => {
    const fetchContests = async () => {
      const res = await fetch('/contests');
      const data = await res.json();
      setContests(data);
    };

    fetchContests();
  }, []);

  useEffect(() => {
    const filtered = contests.filter(contest =>
      selectedPlatforms.includes(contest.platform)
    );
    setFilteredContests(filtered);
  }, [contests, selectedPlatforms]);

  return (
    <BrowserRouter>
      <Navbar />
      <div className="main-layout">
        <Filter selectedPlatforms={selectedPlatforms} onChange={setSelectedPlatforms} />
        <CardsDisplay contests={filteredContests} />
      </div>
    </BrowserRouter>
  );
}

export default App;