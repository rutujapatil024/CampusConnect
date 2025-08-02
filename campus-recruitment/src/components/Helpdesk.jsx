import React, { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Helpdesk.css";

const Helpdesk = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send form to backend or email service
    alert("Your message has been submitted. We’ll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  const faqs = [
    {
      question: "How do I apply for a job?",
      answer: "Go to the Jobs section, find a job you like, and click 'Apply'.",
    },
    {
      question: "Can I edit my resume after submitting it?",
      answer: "Yes, go to your profile and upload an updated resume anytime.",
    },
    {
      question: "How can a recruiter contact me?",
      answer: "Recruiters can message you directly if you’ve applied to their job.",
    },
    {
      question: "I forgot my password. What should I do?",
      answer: "Click 'Forgot Password' on the login page to reset it.",
    },
  ];

  return (
    <Box className="helpdesk-container">
      <Typography variant="h4" align="center" gutterBottom>
        Helpdesk & Support
      </Typography>

      <Grid container spacing={4}>
        {/* FAQs */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Frequently Asked Questions
          </Typography>
          {faqs.map((faq, i) => (
            <Accordion key={i}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography><strong>{faq.question}</strong></Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="contact-form">
            <Typography variant="h6" gutterBottom>
              Submit a Query
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Your Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Your Message"
                name="message"
                multiline
                rows={4}
                value={form.message}
                onChange={handleChange}
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Submit
              </Button>
            </form>
          </Paper>

          {/* Contact Info */}
          <Box mt={4}>
            <Typography variant="h6">Contact Info</Typography>
            <Typography>Email: support@placementportal.com</Typography>
            <Typography>Phone: +91-9876543210</Typography>
            <Typography>Office Hours: Mon–Fri, 10 AM – 6 PM</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Helpdesk;
