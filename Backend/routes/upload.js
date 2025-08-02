const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Student = require("../models/Student");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/upload/:type/:id", upload.single("file"), async (req, res) => {
  const { type, id } = req.params;
  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  try {
    const update = {};
    update[type] = fileUrl;

    const student = await Student.findByIdAndUpdate(id, update, { new: true });
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    res.json({ success: true, url: fileUrl, student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
