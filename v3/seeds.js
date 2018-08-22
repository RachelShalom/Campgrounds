var mongoose = require("mongoose");
var Camp = require("./models/campground.js");
var Comment = require("./models/comments.js");
var data = [{
          name: "Best Camp in the north",
          image: "https://source.unsplash.com/zQgsdQvj1IM",
          description: "bla bla bla bla"
     },
     {
          name: "Best Camp in the east",
          image: "https://source.unsplash.com/tRGwX1HcTd4",
          description: "bla bla bla bla"
     },
     {
          name: "Best Camp in the south",
          image: "https://source.unsplash.com/1azAjl8FTnU",
          description: "bla bla bla bla"
     }
]
//remove all camps
function seedDB() {
     Camp.remove({}, function(err) {
          if (err) {
               console.log(err);
          }
          else {
               console.log("camps have been removed");
          }
          //Add a few Campgrounds
          data.forEach(function(seed) {
               Camp.create(seed, function(err, campground) {
                    if (err) {
                         console.log(err);
                    }
                    else {
                         console.log("created the camp: " + campground.name);
                         //create a comment
                         Comment.create({ text: "This is my very smart comment about the camp", author: "rachel Shalom" }, function(err, comment) {
                              if (err) {
                                   console.log(err);
                              }
                              else {
                                   campground.comments.push(comment);
                                   campground.save();
                                   console.log("created comment");

                              }
                         })
                    }
               });
          });

     })

}



//Add a few comments


module.exports = seedDB;
