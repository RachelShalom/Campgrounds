var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))

//serve static pages
app.use(express.static("public"));
var campgrounds = [{ name: "Mizpe Ramon", image: "https://images.pexels.com/photos/116104/pexels-photo-116104.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb" },
     { name: "Golan", image: "https://images.pexels.com/photos/6757/feet-morning-adventure-camping.jpg?w=1260&h=750&auto=compress&cs=tinysrgb" },
     { name: "Center", image: "https://images.pexels.com/photos/190910/pexels-photo-190910.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb" },
     { name: "Golan", image: "https://images.pexels.com/photos/6757/feet-morning-adventure-camping.jpg?w=1260&h=750&auto=compress&cs=tinysrgb" },
     { name: "Center", image: "https://images.pexels.com/photos/190910/pexels-photo-190910.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb" },
     { name: "Golan", image: "https://images.pexels.com/photos/6757/feet-morning-adventure-camping.jpg?w=1260&h=750&auto=compress&cs=tinysrgb" },
     { name: "Center", image: "https://images.pexels.com/photos/190910/pexels-photo-190910.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb" },
     { name: "Golan", image: "https://images.pexels.com/photos/6757/feet-morning-adventure-camping.jpg?w=1260&h=750&auto=compress&cs=tinysrgb" },
     { name: "Center", image: "https://images.pexels.com/photos/190910/pexels-photo-190910.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb" }
]
app.get("/", function(req, res) {
     res.render("landing");
})
app.get("/campgrounds", function(req, res) {
     res.render("campGrounds", { campgrounds: campgrounds });
})

app.get("/campgrounds/new", function(req, res) {
     res.render("newCamp");
})

app.post("/campgrounds", function(req, res) {
     console.log(req.body);
     var name = req.body.name;
     var image = req.body.image;
     var newCamp = { name: name, image: image };
     campgrounds.push(newCamp);
     res.redirect("/campgrounds")
})


app.listen(process.env.PORT, process.env.IP, function() {
     console.log("Yay:-) the server is ON:-)");
});
