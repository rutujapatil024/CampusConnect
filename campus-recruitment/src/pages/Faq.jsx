import React from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Faq.css";

const faqs = [
  {
    question: "How do I register and start applying?",
    answer: "Simply create a student account, complete your profile, and start applying to job vacancies with just one click.",
  },
  {
    question: "What makes me eligible to apply for a job?",
    answer: "Eligibility is automatically checked based on your CGPA, branch, and skills listed in your profile.",
  },
  {
    question: "I forgot my password. What should I do?",
    answer: "Click the 'Forgot Password' option on the login page. You’ll receive a reset link on your registered email.",
  },
  {
    question: "Can I apply to companies outside of my campus?",
    answer: "Off-campus applications are allowed only if your TPO has enabled them for your institute.",
  },
  {
    question: "Will I get notified about interviews or shortlisting?",
    answer: "Yes, you'll receive email notifications whenever you're shortlisted or an interview is scheduled.",
  },
];


const Faq = () => {
  return (
    <Box className="faq-container">
      <Typography variant="h4" className="faq-title">
        Frequently Asked Questions
      </Typography>
      {faqs.map((item, index) => (
        <Accordion key={index} className="faq-accordion">
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`faq-${index}`}>
            <Typography className="faq-question">{item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className="faq-answer">{item.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default Faq;
