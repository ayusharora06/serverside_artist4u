const express = require('express');
const router = express.Router();
const mongo = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const artisttype = require('../../model/artistbio');
const checkAuth = require('../../middleware/check-auth');
const user = require('../../model/user');


const storageidproof = multer.diskStorage({
	destination:function(req, file, cb){
		const artist_type = req.params.artist_type;
		const id = req.params.id;
    		const path = `./artisttype/${artist_type}/${id}/idproof`;
		fs.mkdirSync(path, { recursive: true });
		return cb(null, path);
	},
	filename:function(req, file, cb){
		cb(null, file.originalname);
	}
});

const storageprofile = multer.diskStorage({
	destination:function(req, file, cb){
		const artist_type = req.params.artist_type;
		const id = req.params.id;
    		const path = `./artisttype/${artist_type}/${id}/profile`;
		fs.mkdirSync(path, { recursive: true });
		return cb(null, path);
	},
	filename:function(req, file, cb){
		cb(null, file.originalname);
	}
});
const storagegallery = multer.diskStorage({
	destination:function(req, file, cb){
		const artist_type = req.params.artist_type;
		const id = req.params.id;
    		const path = `./artisttype/${artist_type}/${id}/gallery`;
		fs.mkdirSync(path, { recursive: true });
		return cb(null, path);
	},
	filename:function(req, file, cb){
		cb(null, file.originalname);
	}
});


// const fileFilter = (req, file, cb)=>{
// 	if (file.mimetype === 'image/jpeg' || file.mimetype ==='image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'video/mp4' || file.mimetype === 'application/x-mpegURL' || file.mimetype === 'video/MP2T'){
// 		cb(null, true);
// 	}else{
// 		cb(new Error('Invalid file type'), false);
// 	}
// };

const uploadidproof = multer({
	// dest: './artisttype/',
	storage:storageidproof,
	limits:{
		fieldSize:1024 * 1024 * 30
	},
	// fileFilter:fileFilter
});

const uploadprofile = multer({
	// dest: './artisttype/',
	storage:storageprofile,
	limits:{
		fieldSize:1024 * 1024 * 30
	},
	// fileFilter:fileFilter
});

const uplloadgallery = multer({
	// dest: './artisttype/',
	storage:storagegallery,
	limits:{
		fieldSize:1024 * 1024 * 30
	},
	// fileFilter:fileFilter
});

// const { singer } = require('../model/artistbio');
// const { actor } = require('../model/artistbio');
// const { dancer } = require('../model/artistbio');
// const { magicina } = require('../model/artistbio');
// const { clown } = require('../model/artistbio');
// const { standup_comedy } = require('../model/artistbio');

router.patch(
	'/add_artistbio/idproof/:artist_type/:id',
	uploadidproof.single('idproof'),
	(req,res)=>{
		if(req.params.artist_type in artisttype){
			artisttype[req.params.artist_type].findByIdAndUpdate(req.params.id,{'idproof':req.file}).exec().then(result=>{
				res.status(200).json(result);
			}).catch(err =>{
				console.log(err);
			});
		}else{
			res.status(200).send('artist type not found');
		}

	}
);

router.patch(
	'/add_artistbio/profile/:artist_type/:id',
	uploadprofile.single('profile'),
	(req,res)=>{
		console.log(req.file);
		if(req.params.artist_type in artisttype){
			console.log('found');
			// artisttype[req.params.artist_type].findByIdAndUpdate(req.params.id,{'profile':req.file}).exec().then(result=>{
			// 	res.status(200).json(result);
			// }).catch(err =>{
			// 	console.log(err);
			// });
			artisttype[req.params.artist_type].findByIdAndUpdate(req.params.id,{'profile':req.file}).exec().then(result=>{
				console.log(result);
				res.status(200).json(result);
			}).catch(err =>{
				console.log(err);
			});
		}else{
			console.log('not found');
			res.status(200).send('artist type not found');
		}
	}
);
router.get(
	'/add_artistbio/profile/:artist_type/:id',
	(req,res)=>{
		if(req.params.artist_type in artisttype){
			artisttype[req.params.artist_type].findById(req.params.id).exec().then(result=>{
				res.status(200).json(result);
			}).catch(err =>{
				console.log(err);
			});
		}else{
			res.status(400).send('artist type not found');
		}
	}
);

router.patch(
	'/add_artistbio/gallery/:artist_type/:id',
	uplloadgallery.array('gallery',7),
	(req,res)=>{
		if(req.params.artist_type in artisttype){
			artisttype[req.params.artist_type].findByIdAndUpdate(req.params.id,{'gallery':req.files}).exec().then(result=>{
				res.status(200).json(result);
			}).catch(err =>{
				console.log(err);
			});
		}else{
			res.status(200).send('artist type not found');
		}

	}
);

router.post('/add_artistbio/:artist_type',(req,res) => {

	if(req.body.artist_type in artisttype){
		// console.log(req.body.artist_type);
		const bio = new artisttype[req.body.artist_type]({

			_id: new mongo.Types.ObjectId,
			userid:req.body.userid,
			name:req.body.name,
			//profile:req.files.profile[0],
			artist_type:req.body.artist_type,
			experience:req.body.experience,
			//gallery:req.files.gallery,
			gender:req.body.gender,
			dateofbirth:req.body.dateofbirth,
			phonenumber:req.body.phonenumber,
			email:req.body.email,
			street:req.body.street,
			city:req.body.city,
			state:req.body.state,
			country:req.body.country,
			typesofshow:req.body.typesofshow,
			specialization:req.body.specialization,
			languagepreffered:req.body.languagepreffered,
			minhours:req.body.minhours,
			maxhours:req.body.maxhours,
			description:req.body.description,
			team:req.body.team,
			outstationtravel:req.body.outstationtravel,
			unifiedprice:req.body.unifiedprice,
			price:req.body.price,
			differentprices:req.body.differentprices,
			accountholdername:req.body.accountholdername,
			accountnumber:req.body.accountnumber,
			IFSC:req.body.IFSC,
			//idproof:req.files.idproof[0],
			agreed:req.body.agreed,
			recommended:req.body.recommended,
			peopleschoice:req.body.peopleschoice
		});
		bio.save().then(result =>{
			console.log(result);
			user.findByIdAndUpdate(req.body.userid,
				{
					artistid:result['_id'],
					isartist:true,
					artisttype:result['artist_type']
				},function(req,res,err){}
			)
		}).catch(err => {
			console.log(err);
		});

		res.send(bio);
	}else{
		res.status(200).send('artist Type not found')
	}
});

router.get(
	'/get_artistbio/:artist_type/:id',
	(req,res)=>{
		if(req.params.artist_type in artisttype){
			artisttype[req.params.artist_type].findById(req.params.id).exec().then(result=>{
				res.status(200).json(result);
			}).catch(err =>{
				console.log(err);
			});
		}else{
			res.status(200).send('artist type not found');
		}
	}
);

module.exports=router;