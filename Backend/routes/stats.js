const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Job = require("../models/Job");
const Recruiter = require("../models/Recruiter");
const Application = require("../models/Application");

router.get("/stats", async (req, res) => {
  try {
    const students = await Student.countDocuments();
    const recruiters = await Recruiter.countDocuments();
    const jobs = await Job.countDocuments();
    const applications = await Application.countDocuments({ status: "shortlisted" }); // or "placed" if available

    res.json({ students, recruiters, jobs, applications });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats", error: err.message });
  }
});

module.exports = router;
