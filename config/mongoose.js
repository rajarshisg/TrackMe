const mongoose = require('mongoose'); //requiring mongoose
let mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost/habittracker_development'; //mongodb url
mongoose.connect(mongoUrl); //connecting to mongodb url
const db = mongoose.connection; //acquiring the connection

//if error occured
db.on('error', console.error.bind(console, 'Error occured in connecting to MongoDB!'));

//if successfull
db.once('open', function () {
    console.log('Successfully connected to MongoDB!');
});

module.exports = db;