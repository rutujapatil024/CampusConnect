import React, { useState } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ add this

const StudentLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // ✅ useNavigate from React Router

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/login/student", formData);
      alert("Login successful!");

      // Store token and info
      localStorage.setItem("studentToken", res.data.token);
      localStorage.setItem("studentInfo", JSON.stringify(res.data.user));

      // ✅ Redirect using React Router
      navigate("/dashboard/student");
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || "Server error"));
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 4, boxShadow: 2, borderRadius: 2, bgcolor: "#fff" }}>
      <Typography variant="h5" mb={2} textAlign="center">Student Login</Typography>
      <TextField fullWidth label="Email" name="email" margin="normal" onChange={handleChange} />
      <TextField fullWidth label="Password" name="password" type="password" margin="normal" onChange={handleChange} />
      <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>Login</Button>
      <Typography variant="body2" mt={2} textAlign="center">
        Don't have an account? <a href="/register">Register</a> here.
      </Typography>
    </Box>
  );
};

export default StudentLogin;
