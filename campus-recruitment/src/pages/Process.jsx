import React from "react";
import "./Process.css";
import { Typography, Box } from "@mui/material";
import handshake from "../assets/handshake.png"; // Replace with your image path

const steps = [
  {
    number: "1",
    title: "Complete your profile",
    description: "Complete your profile in order to apply for job applications.",
  },
  {
    number: "2",
    title: "Find Job Posts / Apply using your Profile",
    description: "Use 'Browse Vacancies' page to search for job posts. Apply using one single click by auto importing your filled data in profile.",
  },
  {
    number: "3",
    title: "Fill Additional Form Details (If any)",
    description: "Using your profile, fill additional details in the form (if any) that is required apart from the pre-filled application form.",
  },
  {
    number: "4",
    title: "Submit your Application",
    description: "After filling all the required details, submit your application.",
  },
  {
    number: "5",
    title: "Wait for the response from the company",
    description: "Wait for the company to review your application and respond accordingly.",
  }
];

const Process = () => {
  return (
    <Box className="process-container">
      <Box className="process-image">
        <img src={handshake} alt="Handshake" />
      </Box>
      <Box className="process-steps">
        <Typography variant="h4" className="process-title">
          Application Process
        </Typography>
        <Typography variant="h6" className="process-subtitle">
          Step By Step Procedure :
        </Typography>
        {steps.map((step) => (
          <Box key={step.number} className="step-box">
            <span className="step-number">{step.number}</span>
            <Box>
              <Typography className="step-title">{step.title}</Typography>
              <Typography className="step-desc">{step.description}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Process;
