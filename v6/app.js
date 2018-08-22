var express = require("express"),
     app = express(),
     bodyParser = require("body-parser"),
     mongoose = require("mongoose"),
     User = require("./models/user.js"),
     passport = require("passport"),
     localStrategy = require("passport-local"),
     PassportLocalMongoose = require('passport-local-mongoose'),
     Camp = require("./models/campground.js"),
     Comment = require("./models/comments.js"),
     seedDB = require("./seeds"),
     commentRoutes = require('./routes/comments.js'),
     campgroundsRoutes = require('./routes/campgrounds.js'),
     authRoutes = require('./routes/auth.js');

//seedDB(); //seed the DB
mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//serve static pages
app.use(express.static(__dirname + "/public"));

//===============================
//passport configuration
//===============================
// use static serialize and deserialize of model for passport session support
app.use(require("express-session")({
     secret: "this is mine",
     resave: false,
     saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(commentRoutes);
app.use(campgroundsRoutes);
app.use(authRoutes);
// use static authenticate method of model in LocalStrategy
passport.use(new localStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.listen(process.env.PORT, process.env.IP, function() {
     console.log("Yay:-) the server is ON:-)");
});
