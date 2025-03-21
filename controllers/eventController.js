const Event = require("../models/eventModel");


/// Add event - Model....  


exports.addEvent = async (req, res) => {
  try {
    const { title, description, location, date, status } = req.body;

    const newEvent = await Event.create({
      title,
      description,
      location,
      date,
      status,
    });

    res.status(201).json({ message: "Event created successfully", newEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

///Delete Event Feature.....


exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    console.log(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/// Update Event Feature.......


exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ message: "Event updated successfully", updatedEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Get Events with pagination & filter
exports.getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;

    const filter = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    const events = await Event.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ date: -1 });

    const total = await Event.countDocuments(filter);

    res.status(200).json({
      events,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//// see all event
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find(); // Saare events le aa
    res.status(200).json({ events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


