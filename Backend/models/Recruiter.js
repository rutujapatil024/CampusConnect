const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const recruiterSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  companyName: String,
  designation: String,
  website: String,
  address: String,
}, { timestamps: true });

// 🔐 Hash password before save
recruiterSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Recruiter", recruiterSchema);
