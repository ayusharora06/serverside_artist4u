const express = require('express');
const router = express.Router();
const mongo = require('mongoose');
const jwt = require('jsonwebtoken');

const userchema = require('../../model/user');

router.post('/signup',(req,res,next)=>{
	const user = new userchema({
		_id: new mongo.Types.ObjectId,
		email:req.body.email,
		phone:req.body.phone,
	});
	user.save().then(result=>{
		console.log(result);
		res.status(201).json({
			message:"authenticated"
		});
	}).catch(err =>{
		res.status(500).json({err:err});
	});
});

router.post('/login/email',(req,res,next)=>{
	userchema.find({email:req.body.email})
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
		res.status(200).json({token:token});

	})
	.catch(err=>{
			res.status(500).json({err:err});
	});
});

module.exports = router;