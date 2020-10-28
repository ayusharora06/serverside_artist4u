const mongo = require('mongoose');

const refercodeSchema = mongo.Schema({
	_id:mongo.Schema.Types.ObjectId,
	refercode:{type:String,unique:true},
	partnerid:String,
	createAt: {
		type: Date,
		default: Date.now(),
		index: { expires: 60*5}
	}
});

const myDB = mongo.connection.useDb('refercode');

const refercode = myDB.model('refercode',refercodeSchema);

module.exports=refercode;