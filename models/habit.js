const mongoose = require('mongoose');

const habitSchema = mongoose.Schema({
    //name of the habit
    name: {
        type: String,
        required: true
    },

    //user to whom it belongs
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    //creation date of the habit
    creation_date: {
        type: String,
        required: true
    },

    //array of dates for the habit
    dates: [
        {
            //habit is completed/not completed/unmarked on that day
            completed: {
                type: String,
                default: 'pending',
                enum: ['done', 'not-done', 'pending']
            },

            //the date
            date: {
                type: String
            }
        }
    ],

    //marking the habit as favourite
    favourite: {
        type: Boolean,
        default: false
    }
});

const Habit = mongoose.model('Habit', habitSchema); //modelling the schema
module.exports = Habit;