const express = require('express');
const passport = require('passport');
const router = express.Router();
const habitController = require('../controller/habit_controller'); //habit controller

//home page route
router.get('/', passport.checkAuthentication, habitController.home);
//weekly view route
router.get('/weekly', passport.checkAuthentication, habitController.weekly);
//route to create a habit
router.post('/create-habit', passport.checkAuthentication, habitController.createHabit);
//route to delete a habit
router.get('/delete-habit:id', passport.checkAuthentication, habitController.deleteHabit);
//route to toggle a habit mark/unmark etc
router.get('/toggle', passport.checkAuthentication, habitController.toggleHabit);
//route to toggle a habit has favourite/unfavourite
router.get('/toggle-favourite/:id', passport.checkAuthentication, habitController.toggleHabitFavourite);
//route for fetching all the favourites
router.get('/favourites', passport.checkAuthentication, habitController.getFavourites);


module.exports = router;