const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    //email id of the user
    email: {
        type: String,
        required: true
    },

    //password of the user
    password: {
        type: String,
        required: true
    },

    //name of the user
    name: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema); //modelling the schema
module.exports = User;