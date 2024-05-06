import { Typography } from "@mui/material";
import styles from "../css/Pages/Dashboard/Dashboard.module.css";
import { useEffect, useState } from "react";
import fetchWrapper from "../../../utils/fetchWrapper";
import FilterBar from "../components/FilterBar";
import CustomGraphList from "../components/CustomGraphList";
import CustomChartModal from "../components/modals/CustomGraph";
import DefaultCharts from "../components/DefaultCharts";

export default function Dashboard() {
  const [sports, setSports] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [customCreateOpen, setCustomCreateOpen] = useState(false);
  const customGraphs = JSON.parse(localStorage.getItem("customGraphs"));
  const [password, setPassword] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  function handleFilterSelect(type, e) {
    let existingFilters = { ...selectedFilters }; // Create a copy of the existing filters
    if (existingFilters[type] === e.target.value) {
      delete existingFilters[type];
    } else {
      if (
        (type === "endDate" && e.target.value >= selectedFilters?.startDate) ||
        type !== "endDate"
      ) {
        if (type === "startDate" && selectedFilters?.endDate < e.target.value) {
          delete selectedFilters.endDate;
        } else {
          existingFilters[type] = e.target.value;
        }
      }
    }
    setSelectedFilters(existingFilters);
  }

  useEffect(() => {
    if (sports && sports.length > 0 && authenticated) {
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        sport: sports[0].sportId, // Assuming you want to set the first sport as the initial value
      }));
    }
  }, [sports, authenticated]);

  useEffect(() => {
    if (!sports && authenticated) {
      fetchWrapper(
        "/api/sports",
        localStorage.getItem("DC-TOKEN"),
        "GET",
        {}
      ).then((res) => {
        if (res) {
          console.log(res);
          setSports(res);
        }
      });
    } else {
      console.log(sports);
    }
  }, [sports, authenticated]);

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  const handleCustomCreateOpen = () => {
    setCustomCreateOpen(true);
  };

  const handleCustomCreateClose = () => {
    setCustomCreateOpen(false);
  };

  function handleAuthenticate() {
    const payload = {
      password: password,
    };
    fetchWrapper("/api/authenticate", "", "POST", { ...payload }).then(
      (res) => {
        if (res.message === "authorized") {
          setAuthenticated(true);
          localStorage.setItem("DC-TOKEN", password);
        }
      }
    );
  }

  return !authenticated ? (
    <div>
      <input onChange={(e) => handlePasswordChange(e)} type="password" />
      <button onClick={handleAuthenticate}>Authenticate</button>
    </div>
  ) : (
    <div className={styles.Dashboard}>
      <div className={styles.Header}>
        <Typography className={styles.HeaderLogo} variant="h5">
          Swish Dashboard
        </Typography>
        <div className={styles.HeaderContentRow}>
          <button
            onClick={() => window.open("https://www.swishanalytics.com/")}
            className={styles.HeaderButton}
          >
            Betting Guide
          </button>
          <button
            onClick={handleCustomCreateOpen}
            className={styles.HeaderButton}
          >
            Create Custom Chart
          </button>
        </div>
      </div>
      <FilterBar
        selectedFilters={selectedFilters}
        handleFilterSelect={handleFilterSelect}
        sports={sports}
      />
      {customGraphs && customGraphs.length > 0 ? (
        <>
          <Typography
            textAlign={"left"}
            color={"rgb(199, 140, 255)"}
            variant="body1"
          >
            Custom Charts
          </Typography>
          <CustomGraphList customGraphs={customGraphs} />
        </>
      ) : null}
      <div className={styles.MainContent}>
        <CustomChartModal
          open={customCreateOpen}
          onClose={handleCustomCreateClose}
        />
        {/* <Typography
          textAlign={"left"}
          color={"rgb(199, 140, 255)"}
          variant="body1"
        >
          Standard Charts
        </Typography> */}
        <DefaultCharts />
        {/* <DimensionalAnalysis selectedDimension="bet_type" page={1} pageSize={250} /> */}
      </div>
    </div>
  );
}
