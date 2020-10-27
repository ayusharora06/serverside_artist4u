const mongo = require('mongoose');

const refercodeSchema = mongo.Schema({
	_id:mongo.Schema.Types.ObjectId,
	refercode:String,
	partnerid:String,
	uniqueid:{type:String,unique:true},
	createAt: {
		type: Date,
		default: Date.now(),
		index: { expires: 60}
	}
});

const myDB = mongo.connection.useDb('refercode');

const refercode = myDB.model('refercode',refercodeSchema);

module.exports=refercode;