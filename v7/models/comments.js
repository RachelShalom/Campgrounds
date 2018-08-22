var mongoose = require("mongoose");
var schema = mongoose.Schema({
     text: String,
     author: { id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, username: String }
});

var Comment = mongoose.model("Comment", schema);

module.exports = Comment;
