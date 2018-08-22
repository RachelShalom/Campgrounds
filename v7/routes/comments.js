var express = require('express'),
    router = express.Router(),
    Camp = require('../models/campground.js'),
    User = require('../models/user.js'),
    Comment = require('../models/comments.js'),
    middlewareObj = require("../middleware/index.js");
//================================================================================================================
// These are the routes for commnets
//================================================================================================================

//NEW: presenting a form for a new comment
router.get("/campGrounds/:id/comments/new", middlewareObj.isLoggedIn, function(req, res) {
    var campId = req.params.id;
    Camp.findById(campId, function(err, camp) {
        if (err) {
            req.flash("error", "Oops something went wrong");
            console.log(err);
        }
        else {
            res.render("comments/newComment", { camp: camp });

        }


    })

})

//CREATE: add a new comment to the db
router.post("/campGrounds/:id/comments", middlewareObj.isLoggedIn, function(req, res) {
    var comment = req.body.comment;

    var newComment = { text: comment };
    Camp.findById(req.params.id, function(err, currentCamp) {
        if (err) {
            req.flash("error", "You don't have permission to do that");
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
                    req.flash("success", "succeessfully added comment");
                    res.redirect("/campGrounds/" + currentCamp._id);
                }

            });

        }
    });
});
//EDIT: GET-SHOW THE EDIT FORM OF A PRTICULAR COMMENT
router.get("/campGrounds/:id/comments/:comment_id/edit", middlewareObj.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        res.render("comments/editComment.ejs", { campId: req.params.id, comment: foundComment })
    });
});
//UPDATE: PUT- UPDATING THE EDITED COMMENT AND REDIRECT SOMWHERE

router.put("/campGrounds/:id/comments/:comment_id", middlewareObj.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        console.log("req.body.comment= " + req.body.comment);
        if (err) {
            console.log("ERROR " + err);
            res.redirect("back");
        }
        else {
            res.redirect("/campGrounds/" + req.params.id);
        }
    });
});
//DESTROY: DELETE- A PARTICULAR COMMENT THEN REDIRECT SOMEWHERE

router.delete("/campGrounds/:id/comments/:comment_id", middlewareObj.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err, comment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        }
        else {
            req.flash("success", "succeessfully deleted comment");
            res.redirect("/campGrounds/" + req.params.id);
        }
    });
});


module.exports = router;
