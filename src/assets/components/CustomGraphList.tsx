import React, { useState, useEffect } from "react";
import styles from "../css/Components/CustomGraphList.module.css";
import RenderChart from "../../../utils/renderChart";
import { ResponsiveContainer } from "recharts";
import { Typography } from "@mui/material";

export default function CustomGraphList({ customGraphs }) {
  const customCharts = JSON.parse(localStorage.getItem("customCharts"));

  useEffect(() => {
    console.log(customCharts);
  }, [customCharts]);
  return (
    <div className={styles.CustomGraphList}>
      {customCharts
        ? customCharts.map((chart, index) => {
            return (
              <ResponsiveContainer
                className={styles.ResponsiveContainer}
                minWidth={"75vw"}
                width="100%"
                height={400}
              >
                <RenderChart
                  key={`chart_${index}`}
                  yColumn={chart.yColumn}
                  xColumns={chart.xColumns}
                  startDate={chart.startDate}
                  endDate={chart.endDate}
                  chartType={chart.chartType}
                  curveType={chart.curveType}
                  strokeColor={chart.strokeColor}
                  strokeWidth={chart.strokeWidth}
                />
              </ResponsiveContainer>
            );
          })
        : null}
    </div>
  );
}
