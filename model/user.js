const mongo = require('mongoose');

const user = mongo.Schema({
	_id:mongo.Schema.Types.ObjectId,
	name:String,
	email:{type:String, unique:true,required:true},
	phone:{type:String, unique:true,required:true},
	ispartner:{type:Boolean,default:false},
	isartist:{type:Boolean,default:false},
	otp:{type:String,required:true},
});

const myDB = mongo.connection.useDb('user');//db name

const userchema = myDB.model('user',user);//collection name

module.exports=userchema;
