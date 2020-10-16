const mongo = require('mongoose');

const artistbioSchema = mongo.Schema({
	_id:mongo.Schema.Types.ObjectId,
	// userid:{type:String, unique:true,required:true},
	name:String,
	profile:Object,
	artist_type:String,
	experience:String,
	gallery:[Object],
	gender:String,
	dateofbirth:String,
	phonenumber:String,
	email:String,
	street:String,
	city:String,
	state:String,
	country:String,
	typesofshow:[String],
	specialization:[String],
	languagepreffered:[String],
	minhours:String,
	maxhours:String,
	description:String,
	team:String,
	outstationtravel:String,
	unifiedprice:String,
	price:String,
	differentprices:{type:[Object],default:null},
	idproof:Object,
	accountholdername:String,
	accountnumber:String,
	IFSC:String,
	agreed:String,
	//bank detail
	recommended:String,
	peopleschoice:String,
	mybookings:[Object],
});

const myDB = mongo.connection.useDb('artistBio');

const singer = myDB.model('singers',artistbioSchema);
const actor = myDB.model('actors',artistbioSchema);
const dancer = myDB.model('dancers',artistbioSchema);
const standup_comedy = myDB.model('standup_comedys',artistbioSchema);
const magician = myDB.model('magicians',artistbioSchema);
const clown = myDB.model('clowns',artistbioSchema);

module.exports={'singer':singer, 'actor':actor, 'dancer':dancer, 'standup_comedy':standup_comedy, 'magician':magician, 'clown':clown}
