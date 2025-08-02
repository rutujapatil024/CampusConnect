import React from "react";
import {
  Box,
  Typography,
  Grid,
  Link,
  IconButton
} from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";
import "./Footer.css";

const Footer = () => {
  return (
    <Box className="footer">
      <Grid container spacing={4} className="footer-grid">
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" className="footer-title">CampusConnect</Typography>
          <Typography className="footer-description">
            A platform to bridge the gap between students, recruiters, and placement officers.
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography className="footer-heading">Quick Links</Typography>
          <Link href="/" underline="none" className="footer-link">Home</Link>
          <Link href="/vacancies" underline="none" className="footer-link">Vacancies</Link>
          <Link href="/helpdesk" underline="none" className="footer-link">Helpdesk</Link>
          <Link href="/faq" underline="none" className="footer-link">FAQ</Link>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography className="footer-heading">Contact</Typography>
          <Typography className="footer-text">Email: support@campusconnect.in</Typography>
          <Typography className="footer-text">Phone: +91 9876543210</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography className="footer-heading">Follow Us</Typography>
          <Box className="footer-icons">
            <IconButton href="#" className="footer-icon"><Facebook /></IconButton>
            <IconButton href="#" className="footer-icon"><Twitter /></IconButton>
            <IconButton href="#" className="footer-icon"><Instagram /></IconButton>
            <IconButton href="#" className="footer-icon"><LinkedIn /></IconButton>
          </Box>
        </Grid>
      </Grid>

      <Box className="footer-bottom">
        <Typography variant="body2" className="footer-copy">
          © {new Date().getFullYear()} CampusConnect. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
