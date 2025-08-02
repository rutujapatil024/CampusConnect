// routes/job.js
const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Student = require("../models/Student");
const Application = require("../models/Application");

// POST new job
router.post("/jobs", async (req, res) => {
  try {
    const job = new Job(req.body);
    const saved = await job.save();
    res.status(201).json({ success: true, job: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all jobs by recruiter
router.get("/jobs/recruiter/:id", async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.params.id });
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// EDIT job
router.put("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE job
router.delete("/jobs/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET job by ID
router.get("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all jobs
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /jobs/:id/apply
router.post("/jobs/:id/apply", async (req, res) => {
  try {
    const jobId = req.params.id;
    const { studentId } = req.body;

    if (!studentId) return res.status(400).json({ success: false, message: "Missing studentId" });

    const existing = await Application.findOne({ job: jobId, student: studentId });
    if (existing) return res.status(400).json({ success: false, message: "Already applied" });

    const application = await Application.create({ job: jobId, student: studentId });
    await Job.findByIdAndUpdate(jobId, { $addToSet: { applicants: studentId } });

    res.json({ success: true, message: "Applied successfully", application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /applications/:id/status
router.put("/applications/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["applied", "shortlisted", "rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updated = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Application not found" });

    res.json({ success: true, application: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET applications by student ID
router.get("/student/:id/applications", async (req, res) => {
  try {
    const applications = await Application.find({ student: req.params.id }).populate("job");
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /jobs/:id/bookmark
router.post("/jobs/:id/bookmark", async (req, res) => {
  try {
    const jobId = req.params.id;
    const { studentId } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    if (!Array.isArray(student.bookmarks)) student.bookmarks = [];

    if (student.bookmarks.includes(jobId)) {
      return res.status(400).json({ success: false, message: "Already bookmarked" });
    }

    student.bookmarks.push(jobId);
    await student.save();

    res.json({ success: true, message: "Bookmarked successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all bookmarked jobs
router.get("/students/:id/bookmarks", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("bookmarks");
    res.json({ bookmarks: student.bookmarks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE bookmark
router.delete("/students/:id/bookmarks/:jobId", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    student.bookmarks = student.bookmarks.filter(id => id.toString() !== req.params.jobId);
    await student.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all applications
router.get("/applications", async (req, res) => {
  try {
    const applications = await Application.find().populate("student").populate("job");
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET recruiter applicants
router.get("/recruiter/:id/applicants", async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.params.id });
    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("student")
      .populate("job");

    res.json({ success: true, applicants: applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET applicants for specific job
router.get("/jobs/:id/applicants", async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.id })
      .populate("student")
      .populate("job");

    res.json({ success: true, applicants: applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
