import { useState, useEffect } from "react";
import { Typography, Pagination } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import fetchWrapper from "./fetchWrapper";
import styles from "../src/assets/css/Components/CustomGraphList.module.css";
import moment from "moment";

const chartTypes = ["line", "area", "bar"];
const curveTypes = ["linear", "monotone", "step"];

const RenderChart = ({
  yColumn,
  xColumns,
  startDate,
  startTime,
  endDate,
  endTime,
  chartType = "line",
  curveType = "linear",
  strokeWidth = 2,
  strokeColor = "#8884d8",
}) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (page) => {
    const payload = {
      yColumn,
      xColumns: xColumns,
      startDate,
      startTime,
      endDate,
      endTime,
      page,
    };
    try {
      const response = await fetchWrapper(
        "/api/custom-graph-paginated",
        localStorage.getItem("DC-TOKEN"),
        "GET",
        payload
      );
      setData(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const formatXAxis = (tickItem) => {
    if (xColumns.includes("date")) {
      return moment(tickItem).format("MMM D, YYYY");
    } else if (xColumns.includes("datetime_utc")) {
      return moment(tickItem).format("MMM D, YYYY HH:mm");
    } else {
      return tickItem;
    }
  };

  const formatYAxis = (tickItem) => {
    if (
      yColumn.includes("price") ||
      yColumn.includes("prob") ||
      yColumn.includes("line") ||
      yColumn.includes("score")
    ) {
      return tickItem.toFixed(2);
    } else {
      return tickItem;
    }
  };

  const renderChart = () => {
    const minY = Math.min(...data.map((item) => item[yColumn]));
    const maxY = Math.max(...data.map((item) => item[yColumn]));
    const minX = Math.min(...data.map((item) => item[xColumns[0]]));
    const maxX = Math.max(...data.map((item) => item[xColumns[0]]));

    const chartProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    const axisProps = {
      type: xColumns.includes("date") ? "category" : "number",
      dataKey: xColumns[0],
      tickFormatter: formatXAxis,
      domain: [minX, maxX],
    };

    const yAxisProps = {
      tickFormatter: formatYAxis,
      domain: [minY, maxY],
    };

    const lineProps = {
      type: curveType,
      dataKey: yColumn,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      activeDot: { r: 8 },
    };

    const areaProps = {
      type: curveType,
      dataKey: yColumn,
      stroke: strokeColor,
      fill: strokeColor,
      strokeWidth: strokeWidth,
      activeDot: { r: 8 },
    };

    const barProps = {
      dataKey: yColumn,
      fill: strokeColor,
    };

    switch (chartType) {
      case "line":
        console.log("line");
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...axisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip />
            <Legend />
            <Line {...lineProps} />
          </LineChart>
        );
      case "area":
        return (
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...axisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip />
            <Legend />
            <Area {...areaProps} />
          </AreaChart>
        );
      case "bar":
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...axisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip />
            <Legend />
            <Bar {...barProps} />
          </BarChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.ChartContainer}>
      <div className={styles.chartConfig}>
        <Typography variant="subtitle1">
          {`(y) ${yColumn} vs (x) ${xColumns}`}
        </Typography>
      </div>
      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          {renderChart()}
        </ResponsiveContainer>
      )}
      <div className={styles.pagination}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </div>
    </div>
  );
};

export default RenderChart;
