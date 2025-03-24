const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { 
    getAllEvents, 
    getEventById, 
    searchFilterEvents, 
    getAvailableDates, 
    getBookedDates, 
    bookEvent, 
    sendConfirmationMail 
  } = require("../controllers/userController");
  

router.get('/events', userController.getAllEvents);
router.get('/events/:id', userController.getEventById);
router.get('/search-events', userController.searchFilterEvents);
router.get('/available-dates/:id', userController.getAvailableDates);
router.get('/booked-dates/:id', userController.getBookedDates);
router.post('/book-event', userController.bookEvent);
router.get('/search-filter-events', searchFilterEvents);

module.exports = router;
