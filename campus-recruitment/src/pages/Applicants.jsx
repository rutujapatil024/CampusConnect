// Applicants.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import ChatModal from "../components/ChatModal"; // Import ChatModal component
import "./Applicants.css";

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const recruiter = JSON.parse(localStorage.getItem("recruiterInfo"));
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [chatOpen, setChatOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    if (!recruiter) return navigate("/login/recruiter");
    fetchApplicants();
  }, [recruiter]);

  const fetchApplicants = async () => {
    try {
      const url = jobId
        ? `http://localhost:5000/api/jobs/${jobId}/applicants`
        : `http://localhost:5000/api/recruiter/${recruiter._id}/applicants`;

      const res = await axios.get(url);
      setApplicants(res.data.applicants || []);
    } catch (err) {
      console.error("Failed to fetch applicants:", err);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        { status }
      );

      if (response.data.success) {
        const updatedList = applicants.map((app) =>
          app._id === applicationId ? { ...app, status } : app
        );
        setApplicants(updatedList);
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const openChatWithStudent = (studentId) => {
    setSelectedStudentId(studentId);
    setChatOpen(true);
  };

  return (
    <Box className="applicants-container">
      <Typography variant="h4" className="applicants-title">
        Job Applicants
      </Typography>
      <Divider sx={{ my: 2 }} />
      {applicants.length === 0 ? (
        <Typography>No applicants to show.</Typography>
      ) : (
        applicants.map((app, i) => (
          <Paper key={i} className="applicant-card">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">{app.student?.name}</Typography>
                <Typography variant="body2">Email: {app.student?.email}</Typography>
                <Typography variant="body2">Phone: {app.student?.phone}</Typography>
                <Typography variant="body2">Skills: {app.student?.skills}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Applied For: {app.job?.title}</Typography>
                <Typography variant="body2">Status: {app.status}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  href={app.student?.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 1, mr: 1 }}
                >
                  View Resume
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{ mt: 1, mr: 1 }}
                  onClick={() => updateStatus(app._id, "shortlisted")}
                >
                  Shortlist
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => updateStatus(app._id, "rejected")}
                >
                  Reject
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1, ml: 1 }}
                  onClick={() => openChatWithStudent(app.student?._id)}
                >
                  Send Message
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ))
      )}
      <ChatModal
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        senderId={recruiter?._id}
        receiverId={selectedStudentId}
        senderType="recruiter"
      />
    </Box>
  );
};

export default Applicants;
