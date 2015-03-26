var express = require('express');
var router = express.Router();

var appdata = require('../data.json');
var currentuser = null;
var totalUsers = appdata.users.length;
var requiredVotes = Math.ceil(totalUsers / 2);


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

//authendicate for registeration

function regauthenticate(email) {
	var users = appdata.users;
	var loginuser = users.filter(
		function(user){ return user.email === email }
	)[0];

	if(loginuser === undefined) {
		//if the email is correct return true
		return true;
	}
	else {
		//if the email exist return falst
		currentuser = loginuser;
		return false;
	}
}

function tweet(tweet) {
	var Twitter = require('twitter');

	var client = new Twitter({
	    consumer_key: 'BWwrpygcZUADDrDdn1YnQuYKn',
	    consumer_secret: 'wL6R7pndeL5INdBpCd64wJYWfS35pWrsZ8vsgUgGafGtWCRd7Q',
	    access_token_key: '3074282449-rCa2tBbzAyzezcMju8ZWPV9hhHvo0b1sZ9jOz1S',
	    access_token_secret: 'rYQHXRDh1OolSsSimzJY2qHJedsrNsQzqG82uxIRuq7uc'
	});

	// send the tweets , back end not showing on the page.
	client.post('statuses/update', {status:tweet }, function(error, tweet, response){
	    if (!error) {
		console.log(tweet);
	    }
	});
}


router.get('/', function(req, res) {
	res.render('login');
});

router.get('/login', function(req, res) {
	res.render('login');
});

//route the sign up page
router.get('/signup', function(req, res) {
	res.render('signup');
});

//
router.post('/signup', function(req,res) {
	console.log("first");
	var first = req.body.firstname;
	var last = req.body.lastname;
	var email = req.body.email;
	var password = req.body.password;
	console.log(first);
	
	if(regauthenticate(email)){
		console.log(email);
		//appdata['users'].push({'firstname':first, 'lastname' : last, 'email' : email, 'password' : password});
		//res.redirect('/login');
	}
	else{
//		res.render('signup',{"message": "please Enter a different Email"});
	}
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
		appdata["proposal"].push({"author": currentuser.firstName + " " + currentuser.lastName, "email": currentuser.email,  "content": proposal, "upvote": [currentuser.email], "downvote": [], "status": "pending"});

		res.redirect('/vote');
	}
});


router.get('/vote', function(req, res) {
	if(currentuser === null) {
		res.redirect('/login');
	}
	else {
		var proposal = appdata.proposal;

		res.render('vote.ejs', {"proposal": proposal, "currentuser": currentuser, "requiredVotes": requiredVotes, "totalUsers": totalUsers} );
	}
});

router.post('/vote', function(req, res) {
	if(currentuser === null) {
		res.redirect('/login');
	}
	else {
		var index = parseInt(req.body.index);
		var vote = req.body.vote;

		var proposals = appdata.proposal;

		if(vote === "up") {
			proposals[index].upvote.push(currentuser.email);
			if(proposals[index].upvote.length >= requiredVotes) {
				proposals[index].status = "Approved";
				tweet(proposals[index].content);
			}
		}
		else if(vote === "down") {
			proposals[index].downvote.push(currentuser.email);
			if(proposals[index].downvote.length >= requiredVotes) {
				proposals[index].status = "Denied";
			}
		}
		
		res.render('vote.ejs', {"proposal": proposals, "currentuser": currentuser, "requiredVotes": requiredVotes, "totalUsers": totalUsers} );
	}
});



router.get('/logout', function(req, res) {
	currentuser = null;
	res.redirect('/login');
});

module.exports = router;
