const express = require('express');
const router = express.Router();
const mongo = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const checkAuth = require('../../middleware/check-auth');

const storage = multer.diskStorage({
	destination:function(req, file, cb){
		const path = './artist_type_images/';
		fs.mkdirSync(path, { recursive: true });
		return cb(null, path);
	},
	filename:function(req, file, cb){
		cb(null, file.originalname);
	}
});

const fileFilter = (req, file, cb)=>{
	if (file.mimetype === 'image/jpeg' || file.mimetype ==='image/jpg' || file.mimetype === 'image/png'){
		cb(null, true);
	}else{
		cb(new Error('Invalid file type'), false);
	}
};

const upload = multer({
	storage:storage,
	limits:{
		fieldSize:1024 * 1024 * 5
	},
	fileFilter:fileFilter
});
const artistType = require('../../model/artistType');

router.get('/',(req,res,next) => {
	// artistType.find({artistType:'Actors'})
	// .exec(function(err,result){
	// 	if(err){
	// 		console.log(err);
	// 	}else{
	// 		console.log(result);
	// 	}
	// });
	artistType.find({}).exec().then(result =>{
		console.log({message:result});
		res.status(200).json({result:result});
	}).catch(err => {
		console.log(err);
	});
});

router.post('/add_artistType',checkAuth,upload.single('Image'),(req,res) => {
	console.log(req.file);
	const bio = artistType({
		_id: new mongo.Types.ObjectId,
		artistType:req.body.artistType,
		Image:req.file.path,
	});
	bio.save().then(result =>{
		console.log(result);
	}).catch(err => {
		console.log(err);
	});

	res.send(bio);
});
module.exports=router;