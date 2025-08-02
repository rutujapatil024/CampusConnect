import React from "react";
import { Box, Typography, Grid, Paper, Link } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import "./Resources.css";

const resources = {
  students: [
    {
      title: "Resume Template (Word)",
      url: "/assets/resume-template.docx",
    },
    {
      title: "Aptitude Prep Guide (PDF)",
      url: "/assets/aptitude-guide.pdf",
    },
    {
      title: "Mock Interview Platforms",
      url: "https://www.pramp.com/",
      external: true,
    },
    {
      title: "Job Hunt Checklist",
      url: "/assets/job-hunt-checklist.pdf",
    },
  ],
  recruiters: [
    {
      title: "Recruitment Policy (PDF)",
      url: "/assets/recruitment-policy.pdf",
    },
    {
      title: "Campus Hiring Guide",
      url: "/assets/hiring-guide.pdf",
    },
    {
      title: "Company Registration Form",
      url: "/register/recruiter",
      external: false,
    },
  ],
  incharges: [
    {
      title: "Placement Handbook",
      url: "/assets/placement-handbook.pdf",
    },
    {
      title: "Student Management Portal",
      url: "/incharge/dashboard",
    },
    {
      title: "Job Posting Instructions",
      url: "/assets/job-posting-guide.pdf",
    },
  ],
};

const Section = ({ title, icon, items }) => (
  <Box className="resource-section">
    <Typography variant="h6" className="resource-heading">
      {icon} {title}
    </Typography>
    <ul className="resource-list">
      {items.map((item, index) => (
        <li key={index}>
          <Link
            href={item.url}
            target={item.external ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="resource-link"
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  </Box>
);

const Resources = () => {
  return (
    <Box className="resources-container">
      <Typography variant="h4" align="center" gutterBottom>
        📚 Resources & Downloads
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} className="resource-card">
            <Section
              title="For Students"
              icon={<SchoolIcon sx={{ verticalAlign: "middle" }} />}
              items={resources.students}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} className="resource-card">
            <Section
              title="For Recruiters"
              icon={<WorkIcon sx={{ verticalAlign: "middle" }} />}
              items={resources.recruiters}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} className="resource-card">
            <Section
              title="For Incharges"
              icon={<SupervisorAccountIcon sx={{ verticalAlign: "middle" }} />}
              items={resources.incharges}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Resources;
