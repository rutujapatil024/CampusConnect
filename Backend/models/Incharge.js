// models/incharge.js
const mongoose = require("mongoose");

const inchargeSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  institute: String,
  department: String,
  designation: String,
  phone: String,
  alternateEmail: String,
  address: String,
}, { timestamps: true });

module.exports = mongoose.model("Incharge", inchargeSchema);
