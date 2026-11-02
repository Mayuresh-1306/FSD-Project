const mongoose = require("mongoose");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

// POST /api/registrations
async function createRegistration(req, res, next) {
  try {
    const { eventId } = req.body;
    if (typeof eventId !== "string" || !mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: "A valid eventId is required" });
    }
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    try {
      const registration = await Registration.create({ user: req.user._id, event: event._id });
      await registration.populate([
        { path: "event", select: "title description date time location" },
        { path: "user", select: "name email" },
      ]);
      return res.status(201).json({ message: "Registered for event successfully", registration });
    } catch (error) {
      if (error.code === 11000) return res.status(409).json({ message: "You are already registered for this event" });
      throw error;
    }
  } catch (error) { next(error); }
}

// GET /api/registrations/me
async function getMyRegistrations(req, res, next) {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate("event", "title description date time location")
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ registrations });
  } catch (error) { next(error); }
}

// DELETE /api/registrations/:id — users can cancel their own registration only.
async function cancelRegistration(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid registration ID" });
    const registration = await Registration.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!registration) return res.status(404).json({ message: "Registration not found for this user" });
    res.status(200).json({ message: "Registration cancelled successfully" });
  } catch (error) { next(error); }
}

// GET /api/registrations — admin only at route level.
async function getAllRegistrations(req, res, next) {
  try {
    const registrations = await Registration.find()
      .populate("user", "name email role")
      .populate("event", "title description date time location")
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ registrations });
  } catch (error) { next(error); }
}

module.exports = { createRegistration, getMyRegistrations, cancelRegistration, getAllRegistrations };
