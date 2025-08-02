const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Student = require("../models/Student");
const Recruiter = require("../models/Recruiter");
const Incharge = require("../models/Incharge");
const Job = require("../models/Job");
const Application = require("../models/Application");

const JWT_SECRET = process.env.JWT_SECRET;

// 🔐 Register
router.post("/register", async (req, res) => {
  const { role, password, ...rest } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let savedUser;

    if (role === "student") {
      savedUser = await new Student({ ...rest, password: hashedPassword }).save();
    } else if (role === "recruiter") {
      savedUser = await new Recruiter({ ...rest, password: hashedPassword }).save();
    } else if (role === "incharge") {
      savedUser = await new Incharge({ ...rest, password: hashedPassword }).save();
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    res.status(201).json({ message: "Registered successfully", user: savedUser });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// 🔐 Login
router.post("/login/:role", async (req, res) => {
  const { role } = req.params;
  const { email, password } = req.body;

  const Model = { student: Student, recruiter: Recruiter, incharge: Incharge }[role];
  if (!Model) return res.status(400).json({ message: "Invalid role" });

  try {
    const user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: "3h" });
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// 📄 Student Profile
router.get("/student/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/student/:id", async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Student not found" });
    res.json({ success: true, student: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📄 Recruiter Profile
router.put("/recruiter/:id", async (req, res) => {
  try {
    const updated = await Recruiter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Recruiter not found" });
    res.json({ success: true, recruiter: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📦 All Lists
router.get("/students", async (_, res) => {
  try {
    const students = await Student.find();
    res.json({ students });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch students", error: err.message });
  }
});

router.get("/recruiters", async (_, res) => {
  try {
    const recruiters = await Recruiter.find();
    res.json({ recruiters });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recruiters", error: err.message });
  }
});

router.get("/jobs", async (_, res) => {
  try {
    const jobs = await Job.find();
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
});

// ✅ Fully populated applications
router.get("/applications", async (_, res) => {
  try {
    const applications = await Application.find()
      .populate("student")
      .populate("job");
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications", error: err.message });
  }
});

// 📥 Applications by Student
router.get("/student/:studentId/applications", async (req, res) => {
  try {
    const applications = await Application.find({ student: req.params.studentId })
      .populate("job");
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch student applications" });
  }
});

// ✏️ Update Application Status
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
    res.status(500).json({ message: "Failed to update application", error: err.message });
  }
});

// 📋 Applicants by Recruiter
router.get("/recruiter/:id/applicants", async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.params.id });
    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("student")
      .populate("job");

    res.json({ success: true, applicants: applications });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applicants", error: err.message });
  }
});

// 📋 Applicants for Specific Job
router.get("/jobs/:id/applicants", async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.id })
      .populate("student")
      .populate("job");

    res.json({ success: true, applicants: applications });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applicants", error: err.message });
  }
});

module.exports = router;
