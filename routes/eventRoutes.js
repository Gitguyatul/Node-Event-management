const express = require("express");
const router = express.Router();
const eventController = require("../Node-Event-Management-System/controllers/eventController");
const adminAuth = require("../middleware/adminMiddleware");

// Admin Routes
router.post("/add-event", adminAuth, eventController.addEvent);
router.delete("/delete-event/:id", adminAuth, eventController.deleteEvent);
router.put("/update-event/:id", adminAuth, eventController.updateEvent);
router.get("/get-events", eventController.getEvents);
router.get("/all-events", eventController.getAllEvents);

module.exports = router;
