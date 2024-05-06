import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const TimeSeriesChart = ({ selectedMarketType, startDate, endDate }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/time-series', {
          params: {
            marketType: selectedMarketType,
            startDate,
            endDate,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching time-series data:', error);
      }
    };

    fetchData();
  }, [selectedMarketType, startDate, endDate]);

  return (
    <LineChart width={800} height={400} data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="bet_handle" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  );
};

export default TimeSeriesChart;