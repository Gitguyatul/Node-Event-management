const Event = require('../models/eventModel');
const Booking = require('../models/Bookings');
const nodemailer = require('nodemailer');

// 1. Get all events with pagination
exports.getAllEvents = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const events = await Event.find()
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const count = await Event.countDocuments();
        res.json({ total: count, page, limit, events });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. Get event by ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.searchFilterEvents = async (req, res) => {
    const { date, title } = req.query;
    let query = {};

    if (title) {
        query.title = { $regex: title, $options: 'i' }; // Case-insensitive search
    }

    if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    try {
        const events = await Event.find(query);
        if (events.length === 0) {
            return res.status(404).json({ message: "No events found for the given criteria." });
        }
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 4. Get available dates for an event in the current month
exports.getAvailableDates = async (req, res) => {
    const eventId = req.params.id;
    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const bookings = await Booking.find({ eventId }).select('bookedDate');
        const bookedDates = bookings.map(b => b.bookedDate.toISOString().split('T')[0]);

        const currentMonth = new Date().getMonth();
        const availableDates = [event.date].filter(d => d.getMonth() === currentMonth && !bookedDates.includes(d.toISOString().split('T')[0]));
        res.json({ availableDates });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 5. Get booked dates for an event
exports.getBookedDates = async (req, res) => {
    const eventId = req.params.id;
    try {
        const bookings = await Booking.find({ eventId });
        const bookedDates = bookings.map(b => b.bookedDate);
        res.json({ bookedDates });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 6. Book an event (with inactive event check)
exports.bookEvent = async (req, res) => {
    const { eventId, userEmail, date } = req.body;
    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.status === 'inactive') {
            return res.status(400).json({ message: 'This event is inactive and cannot be booked.' });
        }

        const existingBooking = await Booking.findOne({ eventId, bookedDate: new Date(date) });
        if (existingBooking) return res.status(400).json({ message: 'Date already booked' });

        const booking = new Booking({ eventId, userEmail, bookedDate: new Date(date) });
        await booking.save();

        // Send confirmation email after booking
        await exports.sendConfirmationMail(userEmail, eventId, date);

        res.json({ message: 'Booking confirmed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 7. Send confirmation mail function
exports.sendConfirmationMail = async (email, eventId, date) => {
    const event = await Event.findById(eventId);

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Event Booking Confirmation',
        text: `Your booking for event "${event.title}" on ${date} has been confirmed.`,
    };

    await transporter.sendMail(mailOptions);
};
