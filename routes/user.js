const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controller/user_controller'); //user controller

//route for sign up
router.get('/sign-up', userController.signUp);
//route for sign in
router.get('/sign-in', userController.signIn);
//route for creating new user
router.post('/create-user', userController.createUser);
//route for creating session
router.post('/create-session', passport.authenticate(
    'local',
    { failureRedirect: 'sign-in' },
), userController.createSession);
//route for destroying session
router.get('/destroy-session', userController.destroySession);
module.exports = router;