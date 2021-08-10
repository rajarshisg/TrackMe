const mongoose = require('mongoose');

const habitSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },

    creation_date : {
        type : String,
        required : true
    },

    dates : [
        {
            completed : {
                type : String,
                default : 'pending',
                enum : ['done', 'not-done', 'pending']
            },

            date : {
                type : String
            }
        }
    ],

    favourite : {
        type : Boolean,
        default : false
    }
});

const Habit = mongoose.model('Habit', habitSchema);
module.exports = Habit;