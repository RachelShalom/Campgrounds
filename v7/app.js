var express = require("express"),
     app = express(),
     bodyParser = require("body-parser"),
     methodOverride = require('method-override'),
     mongoose = require("mongoose"),
     flash = require('connect-flash'),
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
app.use(methodOverride('_method'));
app.use(flash());
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

// use static authenticate method of model in LocalStrategy
passport.use(new localStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this is to pass the var message to all pages
app.use(function(req, res, next) {
     res.locals.currentUser = req.user;
     res.locals.error = req.flash("error");
     res.locals.success = req.flash("success");

     next();
})

app.use(commentRoutes);
app.use(campgroundsRoutes);
app.use(authRoutes);
app.listen(process.env.PORT, process.env.IP, function() {
     console.log("Yay:-) the server is ON:-)");
});
