import React from 'react';

const StatTypeFilter = ({ statTypes, selectedStatType, onStatTypeChange }) => {
  return (
    <select value={selectedStatType} onChange={onStatTypeChange}>
      {statTypes.map((statType) => (
        <option key={statType} value={statType}>
          {statType}
        </option>
      ))}
    </select>
  );
};

export default StatTypeFilter;