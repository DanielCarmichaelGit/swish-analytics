import React from 'react';

const MarketTypeDropdown = ({ marketTypes, selectedMarketType, onMarketTypeChange }) => {
  return (
    <select value={selectedMarketType} onChange={onMarketTypeChange}>
      {marketTypes.map((marketType) => (
        <option key={marketType} value={marketType}>
          {marketType}
        </option>
      ))}
    </select>
  );
};

export default MarketTypeDropdown;