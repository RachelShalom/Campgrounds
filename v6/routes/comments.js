var express = require('express'),
    router = express.Router(),
    Camp = require('../models/campground.js'),
    User = require('../models/user.js'),
    Comment = require('../models/comments.js');
//================================================================================================================
// These are the routes for commnets
//================================================================================================================

//NEW: presenting a form for a new comment
router.get("/campGrounds/:id/comments/new", isLoggedIn, function(req, res) {
    var campId = req.params.id;
    Camp.findById(campId, function(err, camp) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/newComment", { camp: camp, currentUser: req.user });

        }


    })

})

//CREATE: add a new comment to the db
router.post("/campGrounds/:id/comments", isLoggedIn, function(req, res) {
    var comment = req.body.comment;

    var newComment = { text: comment };
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
                    //add username and ID to comment and then save comment
                    console.log(req.user);
                    currentComment.author.id = req.user._id;
                    currentComment.author.username = req.user.username;
                    currentComment.save();
                    currentCamp.comments.push(currentComment);
                    currentCamp.save();
                    res.redirect("/campGrounds/" + currentCamp._id);
                }

            })

        }
    })


})
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}

module.exports = router;
