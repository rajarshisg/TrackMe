const Habit = require('../models/habit');

module.exports.home = async function (req, res) {
    let habits = await Habit.find({ user: req.user._id });
    let d = new Date();
    var currDate = new Date(d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear());
    let countCompleted = new Array();
    let streak = new Array();
    for (habit of habits) {
        var lastDate = new Date(habit.dates[habit.dates.length - 1].date);
        var numDays = (currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);

        while(numDays > 0) {
            habit.dates.push({ completed: 'pending', date: currDate });
            currDate.setDate(currDate.getDate() - 1);             
            numDays--;
        }
    
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
    let habitNames = new Array();
    for(let i=0;i<habits.length;i++){
        habitNames.push(habits[i].name);
    }
    return res.render('habit_index', {
        user_name: req.user.name,
        habits: habits,
        completedLength: countCompleted,
        streak: streak,
        habitNames: habitNames
    });
}

module.exports.weekly = async function (req, res) {
    let habits = await Habit.find({ user: req.user._id });
    let monthsArray = new Array();
    let datesArray = new Array();
    var date = new Date();
    let getMonth = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    for (let i = 0; i < 7; i++) {
        var last = new Date(date.getTime() - (i * 24 * 60 * 60 * 1000));
        var day = last.getDate();
        var month = getMonth[last.getMonth()];
        datesArray.push(day);
        monthsArray.push(month);
    }
    let countCompleted = new Array();
    for(let i=0;i<habits.length;i++){
        let count = 0;
        for(let j=habits[i].dates.length-1;j>=habits[i].dates.length - 7;j--){
            if(habits[i].dates[j].completed==='done'){
                count++;
            }
        }
        countCompleted.push(count);
    }

    return res.render('habit_weekly', {
        user_name: req.user.name,
        habits: habits,
        dates: datesArray,
        months: monthsArray,
        countCompleted: countCompleted
    });
}

module.exports.daily = function (req, res) {
    return res.redirect('habit_daily', {
        user_name: req.user.name
    });
}

module.exports.createHabit = async function (req, res) {
    let date = new Date();
    var newDate = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
    let dates = new Array();
    for (let i = 6; i >= 0; i--) {
        var lastDate = new Date(date.getTime() - (i * 24 * 60 * 60 * 1000));
        var lastDateString = lastDate.getMonth() + "/" + lastDate.getDate() + "/" + lastDate.getFullYear();
        dates.push({ completed: 'pending', date: lastDateString });
    }
    const habit = await Habit.create({
        name: req.body.name,
        user: req.user._id,
        creation_date: newDate,
        dates: dates
    });

    return res.redirect('back');
}

module.exports.deleteHabit = async function (req, res) {
    await Habit.findByIdAndDelete(req.params.id);
    return res.redirect('back');
}

module.exports.toggleHabit = async function (req, res) {
    let habit = await Habit.findById(req.query.habit);
    console.log(req.params.index);
    habit.dates[req.query.index].completed = req.query.value;
    habit.save();
    req.flash('success', 'Habit Updated!')
    return res.redirect('back');
}

module.exports.getHabit = async function (req, res) {
    let habit = await Habit.findById(req.params.id);
    let monthsArray = new Array();
    let datesArray = new Array();
    var date = new Date();
    let percentageTillNow = new Array();
    let countCompleted = 0, countDays = 1;
    for(let date of habit.dates.reverse()){
        if(date.completed === 'done'){
            countCompleted++;
        }
        let val = countCompleted * 100 / countDays;
        console.log(val);
        percentageTillNow.push(val);
        countDays++;
    }
    let getMonth = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    for (let i = 0; i < 7; i++) {
        var last = new Date(date.getTime() - (i * 24 * 60 * 60 * 1000));
        var day = last.getDate();
        var month = getMonth[last.getMonth()];
        datesArray.push(day);
        monthsArray.push(month);
    }
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

    return res.render('habit_detailed', {
        user_name: req.user.name,
        habit : habit,
        countCompleted : count,
        streak : maxLength,
        dates : datesArray,
        months : monthsArray,
        percentageTillNow : percentageTillNow
    })

}

module.exports.toggleHabitFavourite = async function(req, res) {
    let habit = await Habit.findById(req.params.id);

    if(habit.favourite == false) {
        habit.favourite = true;
        req.flash('success', 'Marked as Favourite!');
    }else {
        habit.favourite = false;
        req.flash('success', 'Removed from Favourite!');
    }
    habit.save();
    return res.redirect('back');
}

module.exports.getFavourites = async function (req, res) {
    let habits = await Habit.find({ user: req.user._id, favourite : true });
    let d = new Date();
    var newDate = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
    let countCompleted = new Array();
    let streak = new Array();
    for (habit of habits) {
        if (habit.dates[habit.dates.length - 1].date !== newDate) {
            habit.dates.push({ completed: 'pending', date: newDate });
        }
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
    let habitNames = new Array();
    for(let i=0;i<habits.length;i++){
        habitNames.push(habits[i].name);
    }
    return res.render('habit_index', {
        user_name: req.user.name,
        habits: habits,
        completedLength: countCompleted,
        streak: streak,
        habitNames: habitNames
    });
}