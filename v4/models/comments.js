var mongoose = require("mongoose");
var schema = mongoose.Schema({ text: String, author: String });
var Comment = mongoose.model("Comment", schema);

module.exports = Comment;
