const express = require('express');
const router = express.Router();
const mongo = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const userschema = require('../../model/user');
const partnerschema = require('../../model/partnerbio');
const checkAuth = require('../../middleware/check-auth');

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