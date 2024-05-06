import React, { useState, useEffect } from "react";
import {
  Typography,
  Modal,
  Box,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Slider,
} from "@mui/material";
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
import fetchWrapper from "../../../../utils/fetchWrapper";
import styles from "../../css/Components/Modals/CustomChartModal.module.css";
import moment from "moment";

const xOptions = [
  "date",
  "datetime_utc",
  "accepted_datetime_utc",
  "settled_date",
  "received_date",
  "sport",
  "event_id",
  "team_abbr",
  "opp_abbr",
  "player_name",
  "pos_abbr",
  "bet_type",
  "parlay_type",
  "product",
  "market_duration_value",
  "market_duration_type",
  "gamestate",
];

const yOptions = [
  "component_cnt_bet",
  "line",
  "book_risk_component",
  "book_profit_gross_component",
  "component_price",
  "component_prob",
  "component_num_bet",
  "book_risk",
  "book_profit_gross",
  "bet_price",
  "bet_prob",
  "actual",
  "accepted_min_before_start",
  "market_duration_id",
  "line_at_bet",
  "prob_norm_at_bet",
  "proj_at_bet",
  "gamestate_id",
  "score",
  "opp_score",
  "period",
  "usage_at_bet",
  "actual_at_bet",
  "is_in_game",
  "event_time_remaining",
  "usage_id",
  "orig_proj_at_bet",
  "line_diff_at_bet",
  "prob_diff_at_bet",
];

const chartTypes = ["line", "area", "bar"];
const curveTypes = ["linear", "monotone", "step"];
const groupByOptions = ["hour", "minute", "day", "week"];

