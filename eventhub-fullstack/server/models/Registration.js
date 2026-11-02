const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
}, { timestamps: true });

// One registration per user/event pair. Cancellation deletes this document,
// so the user can register for the same event again later if desired.
registrationSchema.index({ user: 1, event: 1 }, { unique: true });
registrationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Registration", registrationSchema);
