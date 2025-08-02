import React, { useState } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const InchargeLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/login/incharge", formData);
      alert("Login successful!");

      localStorage.setItem("inchargeToken", res.data.token);
      localStorage.setItem("inchargeInfo", JSON.stringify(res.data.user));

      navigate("/dashboard/incharge");
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || "Server error"));
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 4,
        boxShadow: 2,
        borderRadius: 2,
        bgcolor: "#fff",
      }}
    >
      <Typography variant="h5" mb={2} textAlign="center">
        Placement Incharge Login
      </Typography>
      <TextField
        fullWidth
        label="Email"
        name="email"
        margin="normal"
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="Password"
        name="password"
        type="password"
        margin="normal"
        onChange={handleChange}
      />
      <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
        Login
      </Button>
      <Typography variant="body2" mt={2} textAlign="center">
        Don&apos;t have an account? <a href="/register">Register</a> here.
      </Typography>
    </Box>
  );
};

export default InchargeLogin;
