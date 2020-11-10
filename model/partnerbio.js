const mongo = require('mongoose');

const partnerbioSchema = mongo.Schema({
	_id:mongo.Schema.Types.ObjectId,
	userid:{type:String, unique:true,required:true},
	name:String,
	profile:Object,
	idproof:Object,
	phonenumber:{type:String, unique:true,required:true},
	email:{type:String, unique:true,required:true},
	website:{type:String, unique:true},
	street:String,
	city:String,
	state:String,
	country:String,
	description:String,
	accountholdername:String,
	accountnumber:String,
	IFSC:String,
	agreed:String,
	mybookings:[Object],
	// refercode:{type:String,index: { expires: '1m' },}
});

const myDB = mongo.connection.useDb('partner');

const partner = myDB.model('partnerbio',partnerbioSchema);

module.exports=partner;