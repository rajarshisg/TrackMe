const express = require('express');
const passport = require('passport');
const router = express.Router();

const habitController = require('../controller/habit_controller');
router.get('/', passport.checkAuthentication, habitController.home);
router.get('/weekly', passport.checkAuthentication, habitController.weekly);
router.get('/daily', passport.checkAuthentication, habitController.daily);
router.post('/create-habit', passport.checkAuthentication, habitController.createHabit);
router.get('/delete-habit:id', passport.checkAuthentication, habitController.deleteHabit);
router.get('/toggle', passport.checkAuthentication, habitController.toggleHabit);
router.get('/detailed/:id', passport.checkAuthentication, habitController.getHabit);
router.get('/toggle-favourite/:id', passport.checkAuthentication, habitController.toggleHabitFavourite);
router.get('/favourites', passport.checkAuthentication, habitController.getFavourites);
module.exports = router;