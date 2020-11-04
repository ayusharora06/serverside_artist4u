const express = require('express');
const router = express.Router();
const mongo = require('mongoose');
const checkAuth = require('../../middleware/check-auth');
const user = require('../../model/user');
const artisttype = require('../../model/artistbio');


function generatebookingid() {  
	return Math.floor(
		Math.random() * (999999999999 - 100000000000) + 100000000000
	)
}
router.post('/addevent',checkAuth,(req,res) => {
	// console.log(req.body);
	var event={
		"artistid":req.body.artistid,
		"userid":req.body.userid,
		"bookingid":generatebookingid(),
		"artistname":req.body.artistname,
		"username":req.body.username,
		"artisttype:":req.body.artisttype,
		"typesofevent":req.body.typesofevent,
		"gatheringsize":req.body.gatheringsize,
		"eventdetails":req.body.eventdetails,
		"location":req.body.location,
		"requiements":req.body.requiements,
		"status":"upcoming",
		"price":req.body.price,
		"refercode":req.body.refercode,
		"cancelledby":null,
		"artistcompensation":null,
	}
	if(req.body.artisttype in artisttype){
		artisttype[req.body.artisttype].findByIdAndUpdate(
			req.body.artistid,
			{
				$push:{mybookings:event}
			},
		)
		.exec()
		.catch(err =>{
			console.log(err);
		});
		user.findByIdAndUpdate(
			req.body.userid,
			{
				$push:{mybookings:event}
			}
		)
		.exec()
		.catch(err =>{
			console.log(err);
	});
	res.status(200).json({message:"done"});
	}else{
		res.status(400).json({message:"artist type not found"});
	}
});

router.get('/upcoming',checkAuth,(req,res)=>{
	var upcoming=[];
	user.findOne({_id:req.data.id,}).exec()
	.then(
		(user)=>{
			for(var i =0;i<user.mybookings.length;i++){
				if(user.mybookings[i]['status']=='upcoming'){
					// console.log(user.mybookings[i])
					upcoming.push(user.mybookings[i]);
				}
			} 
			res.status(200).json({result:upcoming});
		}
	).catch();
})

router.get('/completed',checkAuth,(req,res)=>{
	var completed=[];
	user.findOne({_id:req.data.id,}).exec()
	.then(
		(user)=>{
			for(var i =0;i<user.mybookings.length;i++){
				if(user.mybookings[i]['status']=='completed'){
					// console.log(user.mybookings[i])
					completed.push(user.mybookings[i]);
				}
			}
			// if (user.isartist==true){
			// 	// artisttype.findOne({_id:req.data.id}).exec().then((result)=>{console.log(result)})
			// 	console.log(user.isartist)
			// }
			res.status(200).json(completed);
		}
	).catch();
})

router.get('/cancelled',checkAuth,(req,res)=>{
	var cancelled=[];
	user.findOne({_id:req.data.id,}).exec()
	.then(
		(user)=>{
			for(var i =0;i<user.mybookings.length;i++){
				if(user.mybookings[i]['status']=='cancelled'){
					// console.log(user.mybookings[i])
					cancelled.push(user.mybookings[i]);
				}
			} 
			res.status(200).json(cancelled);
		}
	).catch();
})

router.get('/artist/upcoming',checkAuth,(req,res)=>{
	var upcoming=[];
	user.findOne({_id:req.data.id,}).exec()
	.then(
		(user)=>{
			if(user['isartist']==true){
				artisttype[user['artisttype']].findById(user['artistid']).exec()
				.then((artist)=>{
					console.log(artist)
					for(var i =0;i<artist.mybookings.length;i++){
						if(artist.mybookings[i]['status']=='upcoming'){
							// console.log(user.mybookings[i])
							upcoming.push(artist.mybookings[i]);
						}
					} 
					res.status(200).json({result:upcoming});
				})
				.catch()
					
			}
		}
	).catch();
})

