const express = require('express');
const router = express.Router();

//routes to authentication page / habits page based on whetehr user is signed in or not
router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/habit')
    }
    return res.render('authenticate');
});

//routes to users
router.use('/users', require('./user'));
//routes to habit
router.use('/habit', require('./habit'));

module.exports = router;