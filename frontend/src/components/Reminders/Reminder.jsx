import React, { useState, useEffect } from 'react';
import './Reminder.css';

const Reminder = () => {
  const [email, setEmail] = useState('');
  const [selectedContest, setSelectedContest] = useState('');
  const [contests, setContests] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await fetch('http://localhost:3069/contests');
        const data = await res.json();
        // Filter only upcoming contests
        const upcoming = data.filter(contest => {
          const startTime = new Date(contest.startTime);
          return startTime > new Date();
        });
        setContests(upcoming);
      } catch (err) {
        console.error('Failed to load contests:', err);
      }
    };

    fetchContests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    const contest = contests.find(c => c.title === selectedContest);
    const message = `Reminder: ${contest.title} on ${contest.startTime} (${contest.platform}). Join here: ${contest.url}`;

    try {
      const res = await fetch('http://localhost:3069/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'email',
          to: email,
          message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus('Reminder sent successfully!');
        setEmail('');
        setSelectedContest('');
      } else {
        setStatus(`Error: ${data.msg}`);
      }
    } catch (err) {
      setStatus('Error sending reminder.');
    }
  };

  return (
    <div className="reminder-container">
      <h2>Set Contest Reminder</h2>
      <form onSubmit={handleSubmit} className="reminder-form">
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          value={selectedContest}
          onChange={(e) => setSelectedContest(e.target.value)}
          required
        >
          <option value="" disabled>Select a Contest</option>
          {contests.map((contest, idx) => (
            <option key={idx} value={contest.title}>
              {contest.title} ({contest.platform})
            </option>
          ))}
        </select>

        <button type="submit" disabled={!selectedContest || !email}>
          Set Reminder
        </button>
      </form>
      {status && <p className="status">{status}</p>}
    </div>
  );
};

export default Reminder;
