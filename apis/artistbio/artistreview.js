const express = require('express');
const router = express.Router();

router.get('/get_artistreview',(req,res,next) => {
	res.status(200).json({
		message:[
			'awesome'
		]
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