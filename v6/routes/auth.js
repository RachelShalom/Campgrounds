var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require("../models/user.js");
//==================================================================
//Register .Login and Logout routes
//===================================================================

//show register form 
router.get("/register", function(req, res) {

     res.render("register", { currentUser: req.user });
})

//handle register logic

router.post("/register", function(req, res) {
     console.log(req.body);
     // Creates and saves a new user with a salt and hashed password
     console.log(req.body.username);
     console.log(req.body.password);

     User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
          if (err) {
               console.log(err);
               return res.render('register', { currentUser: req.user });
          }
          else {
               passport.authenticate('local')(req, res, function() {
                    res.redirect('/campgrounds');
               });
          }
     });
});

//Show login form

router.get("/login", function(req, res) {
     res.render("login", { currentUser: req.user });
})

//handle log in form 
router.post("/login", passport.authenticate("local", {
     successRedirect: "/campgrounds",
     failureRedirect: "/login"
}), function(req, res) {});


//handle logout

router.get("/logout", function(req, res) {
     //here passport is destroying all the user data in this session
     //it is no longer keeping track of this user data from request to request
     req.logout();
     res.redirect('/');
});

module.exports = router;
