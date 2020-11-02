const express = require('express');
const router = express.Router();
const artisttype = require('../../model/artistbio');

router.get('/artistlist/:artisttype',(req,res,next) => {
	console.log(req.params.artisttype)
	artisttype[req.params.artisttype].find({}).exec().then(result =>{
		console.log({message:result});
		res.status(200).json({result:result});
	}).catch(err => {
		console.log(err);
	});
	// console.log('done');
});

// router.get('/artisttypes/:id',(req,res,next) => {
// 	res.status(200).json({
// 		message:req.params.id
// 	});
// 	// console.log('done');
// });
module.exports=router;