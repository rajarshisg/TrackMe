const Habit = require('../models/habit'); //habits model
const moment = require('moment'); //used to handle dates

//rendering the home page
module.exports.home = async function (req, res) {
    let habits = await Habit.find({ user: req.user._id }); //fetching all the habits associated with the logged in user

    /*---------Calculating Streak, Completion % and pushing new dates for each habit------------*/
    let d = new Date();
    var currDate = moment(d.getDate() + "/" + (d.getMonth() + 1) +  "/" + d.getFullYear(), 'DD/MM/YYYY'); //todays date
    let countCompleted = new Array();
    let streak = new Array();
    for (habit of habits) {
        var lastDate = moment(habit.dates[habit.dates.length - 1].date, 'DD/MM/YYYY'); //the last date that was added to the habit
        var numDays = currDate.diff(lastDate,'days'); //diff between last added date and todays date
        currDate.add(-numDays, 'days');
        //adding remaining dates
        while (numDays > 0) {
            //pushing the new date
            habit.dates.push({ completed: 'pending', date: currDate.format('DD/MM/YYYY') });
            //updating curr date
            currDate.add(+1, 'days');
            numDays--;
        }
        habit.save(); //saving

        //finding streak, completed days
        let count = 0, maxLength = 0, currLength = 0;
        for (let i = 0; i < habit.dates.length; i++) {
            if (habit.dates[i].completed === 'done') {
                count++;
                currLength++;
                if (maxLength <= currLength) {
                    maxLength = currLength;
                }
            } else {
                currLength = 0;
            }
        }
        countCompleted.push(count); //total number of completed days for the given habit
        streak.push(maxLength); //highest streak for the given habit
    }

    //rendering the page
    return res.render('habit_index', {
        user_name: req.user.name,
        habits: habits,
        completedLength: countCompleted,
        streak: streak,
        
    });
}

//this shows the weekly view
module.exports.weekly = async function (req, res) {
    let habits = await Habit.find({ user: req.user._id }); //finding the habits belonging to the logged in user
    let dates = new Array();

    //finding the last 7 days
    for(let habit of habits) {
        for(let i = habit.dates.length - 1; i>= habit.dates.length - 7 ; i--) {
            dates.push(moment(habit.dates[i].date, 'DD/MM/YYYY').format('DD MMM'));
        }
    }

    //rendering the
    return res.render('habit_weekly', {
        user_name: req.user.name,
        habits: habits,
        dates: dates
    });
}


//route for creating a new habit
module.exports.createHabit = async function (req, res) {
    let date = new Date();
    var newDate = moment(date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(), "DD/MM/YYYY");
    var creationDate = newDate.format("DD/MM/YYYY");

    let dates = new Array();
    newDate.add(-6, 'days');

    //adding the last 7 days
    for (let i = 6; i >= 0; i--) {
        var lastDateString = newDate.format('DD/MM/YYYY');
        dates.push({ completed: 'pending', date: lastDateString });
        newDate = newDate.add(+1, 'days');
    }

    //creating the habit
    const habit = await Habit.create({
        name: req.body.name,
        user: req.user._id,
        creation_date: creationDate,
        dates: dates
    });

    return res.redirect('back');
}

//deletes the particular habit
module.exports.deleteHabit = async function (req, res) {
    await Habit.findByIdAndDelete(req.params.id);
    return res.redirect('back');
}

//toggles a habit as marked/unmarkes/not-done
module.exports.toggleHabit = async function (req, res) {
    let habit = await Habit.findById(req.query.habit);
    habit.dates[req.query.index].completed = req.query.value;
    habit.save();
    req.flash('success', 'Habit Updated!')
    return res.redirect('back');
}

//toggling a habit as favourite/unfavourite
module.exports.toggleHabitFavourite = async function (req, res) {
    let habit = await Habit.findById(req.params.id);

    if (habit.favourite == false) {
        habit.favourite = true;
        req.flash('success', 'Marked as Favourite!');
    } else {
        habit.favourite = false;
        req.flash('success', 'Removed from Favourite!');
    }
    habit.save();
    return res.redirect('back');
}

/* This fetches all the favourite habits and deisplays them, all the functionalities inside
   are exaclty similar to home function (the first function) 
*/
module.exports.getFavourites = async function (req, res) {
    let habits = await Habit.find({ user: req.user._id, favourite: true }); //fetching the favourite habits for a user

    let d = new Date();
    var newDate = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
    let countCompleted = new Array();
    let streak = new Array();

    /*----Calculating the streak, completed days etc----*/
    for (habit of habits) {
        let count = 0, maxLength = 0, currLength = 0;
        for (let i = 0; i < habit.dates.length; i++) {
            if (habit.dates[i].completed === 'done') {
                count++;
                currLength++;
                if (maxLength <= currLength) {
                    maxLength = currLength;
                }
            } else {
                currLength = 0;
            }
        }
        countCompleted.push(count);
        streak.push(maxLength);
    }

    //rendering the page
    return res.render('habit_index', {
        user_name: req.user.name,
        habits: habits,
        completedLength: countCompleted,
        streak: streak,
    });
}