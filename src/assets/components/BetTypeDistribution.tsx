import React, { useState, useEffect } from 'react';

const BetTypeDistribution = () => {
  const [betTypeCounts, setBetTypeCounts] = useState([]);

  useEffect(() => {
    fetch('/api/bet-type-distribution')
      .then((response) => response.json())
      .then((data) => setBetTypeCounts(data))
      .catch((error) => console.error('Error fetching bet type distribution:', error));
  }, []);

  return (
    <div>
      <h2>Bet Type Distribution</h2>
      <table>
        <thead>
          <tr>
            <th>Bet Type</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {betTypeCounts.map((betType) => (
            <tr key={betType.betTypeId}>
              <td>{betType.betType}</td>
              <td>{betType.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BetTypeDistribution;