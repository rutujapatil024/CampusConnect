// MyBookmarks.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Button, Paper, Divider } from "@mui/material";
import "./MyBookmarks.css";

const MyBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("studentInfo");
    if (!stored) return;
    const parsed = JSON.parse(stored);
    setStudent(parsed);
    fetchBookmarks(parsed._id);
  }, []);

  const fetchBookmarks = async (studentId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/students/${studentId}/bookmarks`);
      setBookmarks(res.data.bookmarks);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    }
  };

  const handleRemoveBookmark = async (jobId) => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${student._id}/bookmarks/${jobId}`);
      setBookmarks(bookmarks.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error("Error removing bookmark:", err);
    }
  };

  return (
    <Box className="bookmarks-container">
      <Typography variant="h4" className="bookmark-title">My Bookmarked Jobs</Typography>
      <Divider sx={{ my: 2 }} />

      {bookmarks.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          You haven't bookmarked any jobs yet.
        </Typography>
      ) : (
        bookmarks.map((job) => (
          <Paper key={job._id} className="bookmark-card">
            <Typography variant="h6">{job.title}</Typography>
            <Typography variant="body2" color="textSecondary">{job.description}</Typography>
            <Typography variant="body2">Location: {job.location}</Typography>
            <Typography variant="body2">Skills: {job.skillsrequired}</Typography>
            <Box className="bookmark-actions">
              <Button variant="outlined" size="small" href={`/job/${job._id}`}>View</Button>
              <Button variant="outlined" color="error" size="small" onClick={() => handleRemoveBookmark(job._id)}>Remove</Button>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default MyBookmarks;
