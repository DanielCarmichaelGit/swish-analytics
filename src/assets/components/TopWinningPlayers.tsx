import React, { useState, useEffect } from "react";
import fetchWrapper from "../../../utils/fetchWrapper";

const TopWinningPlayers = () => {
  const [topPlayers, setTopPlayers] = useState([]);

  useEffect(() => {
    if (!topPlayers) {
      fetchData();
    }
  }, [topPlayers]);

  const fetchData = async () => {
    const payload = {};

    try {
      const response = await fetchWrapper(
        "/api/top-winning-players",
        localStorage.getItem("DC-TOKEN"),
        "GET",
        payload
      );
      setTopPlayers(response.data);
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  };

  return (
    <div>
      <h2>Top Winning Players</h2>
      <table>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Total Bets</th>
            <th>Total Profit</th>
          </tr>
        </thead>
        <tbody>
          {topPlayers.map((player) => (
            <tr key={player.playerId}>
              <td>{player.playerName}</td>
              <td>{player.totalBets}</td>
              <td>{player.totalProfit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopWinningPlayers;
