import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Grid,
  TextField,
  Divider,
  Paper,
  Collapse
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import './StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [showProfile, setShowProfile] = useState(true);
  const [applications, setApplications] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("studentInfo");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setStudent(parsed);
        setFormData(parsed);
        fetchApplications(parsed._id);
        fetchBookmarks(parsed._id);
      } else {
        navigate("/login/student");
      }
    } catch (err) {
      console.error("Invalid JSON in localStorage:", err);
      localStorage.removeItem("studentInfo");
      navigate("/login/student");
    }
  }, [navigate]);

  const fetchApplications = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/student/${id}/applications`);
      const data = await res.json();
      if (data.success) setApplications(data.applications || []);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    }
  };

  const fetchBookmarks = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/students/${id}/bookmarks`);
      const data = await res.json();
      if (data.bookmarks) setBookmarks(data.bookmarks || []);
    } catch (err) {
      console.error("Failed to fetch bookmarks", err);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/student/${student._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        alert("Profile saved successfully!");
        setStudent(data.student);
        localStorage.setItem("studentInfo", JSON.stringify(data.student));
        setEditMode(false);
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      alert("Error saving profile");
      console.error(err);
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "resume" && file.type !== "application/pdf") {
      return alert("Only PDF resumes allowed");
    }
    if (type === "profilePhoto" && !["image/jpeg", "image/png"].includes(file.type)) {
      return alert("Only JPG or PNG profile photos allowed");
    }

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch(`http://localhost:5000/api/upload/${type}/${student._id}`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (data.success) {
        const updated = { ...formData, [type]: data.url };
        setFormData(updated);
        setStudent(updated);
        localStorage.setItem("studentInfo", JSON.stringify(updated));
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload error");
    }
  };

  return (
    <Box className="dashboard-container">
      <Typography variant="h4" className="dashboard-title">Welcome, {student.name}</Typography>
      <Typography variant="subtitle1" className="dashboard-email">{student.email}</Typography>

      <Button variant="outlined" color="error" onClick={() => {
        localStorage.removeItem("studentInfo");
        navigate("/login/student");
      }} className="logout-button">Logout</Button>

      <Divider sx={{ my: 3 }} />

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => setShowProfile(!showProfile)}
      >
        {showProfile ? "Hide My Profile" : "Show My Profile"}
      </Button>

      <Collapse in={showProfile}>
        <Paper elevation={3} className="profile-section">
          <Typography variant="h6">My Profile</Typography>
          <Grid container spacing={2} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Grid item xs={12} sm={3}>
              <Avatar
                src={formData.profilePhoto || ""}
                alt={student.name}
                sx={{ width: 80, height: 80 }}
              />
              <Button fullWidth size="small" sx={{ mt: 1 }} variant="outlined" component="label">
                Upload Photo
                <input
                  type="file"
                  hidden
                  accept="image/png, image/jpeg"
                  onChange={(e) => handleFileUpload(e, "profilePhoto")}
                />
              </Button>
            </Grid>

            <Grid item xs={12} sm={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth name="dob" label="Date of Birth" value={formData.dob || ''} onChange={handleChange} disabled={!editMode} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth name="phone" label="Phone Number" value={formData.phone || ''} onChange={handleChange} disabled={!editMode} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth name="address" label="Address" value={formData.address || ''} onChange={handleChange} disabled={!editMode} />
                </Grid>

                <Grid item xs={12}>
                  {formData.resume ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        {formData.resume.split("/").pop()}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        href={formData.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </Button>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">No resume uploaded yet.</Typography>
                  )}

                  <Button size="small" component="label" sx={{ mt: 1 }} variant="outlined">
                    Upload Resume (PDF)
                    <input
                      type="file"
                      hidden
                      accept="application/pdf"
                      onChange={(e) => handleFileUpload(e, "resume")}
                    />
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth name="projectLink" label="Project Link" value={formData.projectLink || ''} onChange={handleChange} disabled={!editMode} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth name="achievements" label="Achievements" value={formData.achievements || ''} onChange={handleChange} disabled={!editMode} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth name="skills" label="Skills" value={formData.skills || ''} onChange={handleChange} disabled={!editMode} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: "right", mt: 2 }}>
            {editMode ? (
              <Button variant="contained" onClick={handleSave}>Save</Button>
            ) : (
              <Button variant="outlined" onClick={() => setEditMode(true)}>Edit Profile</Button>
            )}
          </Box>
        </Paper>
      </Collapse>

      <Divider sx={{ my: 4 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper elevation={2} className="section-card" onClick={() => navigate("/vacancies")}>
            <Typography variant="h6">Browse Vacancies</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>Apply for your dream job here.</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} onClick={() => navigate("/applications")}>
          <Paper elevation={2} className="section-card">
            <Typography variant="h6">My Applications</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {applications.length === 0
                ? "You haven't applied to any jobs yet."
                : `You have applied to ${applications.length} job(s).`}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={2} className="section-card" onClick={() => navigate("/bookmarks")}>
            <Typography variant="h6">My Bookmarks</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {bookmarks.length === 0
                ? "No bookmarks yet."
                : `You have ${bookmarks.length} bookmarked job(s).`}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
