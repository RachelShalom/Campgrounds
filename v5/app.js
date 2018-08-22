var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var User = require("./models/user.js");
var passport = require("passport");
var localStrategy = require("passport-local");
var PassportLocalMongoose = require('passport-local-mongoose');

var Camp = require("./models/campground.js");
var Comment = require("./models/comments.js");
var seedDB = require("./seeds");

seedDB();
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
// use static authenticate method of model in LocalStrategy
passport.use(new localStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {
     res.redirect("/campgrounds");
})
//INDEX ROUTE
app.get("/campgrounds", function(req, res) {
     Camp.find({}, function(err, allCamps) {
          //this is where we retrieve all camps from the database and send that data to be rendered
          if (err) {
               console.log(err);
          }
          else {
               res.render("camps/index", { campgrounds: allCamps });
          }
     })

})
// NEW: display a form to create a new camp
app.get("/campgrounds/new", function(req, res) {
     res.render("camps/newCamp");
})
//CREATE: add a new Camp to the DB
app.post("/campgrounds", function(req, res) {
     console.log(req.body);
     var name = req.body.name;
     var image = req.body.image;
     var desc = req.body.description;
     var newCamp = { name: name, image: image, description: desc };
     //here we create and save the new recieved camp from the user
     Camp.create(newCamp, function(err, camp) {
          if (err) {
               console.log(err)
          }
          else {
               res.redirect("/campgrounds");
          }
     })
})

//SHOW: GET info about one Camp
app.get("/campGrounds/:id", function(req, res) {
     var id = req.params.id;
     console.log(id);
     //find campground with a provided id
     var currentCamp = Camp.findById(id).populate('comments').exec(function(err, currentCamp) {
          if (err) {
               console.log(err)
          }
          else {
               //render this camp to show.ejs file
               res.render("camps/show", { camp: currentCamp });
          }
     });

})

//================================================================================================================
// These are the routes for commnets
//================================================================================================================

//NEW: presenting a form for a new comment
app.get("/campGrounds/:id/comments/new", isLoggedIn, function(req, res) {
     var campId = req.params.id;
     Camp.findById(campId, function(err, camp) {
          if (err) {
               console.log(err);
          }
          else {
               res.render("comments/newComment", { camp: camp });

          }


     })

})

//CREATE: add a new comment to the db
app.post("/campGrounds/:id/comments", function(req, res) {
     var author = req.body.author;
     var comment = req.body.comment;
     var newComment = { text: comment, author: author };
     Camp.findById(req.params.id, function(err, currentCamp) {
          if (err) {
               console.log(err);
          }
          else {
               Comment.create(newComment, function(err, currentComment) {
                    if (err) {
                         console.log(err)
                    }
                    else {
                         currentCamp.comments.push(currentComment);
                         currentCamp.save();
                         res.redirect("/campGrounds/" + currentCamp._id);
                    }

               })

          }
     })


})

//==================================================================
//Register .Login and Logout routes
//===================================================================

//show register form 
app.get("/register", function(req, res) {

     res.render("register");
})

//handle register logic

app.post("/register", function(req, res) {
     console.log(req.body);
     // Creates and saves a new user with a salt and hashed password
     console.log(req.body.username);
     console.log(req.body.password);

     User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
          if (err) {
               console.log(err);
               return res.render('register');
          }
          else {
               passport.authenticate('local')(req, res, function() {
                    res.redirect('/campgrounds');
               });
          }
     });
});

//Show login form

app.get("/login", function(req, res) {
     res.render("login");
})

//handle log in form 
app.post("/login", passport.authenticate("local", {
     successRedirect: "/campgrounds",
     failureRedirect: "/login"
}), function(req, res) {});


//handle logout

app.get("/logout", function(req, res) {
     //here passport is destroying all the user data in this session
     //it is no longer keeping track of this user data from request to request
     req.logout();
     res.redirect('/');
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

     // if user is authenticated in the session, carry on 
     if (req.isAuthenticated())
          return next();

     // if they aren't redirect them to the home page
     res.redirect('/login');
}




app.listen(process.env.PORT, process.env.IP, function() {
     console.log("Yay:-) the server is ON:-)");
});
