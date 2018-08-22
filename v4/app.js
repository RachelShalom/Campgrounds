var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Camp = require("./models/campground.js");
var Comment = require("./models/comments.js");
var seedDB = require("./seeds");
seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))
//serve static pages
app.use(express.static(__dirname + "/public"));

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
app.get("/campGrounds/:id/comments/new", function(req, res) {
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



app.listen(process.env.PORT, process.env.IP, function() {
     console.log("Yay:-) the server is ON:-)");
});
