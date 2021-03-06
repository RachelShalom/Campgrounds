var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Camp = require("./models/campground.js");
var seedDB = require("./seeds");
seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))
//serve static pages
app.use(express.static("public"));

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
               res.render("index", { campgrounds: allCamps });
          }
     })

})
// NEW: display a form to create a new camp
app.get("/campgrounds/new", function(req, res) {
     res.render("newCamp");
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
               res.render("show", { camp: currentCamp });
          }
     });

})
app.listen(process.env.PORT, process.env.IP, function() {
     console.log("Yay:-) the server is ON:-)");
});
