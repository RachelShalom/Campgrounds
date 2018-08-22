var express = require('express'),
    router = express.Router(),
    Camp = require('../models/campground.js'),
    middlewareObj = require("../middleware/index.js");

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
            res.render("camps/index", { campgrounds: allCamps, message: req.flash("error") });

        }
    })

});
// NEW: display a form to create a new camp
router.get("/campgrounds/new", middlewareObj.isLoggedIn, function(req, res) {
    res.render("camps/newCamp");
});
//CREATE: add a new Camp to the DB
router.post("/campgrounds", middlewareObj.isLoggedIn, function(req, res) {
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
router.get("/campgrounds/:id", function(req, res) {
    var id = req.params.id;
    //find campground with a provided id
    var currentCamp = Camp.findById(id).populate('comments').exec(function(err, currentCamp) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(req.user);
            //render this camp to show.ejs file
            res.render("camps/show", { camp: currentCamp });

        }
    });

});
//EDIT route a get resquest presenting a form 
router.get("/campgrounds/:id/edit", middlewareObj.checkCampOwnership, function(req, res) {
    Camp.findById(req.params.id, function(err, foundCamp) {
        //if yes then let the user edit
        res.render("camps/editCamp", { currentCamp: foundCamp });


    });
});

//DPDATE: //Update a particular camp and then redirect somwhere 
router.put("/campGrounds/:id", middlewareObj.checkCampOwnership, function(req, res) {
    Camp.findByIdAndUpdate(req.params.id, req.body.updatedCamp, function(err, camp) {
        if (err) {
            res.redirect("/campGrounds/" + req.params.id + "/edit");
        }
        else {
            res.redirect("/campGrounds/" + req.params.id);
        }
    })
})

//DESTROY  campground route 
router.delete("/campGrounds/:id", middlewareObj.checkCampOwnership, function(req, res) {
    Camp.findByIdAndRemove(req.params.id, function(err, camp) {
        if (err) {
            console.log(err);
            res.redirect("/campGrounds");
        }
        else {
            res.redirect("/campGrounds");
        }

    });
});

module.exports = router;
