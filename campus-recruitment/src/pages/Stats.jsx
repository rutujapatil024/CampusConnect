import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import CountUp from "react-countup";
import axios from "axios";
import "./Stats.css";
import companies2 from "../assets/companies2.png";

const Stats = () => {
  const [stats, setStats] = useState({
    students: 0,
    recruiters: 0,
    jobs: 0,
    applications: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    { label: "Registered Students", value: stats.students },
    { label: "Companies Participated", value: stats.recruiters },
    { label: "Jobs Posted", value: stats.jobs },
    { label: "Students Placed", value: stats.applications },
  ];

  return (
    <Box
      className="stats-container"
      sx={{
        backgroundImage: `url(${companies2})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "rgba(255, 255, 255, 0)",
        backgroundBlendMode: "overlay",
        py: 8,
        px: 2,
      }}
    >
      <Typography variant="h4" className="stats-title">
        <b>Placement Stats Snapshot</b>
      </Typography>

      <Grid container spacing={4} justifyContent="center" className="stats-grid">
        {statsData.map((item, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Paper elevation={3} className="stat-card">
              <Typography variant="h5" className="stat-value">
                <CountUp end={item.value} duration={2.5} separator="," />
              </Typography>
              <Typography variant="body1" className="stat-label">
                {item.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Stats;
