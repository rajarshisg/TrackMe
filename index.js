const express = require('express'); //requiring express
const cookieParser = require('cookie-parser'); //cookie parser for session cookies
const app = express(); //app has all the properties of express
const port = process.env.PORT || 8000; //port number
const expressLayouts = require('express-ejs-layouts'); //express layouts
const db = require('./config/mongoose'); //mongodb config file
const session = require('express-session'); //used in session cookie needed by passport
const passport = require('passport'); //passport authentication
const passportLocal = require('./config/passport-local-strategy'); //passport local strategy
const MongoStore = require('connect-mongo'); //for storing session cookies
const flash = require('connect-flash'); //flash messages
const customMWare = require('./config/middleware'); //flash middleware
const moment = require('moment');



app.use(express.urlencoded()); //for parsing form data
app.use(cookieParser()); //cookie parser
app.use(express.static('./assets')); //settig up statics
app.set('view engine', 'ejs'); //setting up view engine
app.set('views', './views'); //setting the views
app.use(expressLayouts); //app uses express-ejs-layouts
app.set('layout extractStyles', true); //extract styles from subpages into layout.ejs file
app.set('layout extractScripts', true); //extract scripts from subpages into layout.ejs file

let mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost/habittracker_development'; //mongodb url
//session cookie
app.use(session({
    name: 'connecti', //cookie name
    secret: '2s5v8y/B?D(G+KbPeShVmYq3t6w9z$C&', //encryption key
    saveUninitialized: false, //when user is not logged in no data is saved in cookie
    resave: false, //we do not want to rewrite session cookie if it is not changed
    cookie: {
        maxAge: (1000 * 60 * 60 * 3) //age of the cookie in miliseconds --> 3 hours
    },
    store: MongoStore.create(
        {
            mongoUrl: mongoUrl
        },
    )
}));
app.use(passport.initialize()); //app uses passport
app.use(passport.session()); //for maintaining passport session
app.use(passport.setAuthenticatedUser); //setting the current user to locals

app.use(flash()); //flash messages
app.use(customMWare.setFlash); //curstom middleware

app.use('/', require('./routes/index')); //setting up routes

//server is running on this port
app.listen(port, function (err) {
    if (err) {
        console.log(`Error occured in running the server :: ${err}`);
        return;
    }
    console.log(`Server is up and running on port ${port}!`);
});