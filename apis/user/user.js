const express = require('express');
const router = express.Router();
const mongo = require('mongoose');
const jwt = require('jsonwebtoken');

const userschema = require('../../model/user');
const checkAuth = require('../../middleware/check-auth');
const { json } = require('body-parser');

router.post('/signup',async (req,res,next)=>{
	const user = await new userschema({
		_id: new mongo.Types.ObjectId,
		name:req.body.name,
		email:req.body.email,
		phone:req.body.phone,
	});
	console.log(req.body);
	user.save().then(result=>{
		console.log('done')
		const token=jwt.sign({
			email:result['email'],
			id:result['_id'],
			phone:result['phone']
		},
		'key',
		{
			expiresIn:"4h"
		}
		);
		// console.log(token);
		res.status(201).json({
			message:"authenticated",
			token:token,
			detail:result
		});
	}).catch(err =>{
		res.status(500).json({err:err});
	});
});

router.post('/login/email',async(req,res,next)=>{
	await userschema.find({email:req.body.email})
	.exec()
	.then(users=>{
		if(users.length<1){
			res.status(404).json({
				message:"mail not found"
			});
		}
		const token=jwt.sign({
			email:users[0].email,
			id:users[0]._id,
			phone:users[0].phone
		},
		'key',
		{
			expiresIn:"4h"
		}
		);
		res.status(200).json(
			{
				message:"authenticated",
				token:token,
				detail:users[0]

			}
		);

	})
	.catch(err=>{
			res.status(500).json({err:err});
	});
});

router.post(
	'/updatephonenumber',
	checkAuth,
	async (req,res)=>{
		await userschema.findByIdAndUpdate(req.data.id,{'phone':req.body.phone,'otp':''}).exec().then(result=>{
			// console.log(result);
			if(req.body.otp==result['otp']){
				res.status(200).json({message:'updated'});
			}else{
				res.status(401).json({message:"invalid otp"});
			}
		}).catch(err =>{
			res.status(200).json(err);
		});
	}
);

router.post(
	'/updateemail',
	checkAuth,
	async (req,res)=>{
		await userschema.findByIdAndUpdate(req.data.id,{'email':req.body.email,'otp':''}).exec().then(result=>{
			// console.log(result);
			if(req.body.otp==result['otp']){
				res.status(200).json({message:'updated'});
			}else{
				res.status(401).json({message:"invalid otp"});
			}
		}).catch(err =>{
			res.status(200).json(err);
		});
	}
);

router.post(
	'/updatename',
	checkAuth,
	async (req,res)=>{
		await userschema.findByIdAndUpdate(req.data.id,{'name':req.body.name,'otp':''}).exec().then(result=>{
			// console.log(result);
			if(req.body.otp==result['otp']){
				res.status(200).json({message:'updated'});
			}else{
				res.status(401).json({message:"invalid otp"});
			}
		}).catch(err =>{
			res.status(200).json(err);
		});
	}
);

function generateotp() {  
	return Math.floor(
		Math.random() * (999999 - 100000) + 100000
	)
}

router.post(
	'/otp/update',
	checkAuth,
	async (req,res)=>{
		const otp=generateotp();
		// console.log(otp);
		await userschema.findByIdAndUpdate(req.data.id,{'otp':otp}).exec().then(result=>{
			// console.log(result);
			res.status(200).json({message:'otp added'});
		}).catch(err =>{
			res.status(400).json(err);
		});
	}
);


router.post(
	'/otp/login/email',
	async (req,res)=>{
		const otp=generateotp();
		// console.log(otp);
		await userschema.findOneAndUpdate({email:req.body.email},{'otp':otp}).exec().then(result=>{
			console.log(result);
			res.status(200).json({message:'otp added'});
		}).catch(err =>{
			res.status(400).json(err);
		});
	}
);

router.post(
	'/otp/login/phone',
	async (req,res)=>{
		const otp=generateotp();
		// console.log(otp);
		await userschema.findOneAndUpdate({phone:req.body.phone},{'otp':otp}).exec().then(result=>{
			console.log(result);
			res.status(200).json({message:'otp added'});
		}).catch(err =>{
			res.status(400).json(err);
		});
	}
);
module.exports = router;