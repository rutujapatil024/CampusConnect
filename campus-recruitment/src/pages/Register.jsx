import React, { useState } from "react";
import {
  Box, TextField, Typography, Button, MenuItem, Grid
} from "@mui/material";
import axios from "axios";
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    role: "student",
    name: "",
    email: "",
    password: "",
    phone: "",
    rollNo: "",
    degree: "",
    branch: "",
    companyName: "",
    designation: "",
    website: "",
    institute: "",
    department: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name || !/^[A-Za-z ]+$/.test(formData.name)) {
      newErrors.name = "Name is required and should only contain letters";
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }

    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be exactly 10 digits";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Role-specific required fields
    if (formData.role === "student") {
      if (!formData.rollNo) newErrors.rollNo = "Roll number required";
      if (!formData.degree) newErrors.degree = "Degree required";
      if (!formData.branch) newErrors.branch = "Branch required";
    }

    if (formData.role === "recruiter") {
      if (!formData.companyName) newErrors.companyName = "Company Name required";
      if (!formData.designation) newErrors.designation = "Designation required";
      if (!formData.website) newErrors.website = "Website required";
      if (!formData.address) newErrors.address = "Office Address required";
    }

    if (formData.role === "incharge") {
      if (!formData.institute) newErrors.institute = "Institute Name required";
      if (!formData.department) newErrors.department = "Department required";
      if (!formData.designation) newErrors.designation = "Designation required";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/register", formData);
      alert("Registered successfully!");
    } catch (err) {
      if (err.response?.data?.message?.includes("duplicate key") || err.response?.data?.error?.includes("duplicate key")) {
        setServerError("Email already exists.");
      } else {
        setServerError(err.response?.data?.message || "Something went wrong.");
      }
    }
  };

  const { role } = formData;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5, p: 3, boxShadow: 2, borderRadius: 2, bgcolor: "#fff" }}>
      <Box className="register-container">
        <Typography variant="h5" gutterBottom textAlign="center">Register</Typography>
        {serverError && <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>{serverError}</Typography>}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField select fullWidth label="Role" name="role" value={role} onChange={handleChange}>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="recruiter">Recruiter</MenuItem>
              <MenuItem value="incharge">Placement Incharge</MenuItem>
            </TextField>
          </Grid>

          {/* Common */}
          <Grid item xs={12}>
            <TextField fullWidth label="Full Name" name="name" onChange={handleChange} error={!!errors.name} helperText={errors.name} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Email" name="email" onChange={handleChange} error={!!errors.email} helperText={errors.email} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Password" name="password" type="password" onChange={handleChange} error={!!errors.password} helperText={errors.password} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Phone number" name="phone" onChange={handleChange} error={!!errors.phone} helperText={errors.phone} />
          </Grid>

          {/* Student Fields */}
          {role === "student" && (
            <>
             <Grid item xs={12}><TextField fullWidth label="Address" name="address" onChange={handleChange} /></Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Roll Number" name="rollNo" onChange={handleChange} error={!!errors.rollNo} helperText={errors.rollNo} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Degree" name="degree" onChange={handleChange} error={!!errors.degree} helperText={errors.degree} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Branch" name="branch" onChange={handleChange} error={!!errors.branch} helperText={errors.branch} />
              </Grid>
            </>
          )}

          {/* Recruiter Fields */}
          {role === "recruiter" && (
            <>
              <Grid item xs={12}>
                <TextField fullWidth label="Company Name" name="companyName" onChange={handleChange} error={!!errors.companyName} helperText={errors.companyName} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Designation" name="designation" onChange={handleChange} error={!!errors.designation} helperText={errors.designation} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Company Website" name="website" onChange={handleChange} error={!!errors.website} helperText={errors.website} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Office Address" name="address" multiline rows={2} onChange={handleChange} error={!!errors.address} helperText={errors.address} />
              </Grid>
            </>
          )}

          {/* Incharge Fields */}
          {role === "incharge" && (
            <>
              <Grid item xs={12}>
                <TextField fullWidth label="Institute Name" name="institute" onChange={handleChange} error={!!errors.institute} helperText={errors.institute} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Department" name="department" onChange={handleChange} error={!!errors.department} helperText={errors.department} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Designation" name="designation" onChange={handleChange} error={!!errors.designation} helperText={errors.designation} />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="primary" onClick={handleSubmit}>Register</Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Register;
