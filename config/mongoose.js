const mongoose = require('mongoose');
let mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost/habittracker_development';
mongoose.connect(mongoUrl);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error occured in connecting to MongoDB!'));

db.once('open', function(){
    console.log('Successfully connected to MongoDB!');
});

module.exports = db;