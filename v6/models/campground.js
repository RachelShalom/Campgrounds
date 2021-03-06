var mongoose = require("mongoose");
//define a schema'
var campSchema = mongoose.Schema({
     name: "String",
     image: "String",
     description: "String",
     comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
     author: { id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, username: String }
});
//model the schema
var Camp = mongoose.model("Camp", campSchema);
module.exports = Camp;
