const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/habit')
    }
    req.flash('success', 'You\'ve landed on TrackMe\'s website!');
    return res.render('authenticate');
});

router.use('/users', require('./user'));
router.use('/habit', require('./habit'));

module.exports = router;