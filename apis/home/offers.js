const express = require('express');
const router = express.Router();
const mongo = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
	destination:function(req, file, cb){
		cb(null, './offers_images');
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

const offerschema = require('../../model/offer');

router.get('/',(req,res,next) => {
	offerschema.find({}).exec().then(result =>{
		// console.log({message:result});
		res.status(200).json({result:result});
	}).catch(err => {
		res.status(400).json({message:'Something went Wrong'});
	});
});


router.post('/add_offers',upload.single('Image'),(req,res) => {
	console.log(req.file);
	const offer = offerschema({
		_id: new mongo.Types.ObjectId,
		offername:req.body.offername,
		Image:req.file.path,
	});
	offer.save().then(result =>{
		console.log(result);
	}).catch(err => {
		console.log(err);
	});

	res.send(offer);
});
module.exports=router;