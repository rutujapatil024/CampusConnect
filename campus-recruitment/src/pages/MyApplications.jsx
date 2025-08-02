import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChatModal from "../components/ChatModal";
import './MyApplications.css';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedRecruiterId, setSelectedRecruiterId] = useState(null);
  const student = JSON.parse(localStorage.getItem("studentInfo"));
  const navigate = useNavigate();

  useEffect(() => {
    if (student && student._id) {
      fetchApplications();
    }
  }, [student]);

  const fetchApplications = async () => {
    try {
      
      const res = await fetch(`http://localhost:5000/api/student/${student._id}/applications`);
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications || []);
      } else {
        console.error("Failed to fetch applications");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  const openChatWithRecruiter = (recruiterId) => {
    setSelectedRecruiterId(recruiterId);
    setChatOpen(true);
  };

  return (
    <Box className="applications-container">
      <Typography variant="h4" className="applications-title">My Applications</Typography>

      {applications.length > 0 ? (
        <Box className="applications-grid">
          {applications.map((app, index) => (
            <Paper key={index} className="application-card" elevation={3}
              onClick={() => navigate(`/job/${app.job?._id}`)}>
              <Typography variant="subtitle1">
                {app.job?.title || "Unknown Role"}
              </Typography>
              <Typography variant="body2"><strong>Company:</strong> {app.job?.companyName || "N/A"}</Typography>
              <Typography variant="body2"><strong>Status:</strong> {app.status || "Applied"}</Typography>
              <Typography variant="body2">
                <strong>Date Applied:</strong> {formatDate(app.appliedAt || app.createdAt)}
              </Typography>
              <Button variant="outlined" size="small" sx={{ mt: 1 }}
                onClick={(e) => { e.stopPropagation(); openChatWithRecruiter(app.job?.recruiterId); }}>
                Message Recruiter
              </Button>
            </Paper>
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary">
          You haven’t applied to any jobs yet.
        </Typography>
      )}

      <ChatModal open={chatOpen} onClose={() => setChatOpen(false)}
        senderId={student?._id} receiverId={selectedRecruiterId} senderType="student" />
    </Box>
  );
};

export default MyApplications;