router.post('/cancelevent/user',checkAuth,(req,res)=>{
	user.findOne({_id:req.data.id,}).exec()
	.then(
		(result)=>{
			var found=0;
			//console.log(result['mybookings'].length)
			for(var i =0;i<result['mybookings'].length;i++){
				if(result['mybookings'][i]['bookingid']==req.body.bookingid){
					// console.log(result['mybookings'][i])
					found=1;
					var afound=0;
					result['mybookings'][i]['status']='cancelled';
					result['mybookings'][i].cancelledby='user';
					result['mybookings'][i].artistcompensation=10;
					user.update(result,function(err,num,res){}).catch((err)=>{})
					// res.status(200).json({message:'done'});
					artisttype[result['artisttype']].findById(result['artistid']).then((artist)=>{
						for(var i =0;i<artist['mybookings'].length;i++){
							if(artist['mybookings'][i]['bookingid']==req.body.bookingid){
								afound=1;
								artist['mybookings'][i].status="cancelled";
								artist['mybookings'][i].cancelledby='user';
								artist['mybookings'][i].artistcompensation=10;
								console.log(artist['mybookings'][i])
								artisttype[result['artisttype']].update(artist,function(err,num,res){}).catch((err)=>{})
								res.status(200).json({message:'done'});
							}
						}
						if(afound==0){
							res.status(400).json({message:'invalid booking id for artsit'});
						}
					}
					).catch((err)=>{
						res.status(400).json({message:'invalid artist id'});
					});
					// res.status(200).json(result['mybookings'][i]);
				}
			}
			if(found==0){
				res.status(400).json({message:'invalid booking id for user'});
			}
		}
	).catch();
	// user.findById(req.user.id,function(err,data){
	// 	if(err){
	// 	  return err
	// 	}else{
	// 	  user.update(
	// 	    {_id: req.user.id}, {
	// 		contact:req.body.contact,
	// 		first_name:req.body.first_name,
	// 		last_name:req.body.last_name,
	// 	    },function(err,num,res){
	// 		// console.log(err)
	// 		// console.log(num)
	// 		// console.log(res)
	// 	    }
	// 	  );
	// 	  res.status(200).json({
	// 	    message:'hope you learn something new',
	// 	    // credits:user.credits
	// 	  });
	// 	}
	//     });
})

router.post('/cancelevent/artist',checkAuth,(req,res)=>{
	user.findOne({_id:req.data.id,}).exec()
	.then(
		(result)=>{
			var found=0;
			//console.log(result['mybookings'].length)
			for(var i =0;i<result['mybookings'].length;i++){
				if(result['mybookings'][i]['bookingid']==req.body.bookingid){
					// console.log(result['mybookings'][i])
					found=1;
					var afound=0;
					result['mybookings'][i]['status']='cancelled';
					result['mybookings'][i].cancelledby='artist';
					result['mybookings'][i].artistcompensation=0;
					user.update(result,function(err,num,res){}).catch((err)=>{})
					// res.status(200).json({message:'done'});
					artisttype[result['artisttype']].findById(result['artistid']).then((artist)=>{
						for(var i =0;i<artist['mybookings'].length;i++){
							if(artist['mybookings'][i]['bookingid']==req.body.bookingid){
								afound=1;
								artist['mybookings'][i].status="cancelled";
								artist['mybookings'][i].cancelledby='artist';
								artist['mybookings'][i].artistcompensation=0;
								console.log(artist['mybookings'][i])
								artisttype[result['artisttype']].update(artist,function(err,num,res){}).catch((err)=>{})
								res.status(200).json({message:'done'});
							}
						}
						if(afound==0){
							res.status(400).json({message:'invalid booking id for artsit'});
						}
					}
					).catch((err)=>{
						res.status(400).json({message:'invalid artist id'});
					});
					// res.status(200).json(result['mybookings'][i]);
				}
			}
			if(found==0){
				res.status(400).json({message:'invalid booking id for user'});
			}
		}
	).catch();
	// user.findById(req.user.id,function(err,data){
	// 	if(err){
	// 	  return err
	// 	}else{
	// 	  user.update(
	// 	    {_id: req.user.id}, {
	// 		contact:req.body.contact,
	// 		first_name:req.body.first_name,
	// 		last_name:req.body.last_name,
	// 	    },function(err,num,res){
	// 		// console.log(err)
	// 		// console.log(num)
	// 		// console.log(res)
	// 	    }
	// 	  );
	// 	  res.status(200).json({
	// 	    message:'hope you learn something new',
	// 	    // credits:user.credits
	// 	  });
	// 	}
	//     });
})

module.exports=router;