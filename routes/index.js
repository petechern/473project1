var express = require('express');
var router = express.Router();

var appdata = require('../data.json');
var currentuser = null;

function authenticate(email, password) {
	var users = appdata.users;

	var loginuser = users.filter(
		function(user){ return user.email === email && user.password === password }
	)[0];

	if(loginuser === undefined) {
		return false;
	}
	else {
		currentuser = loginuser;
		return true;
	}
}

router.get('/', function(req, res) {
	res.render('login');
});

router.get('/login', function(req, res) {
	res.render('login');
});

router.post('/login', function(req, res) {
	var email = req.body.email;
	var password = req.body.password;

	if(authenticate(email, password)) {
		res.redirect('/propose');
	}
	else {
		res.render('login', {"message": "Please try again."});
	}
});

router.get('/propose', function(req, res) {
	if(currentuser === null) {
		res.redirect('/login');
	}
	else {
		var proposal = appdata.proposal;
		res.render('propose', {"proposal": proposal, "currentuser": currentuser});
	}
});

router.post('/propose', function(req, res) {
	if(currentuser === null) {
		res.redirect('/login');
	}
	else {
		var proposal = req.body.proposal;
		appdata["proposal"].push({"author": currentuser.firstName + " " + currentuser.lastName, "email": currentuser.email,  "content": proposal, "upvote": [], "downvote": [], "status": "pending"});

		res.redirect('/vote');
	}
});

router.get('/vote', function(req, res) {
	if(currentuser === null) {
		res.redirect('/login');
	}
	else {
		var proposal = appdata.proposal;

		res.render('vote.ejs', {"proposal": proposal, "currentuser": currentuser} );
	}
});

router.post('/vote', function(req, res) {
	if(currentuser === null) {
		res.redirect('/login');
	}
	else {
		var proposal = appdata.proposal;

		res.render('vote.ejs', {"proposal": proposal, "currentuser": currentuser} );
	}
});

router.get('/logout', function(req, res) {
	currentuser = null;
	res.redirect('/login');
});

module.exports = router;
