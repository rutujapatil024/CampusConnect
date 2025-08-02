const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: { type: String, unique: true },
  rollNo: String,
  degree: String,
  branch: String,
  dob: String,
  resume: String,
  address: String,
  skills: String,
  projectLink: String,
  achievements: String,
  profilePhoto: String,
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  }],
  appliedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  }]
}, { timestamps: true });

// 🔐 Hash password before save
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Student", studentSchema);
