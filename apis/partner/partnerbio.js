const express = require('express');
const router = express.Router();
const mongo = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const userschema = require('../../model/user');
const partnerschema = require('../../model/partnerbio');
const referschema=require('../../model/refercode');
const checkAuth = require('../../middleware/check-auth');
const refercode = require('../../model/refercode');


const storageprofile = multer.diskStorage({
	destination:function(req, file, cb){
		const userid = req.params.userid;
    		const path = `./partner/${userid}/profile`;
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

const storageproof = multer.diskStorage({
	destination:function(req, file, cb){
		const userid = req.params.userid;
    		const path = `./partner/${userid}/proof`;
		fs.mkdirSync(path, { recursive: true });
		return cb(null, path);
	},
	filename:function(req, file, cb){
		cb(null, file.originalname);
	}
});

const uploadproof = multer({
	// dest: './artisttype/',
	storage:storageproof,
	limits:{
		fieldSize:1024 * 1024 * 30
	},
	// fileFilter:fileFilter
});

router.patch(
	'/addpartner/profile/:userid',
	checkAuth,
	uploadprofile.single('profile'),
	async (req,res)=>{
		if(req.file){
			// console.log(req.file);
			await partnerschema.findOneAndUpdate({userid:req.params.userid},{'profile':req.file}).exec().then(result=>{
				// console.log(result);
				res.status(200).json({message:'profile added'});
			}).catch(err =>{
				res.status(400).json({message:err});
			});
		}
		else{
			res.status(200).json({message:'file not found'});
		}
	}
);

router.patch(
	'/addpartner/idproof/:userid',
	checkAuth,
	uploadproof.single('idproof'),
	async (req,res)=>{
		console.log(req);
		if(req.file){
			// console.log(req.file);
			await partnerschema.findOneAndUpdate({userid:req.params.userid},{'idproof':req.file}).exec().then(result=>{
				// console.log(result);
				res.status(200).json({message:'Id proof added'});
			}).catch(err =>{
				res.status(400).json({message:err});
			});

		}else{
			res.status(200).json({message:'file not found'});
		}
		
	}
);

router.post(
	'/addpartner',
	checkAuth,
	async (req,res)=>{
		// console.log(req)
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
			const user=userschema.findOneAndUpdate({_id:req.data.id},{ispartner:true},function(err,result){
				res.status(201).json({
					message:"partner added",
					partnerid:result._id
				});
			});
			// console.log(result);
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

function generaterefercode() {  
	return Math.floor(
		Math.random() * (999999 - 100000) + 100000
	)
}

function generateuniqueid() {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < 7; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
   }

router.post('/generaterefercode',async(req,res)=>{
	var refercode=generaterefercode();
	const refer = new referschema({
		_id: new mongo.Types.ObjectId,
		uniqueid:generateuniqueid(),
		partnerid:req.body.partnerid,
		refercode:refercode
	});
	await refer.save().then((result)=>{
		res.json(result);
	});
});

router.post('/verifyrefercode',async(req,res)=>{
	referschema.findOne({uniqueid:req.body.uniqueid}).exec().then((result)=>{
		if(result["refercode"]==req.body.refercode){
			res.status(200).json({message:"done"});
		}else{
			res.status(400).json({message:"invalid"});
		}
	}).catch((err)=>{
		res.status(401).json({message:"expired or not generated"});
	});
});
 module.exports=router