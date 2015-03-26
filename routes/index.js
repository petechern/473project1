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

router.get('/signup', function(req, res) {
	res.render('register');
});

router.post('/signup', function(req,res) {
	var first = req.body.firstname;
	var last = req.body.lastname;
	var email = req.body.Email;
	var password = req.body.password;
	console.log(first);
	appdata['users'].push({'firstname':first, 'lastname' : last, 'email' : email, 'password' : password});
	console.log(appdata.users);
	res.redirect('/login');
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
	//code out line from the npm node-twitter api
	var Twitter = require('twitter');
	//pass in the function to tweetus to tweet later
	var tweetus = proposal ;//value to pass in
	var client = new Twitter({
	    consumer_key: 'BWwrpygcZUADDrDdn1YnQuYKn',
	    consumer_secret: 'wL6R7pndeL5INdBpCd64wJYWfS35pWrsZ8vsgUgGafGtWCRd7Q',
	    access_token_key: '3074282449-rCa2tBbzAyzezcMju8ZWPV9hhHvo0b1sZ9jOz1S',
	    access_token_secret: 'rYQHXRDh1OolSsSimzJY2qHJedsrNsQzqG82uxIRuq7uc'
	});

	// send the tweets , back end not showing on the page.
	client.post('statuses/update', {status:tweetus }, function(error, tweet, response){
	    if (!error) {
		console.log(tweet);
	    }
	});
	

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
