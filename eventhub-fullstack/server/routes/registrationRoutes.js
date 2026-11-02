const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { createRegistration, getMyRegistrations, cancelRegistration, getAllRegistrations } = require("../controllers/registrationController");

router.use(protect);
router.get("/me", getMyRegistrations);
router.get("/", adminOnly, getAllRegistrations);
router.post("/", createRegistration);
router.delete("/:id", cancelRegistration);

module.exports = router;
