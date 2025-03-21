const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  date: { type: Date, required: true },   
});

module.exports = mongoose.model("Event", eventSchema);
