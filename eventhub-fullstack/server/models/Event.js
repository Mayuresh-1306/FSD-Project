const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Event title is required"], trim: true, maxlength: 150 },
  description: { type: String, required: [true, "Event description is required"], trim: true, maxlength: 3000 },
  date: { type: Date, required: [true, "Event date is required"] },
  time: { type: String, required: [true, "Event time is required"], trim: true, match: [/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Time must use HH:MM format"] },
  location: { type: String, required: [true, "Event location is required"], trim: true, maxlength: 200 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

eventSchema.index({ date: 1 });
eventSchema.index({ location: 1, date: 1 });
eventSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Event", eventSchema);
