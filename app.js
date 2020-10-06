const express = require('express');
const app = express();
const offers = require('./apis/home/offers');
var mongo = require('mongoose');
const parser = require('body-parser');

app.use(parser.urlencoded({extended:false}));
app.use(parser.json());
app.use('/artist_type_images', express.static('artist_type_images'));
app.use('/offers_images', express.static('offers_images'));
app.use('/artisttype', express.static('artisttype'));

var url = "mongodb://localhost:27017/";
mongo.connect(url,
	{
		useUnifiedTopology: true,
		useNewUrlParser: true
	}
);
const artisttypes = require('./apis/home/artistTypes');
const artistlist = require('./apis/artistlist/artistlist');
const artistbio = require('./apis/artistbio/artistbio');
const artistreview = require('./apis/artistbio/artistreview');
const user = require('./apis/user/user');
const partner = require('./apis/partner/partnerbio');

app.use('/home/artisttypes',artisttypes);
app.use('/home/offers',offers);
app.use('/artistlist',artistlist);
app.use('/artistbio',artistbio);
app.use('/artistbio',artistreview);
app.use('/user',user);
app.use('/partner',partner);

module.exports = app;