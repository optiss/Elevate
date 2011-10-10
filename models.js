var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;


var page_schema = new Schema({
	'title' 	: String,
	'created' 	: { type : Date, default : Date.now }
});

module.exports.Page = mongoose.model('Page', page_schema);
