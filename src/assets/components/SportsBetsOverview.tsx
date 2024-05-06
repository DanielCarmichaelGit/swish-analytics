import React, { useState, useEffect } from 'react';

const SportsBetsOverview = () => {
  const [sportsBets, setSportsBets] = useState([]);

  useEffect(() => {
    fetch('/api/sports-bets-overview')
      .then((response) => response.json())
      .then((data) => setSportsBets(data))
      .catch((error) => console.error('Error fetching sports bets overview:', error));
  }, []);

  return (
    <div>
      <h2>Sports Bets Overview</h2>
      <table>
        <thead>
          <tr>
            <th>Sport</th>
            <th>Total Bets</th>
            <th>Total Book Risk</th>
            <th>Total Book Profit Gross</th>
          </tr>
        </thead>
        <tbody>
          {sportsBets.map((sportBet) => (
            <tr key={sportBet.sportId}>
              <td>{sportBet.sportName}</td>
              <td>{sportBet.totalBets}</td>
              <td>{sportBet.totalBookRisk}</td>
              <td>{sportBet.totalBookProfitGross}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SportsBetsOverview;