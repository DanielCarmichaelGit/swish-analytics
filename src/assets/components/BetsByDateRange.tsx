import React, { useState } from 'react';

const BetsByDateTimeRange = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [bets, setBets] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/bets-by-datetime-range?startDate=${startDate}&endDate=${endDate}&startTime=${startTime}&endTime=${endTime}`)
      .then((response) => response.json())
      .then((data) => setBets(data))
      .catch((error) => console.error('Error fetching bets by datetime range:', error));
  };

  return (
    <div>
      <h2>Bets by Date and Time Range</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Start Date:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          Start Time:
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </label>
        <label>
          End Date:
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <label>
          End Time:
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </label>
        <button type="submit">Search</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Bet ID</th>
            <th>Sport</th>
            <th>Event</th>
            <th>Selection</th>
            <th>Bet Price</th>
            <th>Accepted DateTime</th>
          </tr>
        </thead>
        <tbody>
          {bets.map((bet) => (
            <tr key={bet.betId}>
              <td>{bet.betId}</td>
              <td>{bet.sportName}</td>
              <td>{bet.eventId}</td>
              <td>{bet.selection}</td>
              <td>{bet.betPrice}</td>
              <td>{bet.acceptedDatetime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BetsByDateTimeRange;