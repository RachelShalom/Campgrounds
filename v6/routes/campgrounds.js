var express = require('express'),
    router = express.Router(),
    Camp = require('../models/campground.js');

router.get("/", function(req, res) {
    res.redirect("/campgrounds");
});
//INDEX ROUTE
router.get("/campgrounds", function(req, res) {
    Camp.find({}, function(err, allCamps) {
        //this is where we retrieve all camps from the database and send that data to be rendered
        if (err) {
            console.log(err);
        }
        else {
            res.render("camps/index", { campgrounds: allCamps, currentUser: req.user });
        }
    })

});
// NEW: display a form to create a new camp
router.get("/campgrounds/new", isLoggedIn, function(req, res) {
    res.render("camps/newCamp", { currentUser: req.user });
});
//CREATE: add a new Camp to the DB
router.post("/campgrounds", isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCamp = { name: name, image: image, description: desc, author: { id: req.user._id, username: req.user.username } };
    //here we create and save the new recieved camp from the user
    Camp.create(newCamp, function(err, camp) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/campgrounds");
        }
    });
});

//SHOW: GET info about one Camp
router.get("/campGrounds/:id", function(req, res) {
    var id = req.params.id;
    //find campground with a provided id
    var currentCamp = Camp.findById(id).populate('comments').exec(function(err, currentCamp) {
        if (err) {
            console.log(err)
        }
        else {
            //render this camp to show.ejs file
            res.render("camps/show", { camp: currentCamp, currentUser: req.user });
        }
    });

});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}

module.exports = router;
