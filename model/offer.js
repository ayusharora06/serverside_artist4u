const mongo = require('mongoose');

const offer = mongo.Schema({
	_id:mongo.Schema.Types.ObjectId,
	offername:String,
	Image:{type:String, required: true}
});

const myDB = mongo.connection.useDb('offer');

const offerschema = myDB.model('offer',offer);

module.exports=offerschema;
