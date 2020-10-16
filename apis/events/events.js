const express = require('express');
const router = express.Router();
const mongo = require('mongoose');
const checkAuth = require('../../middleware/check-auth');
const user = require('../../model/user');
const artisttype = require('../../model/artistbio');


router.post('/addevent',(req,res) => {
	var event={
		"artistid":req.body.artistid,
		"userid":req.body.userid,
		"artistname":req.body.artistname,
		"artisttype:":req.bodyartisttype,
		"username":req.body.username,
		"typesofevent":req.body.typesofevent,
		"gatheringsize":req.body.gatheringsize,
		"eventdetails":req.body.eventdetails,
		"location":req.body.location,
		"requiements":req.body.requiements,
		"price":req.body.price,
	}
	if(req.body.artisttype in artisttype){
		artisttype[req.body.artisttype].findByIdAndUpdate(
			req.body.artistid,
			{
				$push:{mybookings:event}
			}
		)
		.exec()
		.then(result=>{
		}).catch(err =>{
			console.log(err);
		});
		user.findByIdAndUpdate(
			req.body.userid,
			{
				$push:{mybookings:event}
			}
		)
		.exec()
		.then(result=>{
		}).catch(err =>{
			console.log(err);
	});
	res.status(400).json({message:"done"});
	}else{
		res.status(400).json({message:"artist type not found"});
	}
});

module.exports=router;