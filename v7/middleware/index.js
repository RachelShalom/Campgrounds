var middlewareObj = {},
     Camp = require('../models/campground.js'),
     Comment = require('../models/comments.js');
middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {

     // if user is authenticated in the session, carry on 
     if (req.isAuthenticated()) {
          return next();
     }
     // if they aren't redirect them to the home page
     req.flash("error", "You have to be logged in to do that");
     res.redirect('/login');
}


middlewareObj.checkCampOwnership = function checkCampOwnership(req, res, next) {
     //Is the user logged in
     if (req.isAuthenticated()) {
          Camp.findById(req.params.id, function(err, foundCamp) {
               console.log("userId: " + req.user._id);
               console.log("foundCampUseId: " + foundCamp.author.id);
               //otherwise - tell the user to login
               if (err) {
                    req.flash("error", "Camp was not found");
                    res.redirect("back");
               }
               else {
                    //if yes- check that this user owns the camp
                    if (foundCamp.author.id.equals(req.user._id)) {
                         //if yes then let the user edit
                         next(); // next will go to the next code in the route
                    }
                    else {
                         req.flash("error", "You don't have permission to do that");
                         //otherwise send the user to log in 
                         res.redirect("back");
                    }
               }
          });
     }
     else {
          res.redirect("back");
     }

}

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next) {
     //if the user is loggedIn then check the comment id
     if (req.isAuthenticated()) {
          Comment.findById(req.params.comment_id, function(err, foundComment) {
               if (err) {
                    res.redirect("back");
               }
               else {
                    if (foundComment.author.id.equals(req.user._id)) {
                         next();
                    }
                    else {
                         req.flash("error", "You don't have permission to do that");
                         res.redirect("back");
                    }
               }
          });
     }
     else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
     }
}


module.exports = middlewareObj;
