import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import fetchWrapper from '../../../utils/fetchWrapper';
import React from 'react';

const DimensionalAnalysis = ({ selectedDimension }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchWrapper('/api/dimensional-analysis', "", 'GET', {
      dimension: selectedDimension,
    }).then((res) => {
      console.log(res)
      setData(res);
    });
  }, [selectedDimension]);

  return (
    <BarChart width={800} height={400} data={data}>
      <XAxis dataKey={selectedDimension} />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Bar dataKey="bet_handle" fill="#8884d8" />
    </BarChart>
  );
};

export default DimensionalAnalysis;