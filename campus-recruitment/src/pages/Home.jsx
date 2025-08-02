import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Home.css";
import Process from "../pages/Process";
import Stats from "../pages/Stats";
import Faq from "../pages/Faq";
import cclogo2 from "../assets/cclogo2.png";

const Home = () => {
  return (
    <Box className="home-container">
      {/* Hero Section */}
      <motion.div
        className="hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <img src={cclogo2} alt="CampusConnect Logo" className="hero-logo" style={{ width: 120, height: 120 }} />
        <Typography variant="h3" className="hero-title">
          Welcome to CampusConnect
        </Typography>
        <Typography variant="subtitle1" className="hero-subtitle">
          Your one-stop platform to connect students, recruiters, and placement incharges.
        </Typography>
        <Box className="hero-buttons">
          <Link to="/login/student" style={{ textDecoration: 'none' }}>
            <Button variant="contained" className="hero-button">
              Student Login
            </Button>
          </Link>

          <Link to="/login/recruiter" style={{ textDecoration: 'none' }}>
            <Button variant="contained" className="hero-button">
              Recruiter Login
            </Button>
          </Link>

          <Link to="/login/placementhead" style={{ textDecoration: 'none' }}>
            <Button variant="contained" className="hero-button">
              Placement Head Login
            </Button>
          </Link>
        </Box>
      </motion.div>

      <br />
      <Process />
      <Stats />
      <br /><br />
      <Faq />
      <br />
    </Box>
  );
};

export default Home;
