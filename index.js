const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session'); //used in session cookie needed by passport
const passport = require('passport'); //passport authentication
const passportLocal = require('./config/passport-local-strategy'); //passport local strategy
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMWare = require('./config/middleware');



app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(expressLayouts); //app uses express-ejs-layouts
app.set('layout extractStyles', true); //extract styles from subpages into layout.ejs file
app.set('layout extractScripts', true); //extract scripts from subpages into layout.ejs file

let mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost/habittracker_development';
app.use(session({
    name : 'connecti', //cookie name
    secret : '2s5v8y/B?D(G+KbPeShVmYq3t6w9z$C&', //encryption key
    saveUninitialized: false, //when user is not logged in no data is saved in cookie
    resave: false, //we do not want to rewrite session cookie if it is not changed
    cookie: {
        maxAge : (1000*60*60*3) //age of the cookie in miliseconds --> 3 hours
    },
    store : MongoStore.create(
        {
            mongoUrl : mongoUrl
        },
    )
}));
app.use(passport.initialize()); //app uses passport
app.use(passport.session()); //for maintaining passport session
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMWare.setFlash);

app.use('/', require('./routes/index'));

app.listen(port, function(err){
    if(err) { 
        console.log(`Error occured in running the server :: ${err}`); 
        return;
    }
    console.log(`Server is up and running on port ${port}!`);
});