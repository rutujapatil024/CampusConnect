// src/components/Layout.jsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, Outlet } from "react-router-dom";
import cclogo from "../assets/cclogo.png";
import "./Layout.css";

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 2 }}>
        <img src={cclogo} alt="Logo" style={{ width: 32, height: 32 }} />
        <Typography variant="h6" sx={{ color: "#1a3579", fontWeight: "bold" }}>
          CampusConnect
        </Typography>
      </Box>

      <List>
        <ListItem button component={Link} to="/register">
          <ListItemText primary="Register" />
        </ListItem>
        <ListItem button component={Link} to="/vacancies">
          <ListItemText primary="Browse Vacancies" />
        </ListItem>
        <ListItem button component={Link} to="/helpdesk">
          <ListItemText primary="Helpdesk" />
        </ListItem>
        <ListItem button component={Link} to="/resources">
          <ListItemText primary="Resources" />
        </ListItem>
        <ListItem button component="a" href="#faq">
          <ListItemText primary="FAQ" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" elevation={1} sx={{ backgroundColor: "#1a3579", height: '80px', px: 1 }}>
        <Toolbar sx={{ justifyContent: "space-between", py: 0.5 }}>
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <IconButton edge="start" color="inherit" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </Box>

          <Typography
            variant="h6"
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              fontWeight: "bold",
              display: { xs: "block", sm: "none" },
            }}
          >
            CampusConnect
          </Typography>

          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 1,
              }}
            >
              <img src={cclogo} alt="CampusConnect Logo" style={{ width: 45, height: 45 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#f1f5f9" }}>
                CampusConnect
              </Typography>
            </Box>
          </Link>

          <Box className="desktop-links" sx={{ display: { xs: "none", sm: "flex" }, gap: 1, alignItems: "center" }}>
            {[
              { to: "/register", label: "Register" },
              { to: "/vacancies", label: "Browse Vacancies" },
              { to: "/helpdesk", label: "Helpdesk" },
              { to: "/resources", label: "Resources" },
            ].map((item, index) => (
              <Button
                key={index}
                color="inherit"
                component={Link}
                to={item.to}
                sx={{ fontSize: "0.95rem", px: 1.5, py: 0.5 }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              color="inherit"
              href="#faq"
              sx={{ fontSize: "0.9rem", px: 1.5, py: 0.5 }}
            >
              FAQ
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle} sx={{ display: { sm: "none" } }}>
        {drawer}
      </Drawer>

      <Box sx={{ mt: 8, p: 2 }}>
        <Outlet />
      </Box>
    </>
  );
};

export default Layout;
