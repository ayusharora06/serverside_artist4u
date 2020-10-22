const mongo = require('mongoose');

const user = mongo.Schema({
	_id:mongo.Schema.Types.ObjectId,//
	name:String,//
	artistid:{type:String,default:""},
	artisttype:{type:String,default:""},
	partnerid:{type:String,default:""},
	email:{type:String, unique:true,required:true},
	phone:{type:String, unique:true,required:true},
	ispartner:{type:Boolean,default:false},
	isartist:{type:Boolean,default:false},
	otp:{type:String,default:""},
	mybookings:[Object]
});

const myDB = mongo.connection.useDb('user');//db name

const userchema = myDB.model('user',user);//collection name

module.exports=userchema;
