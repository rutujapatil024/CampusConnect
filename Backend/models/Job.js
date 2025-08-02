const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  companyName: String,
  location: String,
  salary: String,
  eligibility: String,
  skillsrequired: String,
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recruiter",
  },
  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
