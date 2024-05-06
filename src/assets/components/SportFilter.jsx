import React from 'react';

const SportFilter = ({ sports, selectedSport, onSportChange }) => {
  return (
    <select value={selectedSport} onChange={onSportChange}>
      {sports.map((sport) => (
        <option key={sport} value={sport}>
          {sport}
        </option>
      ))}
    </select>
  );
};

export default SportFilter;