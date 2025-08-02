import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  TextField,
  MenuItem
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Vacancies = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [student, setStudent] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedStudent = JSON.parse(localStorage.getItem("studentInfo"));
    if (!storedStudent) {
      navigate("/login/student");
      return;
    }
    setStudent(storedStudent);
    fetchJobs();
    fetchStudentMeta(storedStudent._id);
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs");
      setJobs(res.data.jobs);
      setFilteredJobs(res.data.jobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const fetchStudentMeta = async (studentId) => {
    
    try {
      const [appliedRes, bookmarkRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/student/${studentId}/applications`),
        axios.get(`http://localhost:5000/api/students/${studentId}/bookmarks`)
      ]);

      setAppliedJobs(appliedRes.data.applications.map(a => a.job?._id));
      setBookmarkedJobs(bookmarkRes.data.bookmarks.map(b => b._id));
    } catch (err) {
      console.error("Meta fetch failed", err);
    }
  };

  const handleApply = async (jobId) => {
    if (!student) return alert("Please log in as a student to apply.");

    try {
      const res = await axios.post(`http://localhost:5000/api/jobs/${jobId}/apply`, {
        studentId: student._id,
      });
      alert(res.data.message || "Applied successfully");
      fetchStudentMeta(student._id);
    } catch (err) {
      console.error("Apply error:", err);
      alert("Failed to apply");
    }
  };

  const handleBookmark = async (jobId) => {
    if (!student) return alert("Please log in as a student to bookmark.");

    try {
      const res = await axios.post(`http://localhost:5000/api/jobs/${jobId}/bookmark`, {
        studentId: student._id,
      });
      alert(res.data.message || "Bookmarked successfully");
      fetchStudentMeta(student._id);
    } catch (err) {
      console.error("Bookmark error:", err);
      alert("Failed to bookmark");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("studentInfo");
    navigate("/login/student");
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterJobs(term, locationFilter);
  };

  const handleLocationFilter = (e) => {
    const location = e.target.value;
    setLocationFilter(location);
    filterJobs(searchTerm, location);
  };

  const filterJobs = (term, location) => {
    const filtered = jobs.filter((job) => {
      const matchTerm = job.title.toLowerCase().includes(term) || job.companyName?.toLowerCase().includes(term);
      const matchLocation = location ? job.location === location : true;
      return matchTerm && matchLocation;
    });
    setFilteredJobs(filtered);
  };

  const uniqueLocations = [...new Set(jobs.map(job => job.location))];

  return (
    <Box p={3}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography variant="h6">Welcome, {student?.name}</Typography>
          <Typography variant="body2" color="textSecondary">{student?.email}</Typography>
        </Box>
        <Button variant="outlined" color="error" onClick={handleLogout}>Logout</Button>
      </Box>

      <Typography variant="h4" mb={3}>Job Vacancies</Typography>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Search by title or company"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
  label="Filter by Location"
  select
  variant="outlined"
  fullWidth
  value={locationFilter}
  onChange={handleLocationFilter}
  SelectProps={{
    MenuProps: {
      PaperProps: {
        style: {
          maxHeight: 300, // optional, for scrolling
          width: 250,     // ensures dropdown has enough space
        },
      },
    },
  }}
  sx={{ minWidth: 165 }} // ensures field isn't too small
>
  <MenuItem value="">All Locations</MenuItem>
  {uniqueLocations.map((loc) => (
    <MenuItem key={loc} value={loc}>
      {loc}
    </MenuItem>
  ))}
</TextField>

        </Grid>
      </Grid>

      {filteredJobs.length > 0 ? (
        filteredJobs.map((job) => (
          <Paper key={job._id} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6">{job.title}</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Company name: {job.companyName || (job.recruiterId?.companyName ?? "Unknown Company")}
            </Typography>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">Location: {job.location}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">Salary: {job.salary}</Typography>
              </Grid>
            </Grid>

            <Box mt={2} sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(`/job/${job._id}`)}
              >
                View Details
              </Button>

              {bookmarkedJobs.includes(job._id) ? (
                <Chip label="Bookmarked" variant="outlined" />
              ) : (
                <Button variant="outlined" onClick={() => handleBookmark(job._id)}>
                  Bookmark
                </Button>
              )}

              {appliedJobs.includes(job._id) ? (
                <Chip label="Applied" color="success" />
              ) : (
                <Button variant="contained" onClick={() => handleApply(job._id)}>
                  Apply
                </Button>
              )}
            </Box>
          </Paper>
        ))
      ) : (
        <Typography>No jobs available.</Typography>
      )}
    </Box>
  );
};

export default Vacancies;
