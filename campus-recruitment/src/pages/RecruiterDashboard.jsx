import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import axios from "axios";
import "./RecruiterDashboard.css";
import { useNavigate } from "react-router-dom";

const RecruiterDashboard = () => {
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    companyName: "",
    location: "",
    salary: "",
    eligibility: "",
    skillsrequired: "",
  });

  const [postedJobs, setPostedJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const navigate = useNavigate();

  const storedRecruiter = localStorage.getItem("recruiterInfo");
  const recruiter = storedRecruiter ? JSON.parse(storedRecruiter) : null;

  useEffect(() => {
    if (recruiter) {
      fetchPostedJobs();

      setJobData((prev) => ({
        ...prev,
        companyName: recruiter.companyName || "",
      }));
    }
  }, []);

  const fetchPostedJobs = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/jobs/recruiter/${recruiter._id}`);
      setPostedJobs(res.data.jobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const handleChange = (e) => {
    setJobData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePostOrEditJob = async () => {
    if (!recruiter) {
      alert("Recruiter not logged in");
      return;
    }

    const { title, description, companyName, location, salary, eligibility, skillsrequired } = jobData;
    if (!title || !description || !companyName || !location || !salary || !eligibility || !skillsrequired) {
      alert("All fields are mandatory.");
      return;
    }

    try {
      if (editingJobId) {
        await axios.put(`http://localhost:5000/api/jobs/${editingJobId}`, jobData);
        alert("Job updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/jobs", {
          ...jobData,
          recruiterId: recruiter._id,
        });
        alert("Job posted successfully!");
      }

      setJobData({
        title: "",
        description: "",
        companyName: recruiter.companyName || "",
        location: "",
        salary: "",
        eligibility: "",
        skillsrequired: "",
      });
      setEditingJobId(null);
      fetchPostedJobs();
    } catch (err) {
      console.error("Error posting/editing job:", err);
      alert("Failed to save job");
    }
  };

  const handleEdit = (job) => {
    setJobData({
      title: job.title || "",
      companyName: recruiter.companyName || "",
      description: job.description || "",
      location: job.location || "",
      salary: job.salary || "",
      eligibility: job.eligibility || "",
      skillsrequired: job.skillsrequired || "",
    });
    setEditingJobId(job._id);
  };

  const handleDelete = async (jobId) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`);
      alert("Job deleted successfully");
      fetchPostedJobs();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting job");
    }
  };

  return (
    <Box className="recruiter-dashboard">
      <Typography variant="h4" className="recruiter-title">
        Welcome, {recruiter?.name}
      </Typography>

      <Paper elevation={2} className="recruiter-profile">
        <Typography variant="h6" sx={{ mb: 1 }}>My Profile</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1"><strong>Email:</strong> {recruiter?.email}</Typography>
            <Typography variant="body1"><strong>Company:</strong> {recruiter?.companyName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1"><strong>Designation:</strong> {recruiter?.designation}</Typography>
            <Typography variant="body1"><strong>Website:</strong> {recruiter?.website}</Typography>
            <Typography variant="body1"><strong>Address:</strong> {recruiter?.address}</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid item xs={12}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              localStorage.removeItem("recruiterInfo");
              window.location.href = "/login/recruiter";
            }}
            className="logout-button"
          >
            Logout
          </Button>
        </Grid>
      </Paper>

      <Divider sx={{ my: 4 }} />

      <Paper className="post-job-section" elevation={3}>
        <Typography variant="h6">
          {editingJobId ? "Edit Job" : "Post a Job"}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Job Title"
              name="title"
              value={jobData.title || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Company Name"
              name="companyName"
              value={jobData.companyName || ""}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Job Description"
              name="description"
              multiline
              rows={2}
              value={jobData.description || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              label="Location"
              name="location"
              value={jobData.location || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              label="Salary"
              name="salary"
              value={jobData.salary || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              label="Eligibility"
              name="eligibility"
              value={jobData.eligibility || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Required Skills"
              name="skillsrequired"
              value={jobData.skillsrequired || ""}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Box sx={{ textAlign: "right", mt: 2 }}>
          <Button variant="contained" onClick={handlePostOrEditJob}>
            {editingJobId ? "Update Job" : "Post Job"}
          </Button>
        </Box>
      </Paper>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" sx={{ mb: 2 }}>
        My Posted Jobs
      </Typography>
      {postedJobs.length > 0 ? (
        postedJobs.map((job) => (
          <Paper key={job._id} className="job-card" elevation={2}>
            <Typography variant="subtitle1">{job.title}</Typography>
            <Typography variant="body2" color="textSecondary">
              {job.description}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography variant="body2" color="textSecondary">
                Location: {job.location} | Salary: {job.salary}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Eligibility: {job.eligibility} | Skills: {job.skillsrequired}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(`/applicants/${job._id}`)}
              >
                View Applicants
              </Button>

              <Button variant="outlined" size="small" onClick={() => handleEdit(job)}>Edit</Button>
              <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(job._id)}>Delete</Button>
            </Box>
          </Paper>
        ))
      ) : (
        <Typography variant="body2" color="textSecondary">
          You haven't posted any jobs yet.
        </Typography>
      )}
    </Box>
  );
};

export default RecruiterDashboard;