const CustomChartModal = ({
  open,
  onClose,
  startDate: defaultStartDate,
  startTime: defaultStartTime,
  endDate: defaultEndDate,
  endTime: defaultEndTime,
}) => {
  const [selectedYAxis, setSelectedYAxis] = useState("");
  const [selectedXAxes, setSelectedXAxes] = useState([]);
  const [startDate, setStartDate] = useState(defaultStartDate || "");
  const [startTime, setStartTime] = useState(defaultStartTime || "");
  const [endDate, setEndDate] = useState(defaultEndDate || "");
  const [endTime, setEndTime] = useState(defaultEndTime || "");
  const [data, setData] = useState([]);
  const [yAxisOptions, setYAxisOptions] = useState(yOptions);
  const [xAxisOptions, setXAxisOptions] = useState(xOptions);
  const [chartType, setChartType] = useState("line");
  const [curveType, setCurveType] = useState("linear");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [strokeColor, setStrokeColor] = useState("#8884d8");
  const [splitType, setSplitType] = useState(false);
  const [lineColors, setLineColors] = useState({});
  

  const fetchData = async () => {
    const payload = {
      yColumn: selectedYAxis,
      xColumns: selectedXAxes.join(","),
      startDate,
      startTime,
      endDate,
      endTime,
    };
    try {
      const response = await fetchWrapper(
        "/api/custom-graph",
        localStorage.getItem("DC-TOKEN"),
        "GET",
        payload
      );
      setData(response);
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  };

  const handleYAxisChange = (event) => {
    setSelectedYAxis(event.target.value);
  };

  const handleXAxesChange = (event) => {
    const selectedOptions = event.target.value;
    if (selectedOptions.length <= 10) {
      setSelectedXAxes(selectedOptions);
    }
  };

  const handleCreateChart = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleChartSave = (e) => {
    e.preventDefault();
    const chartConfig = {
      yColumn: selectedYAxis,
      xColumns: selectedXAxes.join(","),
      startDate,
      startTime,
      endDate,
      endTime,
      chartType,
      curveType,
      strokeWidth,
      strokeColor,
    };

    let currentCharts = localStorage.getItem("customCharts");

    if (currentCharts) {
      currentCharts = JSON.parse(currentCharts);
      currentCharts.push(chartConfig);
      localStorage.setItem("customCharts", JSON.stringify(currentCharts));
    } else {
      localStorage.setItem("customCharts", JSON.stringify([chartConfig]));
    }
  };

  const formatXAxis = (tickItem) => {
    if (selectedXAxes.includes("date")) {
      return moment(tickItem).format("MMM D, YYYY");
    } else if (selectedXAxes.includes("datetime_utc")) {
      return moment(tickItem).format("MMM D, YYYY HH:mm");
    } else {
      return tickItem;
    }
  };

  const formatYAxis = (tickItem) => {
    if (
      selectedYAxis.includes("price") ||
      selectedYAxis.includes("prob") ||
      selectedYAxis.includes("line") ||
      selectedYAxis.includes("score")
    ) {
      return tickItem.toFixed(2);
    } else {
      return tickItem;
    }
  };

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const renderChart = () => {
    const minY = Math.min(...data.map((item) => item[selectedYAxis]));
    const maxY = Math.max(...data.map((item) => item[selectedYAxis]));
    const minX = Math.min(...data.map((item) => item[selectedXAxes[0]]));
    const maxX = Math.max(...data.map((item) => item[selectedXAxes[0]]));

    const chartProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    const axisProps = {
      type: selectedXAxes.includes("date") ? "category" : "number",
      dataKey: selectedXAxes[0],
      tickFormatter: formatXAxis,
      domain: [minX, maxX],
    };

    const yAxisProps = {
      tickFormatter: formatYAxis,
      domain: [minY, maxY],
    };

    const lineProps = splitType
      ? selectedXAxes.map((xAxis) => ({
          type: curveType,
          dataKey: xAxis,
          stroke: lineColors[xAxis] || generateRandomColor(),
          strokeWidth: strokeWidth,
          activeDot: { r: 8 },
        }))
      : [
          {
            type: curveType,
            dataKey: selectedYAxis,
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            activeDot: { r: 8 },
          },
        ];

    const areaProps = {
      type: curveType,
      dataKey: selectedYAxis,
      stroke: strokeColor,
      fill: strokeColor,
      strokeWidth: strokeWidth,
      activeDot: { r: 8 },
    };

    const barProps = {
      dataKey: selectedYAxis,
      fill: strokeColor,
    };

    switch (chartType) {
      case "line":
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...axisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip />
            <Legend />
            {lineProps.map((props, index) => (
              <Line key={index} {...props} />
            ))}
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
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modalContent}>
        <Typography variant="h6" component="h2" className={styles.modalTitle}>
          Create Custom Chart
        </Typography>
        <form onSubmit={handleCreateChart} className={styles.form}>
          <div className={styles.formField}>
            <Typography variant="subtitle1">Select Y-Axis:</Typography>
            <Select
              value={selectedYAxis}
              onChange={handleYAxisChange}
              className={styles.select}
            >
              {yAxisOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={styles.formField}>
            <Typography variant="subtitle1">
              Select X-Axes (up to 10):
            </Typography>
            <Select
              multiple
              value={selectedXAxes}
              onChange={handleXAxesChange}
              renderValue={(selected) => selected.join(", ")}
              className={styles.select}
            >
              {xAxisOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={styles.formField}>
            <Typography variant="subtitle1">Start Date:</Typography>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formField}>
            <Typography variant="subtitle1">Start Time:</Typography>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formField}>
            <Typography variant="subtitle1">End Date:</Typography>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formField}>
            <Typography variant="subtitle1">End Time:</Typography>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formField}>
            <FormControl fullWidth>
              <InputLabel>Chart Type</InputLabel>
              <Select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
              >
                {chartTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {chartType === "line" && (
            <div className={styles.formField}>
              <FormControl fullWidth>
                <InputLabel>Curve Type</InputLabel>
                <Select
                  value={curveType}
                  onChange={(e) => setCurveType(e.target.value)}
                >
                  {curveTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}
          <div className={styles.formField}>
            <Typography variant="subtitle1">Stroke Width:</Typography>
            <Slider
              value={strokeWidth}
              onChange={(e, value) => setStrokeWidth(value)}
              min={1}
              max={10}
              step={1}
              valueLabelDisplay="auto"
            />
          </div>
          <div className={styles.formField}>
            <Typography variant="subtitle1">Stroke Color:</Typography>
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className={styles.colorInput}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={styles.submitButton}
          >
            Create Chart
          </Button>
        </form>
        {data.length > 0 && (
          <ResponsiveContainer width="100%" height={400}>
            {renderChart()}
          </ResponsiveContainer>
        )}
        <button
          onClick={(e) => handleChartSave(e)}
          className={styles.submitButton}
        >
          Save Chart
        </button>
      </Box>
    </Modal>
  );
};

export default CustomChartModal;
