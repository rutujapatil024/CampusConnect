import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Chip
} from "@mui/material";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [student, setStudent] = useState(null);
  const [applied, setApplied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("studentInfo");
    if (stored) {
      const studentObj = JSON.parse(stored);
      setStudent(studentObj);
      fetchJob();
      fetchStudentMeta(studentObj._id);
    } else {
      navigate("/login/student");
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
      setJob(res.data.job);
    } catch (err) {
      console.error("Failed to fetch job:", err);
      alert("Unable to load job details");
    }
  };

  const fetchStudentMeta = async (studentId) => {
    try {
      const [appliedRes, bookmarkRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/student/${studentId}/applications`),
        axios.get(`http://localhost:5000/api/students/${studentId}/bookmarks`)
      ]);

      const appliedIds = appliedRes.data.applications.map(a => a.job?._id);
      const bookmarkIds = bookmarkRes.data.bookmarks.map(b => b._id);

      setApplied(appliedIds.includes(id));
      setBookmarked(bookmarkIds.includes(id));
    } catch (err) {
      console.error("Meta fetch failed", err);
    }
  };

  const handleApply = async () => {
    if (!student) return alert("Please login as student to apply");
    try {
      const res = await axios.post(`http://localhost:5000/api/jobs/${id}/apply`, {
        studentId: student._id,
      });
      alert(res.data.message || "Applied successfully");
      setApplied(true);
    } catch (err) {
      console.error("Apply error:", err);
      alert("Failed to apply");
    }
  };

  const handleBookmark = async () => {
    if (!student) return alert("Please login as student to bookmark");
    try {
      const res = await axios.post(`http://localhost:5000/api/jobs/${id}/bookmark`, {
        studentId: student._id,
      });
      alert(res.data.message || "Bookmarked successfully");
      setBookmarked(true);
    } catch (err) {
      console.error("Bookmark error:", err);
      alert("Failed to bookmark");
    }
  };

  if (!job) return <Typography>Loading...</Typography>;

  return (
    <Box p={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>{job.title}</Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Company: {job.companyName || job.recruiterId?.companyName || "N/A"}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body1" sx={{ mb: 2 }}>{job.description}</Typography>
        <Typography variant="body2">Location: {job.location}</Typography>
        <Typography variant="body2">Salary: {job.salary}</Typography>
        <Typography variant="body2">Eligibility: {job.eligibility}</Typography>
        <Typography variant="body2">Recruiter: {job.recruiterId?.name || "N/A"}</Typography>

        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="body2">Required Skills:</Typography>
          {job.skillsrequired && job.skillsrequired.split(',').map((skill, i) => (
            <Chip key={i} label={skill.trim()} sx={{ m: 0.5 }} />
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          {bookmarked ? (
            <Chip label="Bookmarked" variant="outlined" />
          ) : (
            <Button variant="outlined" onClick={handleBookmark}>Bookmark</Button>
          )}

          {applied ? (
            <Chip label="Applied" color="success" />
          ) : (
            <Button variant="contained" onClick={handleApply}>Apply</Button>
          )}

          <Button variant="text" color="secondary" onClick={() => navigate(-1)}>Back</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default JobDetails;
