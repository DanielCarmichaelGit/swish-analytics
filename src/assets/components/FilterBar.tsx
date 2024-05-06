import React, { useState, useEffect } from "react";
import styles from "../css/Components/FilterBar.module.css";
import { Typography, Divider } from "@mui/material";

export default function FilterBar({
  sports,
  selectedFilters,
  handleFilterSelect,
}) {
  return (
    <div className={styles.FilterBar}>
      <div className={styles.FilterGroup}>
        <Typography variant="caption">Sport</Typography>
        {sports ? (
          <select
            value={selectedFilters.sport || "Sport Not Selected"}
            className={styles.FilterSelect}
          >
            {sports?.map((sport) => {
              return (
                <option
                  onSelect={(e) => handleFilterSelect("sport", e)}
                  key={sport.sportId}
                  value={sport.sportId} // Use sportId as the value
                >
                  {sport.sportName}
                </option>
              );
            })}
          </select>
        ) : null}
      </div>
      {selectedFilters.sport ? (
        <>
          <Divider
            sx={{
              color: "rebeccapurple",
              opacity: 1,
              border: "1px solid #333",
              margin: "0px",
            }}
            orientation="vertical"
            flexItem
            variant="inset"
          />
          <div className={styles.FilterGroupRow}>
            <div className={styles.FilterGroup}>
              <Typography variant="caption">From</Typography>
              <input
                className={styles.FilterInput}
                value={selectedFilters.startDate}
                onChange={(e) => handleFilterSelect("startDate", e)}
                type="date"
              />
            </div>
            <div className={styles.FilterGroup}>
              <Typography variant="caption">End</Typography>
              <input
                className={styles.FilterInput}
                value={selectedFilters.endDate}
                onChange={(e) => handleFilterSelect("endDate", e)}
                type="date"
              />
            </div>
          </div>
        </>
      ) : null}
      {selectedFilters.sport &&
      selectedFilters.startDate &&
      selectedFilters.endDate &&
      selectedFilters.startDate === selectedFilters.endDate ? (
        <>
          <Divider
            sx={{
              color: "rebeccapurple",
              opacity: 1,
              border: "1px solid #333",
              margin: "0px",
            }}
            orientation="vertical"
            flexItem
            variant="inset"
          />
          <div className={styles.FilterGroupRow}>
            <div className={styles.FilterGroup}>
              <Typography variant="caption">From</Typography>
              <input
                className={styles.FilterInput}
                value={selectedFilters.startTime}
                onChange={(e) => handleFilterSelect("startTime", e)}
                type="time"
              />
            </div>
            <div className={styles.FilterGroup}>
              <Typography variant="caption">End</Typography>
              <input
                min={selectedFilters.startTime}
                className={styles.FilterInput}
                value={selectedFilters.endTime}
                onChange={(e) => handleFilterSelect("endTime", e)}
                type="time"
              />
            </div>
          </div>
        </>
      ) : null}
      {/* Add more FilterGroup components for additional filters */}
    </div>
  );
}
