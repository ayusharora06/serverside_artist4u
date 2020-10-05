const mongo = require('mongoose');

const artistType = mongo.Schema({
	_id:mongo.Schema.Types.ObjectId,
	artistType:String,
	Image:{type:String, required: true}
});

const myDB = mongo.connection.useDb('artistType');

const artistTypeSchema = myDB.model('artisttype',artistType);

module.exports=artistTypeSchema;
