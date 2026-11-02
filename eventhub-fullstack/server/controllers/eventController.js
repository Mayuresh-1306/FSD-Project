const mongoose = require("mongoose");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

function validObjectId(id) { return mongoose.isValidObjectId(id); }
function validateEventInput(body) {
  const fields = ["title", "description", "date", "time", "location"];
  for (const field of fields) {
    if (typeof body[field] !== "string" || !body[field].trim()) return `${field} is required`;
  }
  if (body.title.trim().length > 150) return "Title must be 150 characters or fewer";
  if (body.description.trim().length > 3000) return "Description must be 3000 characters or fewer";
  if (body.location.trim().length > 200) return "Location must be 200 characters or fewer";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date.trim()) || Number.isNaN(Date.parse(`${body.date.trim()}T00:00:00.000Z`))) return "Date must be a valid YYYY-MM-DD date";
  const parsedDate = new Date(`${body.date.trim()}T00:00:00.000Z`);
  if (parsedDate.toISOString().slice(0, 10) !== body.date.trim()) return "Date must be a valid YYYY-MM-DD date";
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(body.time.trim())) return "Time must use HH:MM format";
  return null;
}
function eventPayload(body) {
  return {
    title: body.title.trim(),
    description: body.description.trim(),
    date: new Date(`${body.date.trim()}T00:00:00.000Z`),
    time: body.time.trim(),
    location: body.location.trim(),
  };
}
function escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

// GET /api/events?search=&location=&dateFrom=&dateTo=
async function getEvents(req, res, next) {
  try {
    const { search = "", location = "", dateFrom = "", dateTo = "" } = req.query;
    const filter = {};
    if (typeof search === "string" && search.trim()) {
      const pattern = new RegExp(escapeRegex(search.trim()), "i");
      filter.$or = [{ title: pattern }, { description: pattern }];
    }
    if (typeof location === "string" && location.trim()) filter.location = new RegExp(`^${escapeRegex(location.trim())}$`, "i");

    if (dateFrom || dateTo) {
      const range = {};
      const isValidDateOnly = (value) => {
        if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
        const parsed = new Date(`${value}T00:00:00.000Z`);
        return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
      };
      if (dateFrom && !isValidDateOnly(dateFrom)) {
        return res.status(400).json({ message: "dateFrom must use a valid YYYY-MM-DD date" });
      }
      if (dateTo && !isValidDateOnly(dateTo)) {
        return res.status(400).json({ message: "dateTo must use a valid YYYY-MM-DD date" });
      }
      if (dateFrom && dateTo && dateFrom > dateTo) return res.status(400).json({ message: "dateFrom must be on or before dateTo" });
      if (dateFrom) range.$gte = new Date(`${dateFrom}T00:00:00.000Z`);
      if (dateTo) range.$lte = new Date(`${dateTo}T23:59:59.999Z`);
      filter.date = range;
    }

    const events = await Event.find(filter).sort({ date: 1, createdAt: -1 }).lean();
    res.status(200).json(events);
  } catch (error) { next(error); }
}

async function getEventById(req, res, next) {
  try {
    if (!validObjectId(req.params.id)) return res.status(400).json({ message: "Invalid event ID" });
    const event = await Event.findById(req.params.id).lean();
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) { next(error); }
}

async function createEvent(req, res, next) {
  try {
    const validationError = validateEventInput(req.body);
    if (validationError) return res.status(400).json({ message: validationError });
    const event = await Event.create({ ...eventPayload(req.body), createdBy: req.user._id });
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) { next(error); }
}

async function updateEvent(req, res, next) {
  try {
    if (!validObjectId(req.params.id)) return res.status(400).json({ message: "Invalid event ID" });
    const validationError = validateEventInput(req.body);
    if (validationError) return res.status(400).json({ message: validationError });
    const event = await Event.findByIdAndUpdate(req.params.id, eventPayload(req.body), { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) { next(error); }
}

async function deleteEvent(req, res, next) {
  try {
    if (!validObjectId(req.params.id)) return res.status(400).json({ message: "Invalid event ID" });
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    // Avoid dangling registration references after an event is deleted.
    await Registration.deleteMany({ event: event._id });
    res.status(200).json({ message: "Event deleted successfully", event });
  } catch (error) { next(error); }
}

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
