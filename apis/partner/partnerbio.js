const express = require('express');
const router = express.Router();
const mongo = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const userschema = require('../../model/user');
const partnerschema = require('../../model/partnerbio');
const checkAuth = require('../../middleware/check-auth');


const storageprofile = multer.diskStorage({
	destination:function(req, file, cb){
		const userid = req.params.userid;
    		const path = `./partner/${userid}`;
		fs.mkdirSync(path, { recursive: true });
		return cb(null, path);
	},
	filename:function(req, file, cb){
		cb(null, file.originalname);
	}
});

const uploadprofile = multer({
	// dest: './artisttype/',
	storage:storageprofile,
	limits:{
		fieldSize:1024 * 1024 * 30
	},
	// fileFilter:fileFilter
});

router.patch(
	'/addpartner/profile/:userid',
	uploadprofile.single('profile'),
	async (req,res)=>{
		// console.log(req.file);
		await partnerschema.findOneAndUpdate({userid:req.params.userid},{'profile':req.file}).exec().then(result=>{
			// console.log(result);
			res.status(200).json(result);
		}).catch(err =>{
			res.status(200).json(err);
		});
	}
);

router.post(
	'/addpartner',
	checkAuth,
	async (req,res)=>{
		const partner = new partnerschema({
			_id: new mongo.Types.ObjectId,
			userid:req.data.id,
			name:req.body.name,
			phonenumber:req.body.phonenumber,
			email:req.body.email,
			website:req.body.website,
			street:req.body.street,
			city:req.body.city,
			state:req.body.state,
			country:req.body.country,
			description:req.body.description,
			accountholdername:req.body.accountholdername,
			accountnumber:req.body.accountnumber,
			IFSC:req.body.IFSC,
			agreed:req.body.agreed,
		});
		partner.save().then(result=>{
			const user=userschema.findOneAndUpdate({_id:req.data.id},{ispartner:true},function(err,res){});
			// console.log(result);
			res.status(201).json({
				message:"partner added"
			});
		}).catch(err =>{
			res.status(500).json({err:err});
		});
	}
);

router.get('/getartist',(req,res,next) => {
	partnerschema.find({}).exec().then(result =>{
		// console.log({message:result});
		res.status(200).json({result:result});
	}).catch(err => {
		res.status(200).json(err);
	});
	// console.log('done');
});

 module.exports=router