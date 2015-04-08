// Use router from express.
var express = require('express');
var router = express.Router();

// Use the data file to find user information.
var appdata = require('../data.json');

// Start without an active user.
var currentuser = null;

// Total number of users.
var totalUsers = appdata.users.length;

// Posts require half of the users to pass.
var requiredVotes = Math.ceil(totalUsers / 2);

// Authentication for logging in.
function authenticate(email, password) {
	// Grab the list of users and their information.
	var users = appdata.users;
	// Find the user who is logging in.



	//filter sample from stackoverflow http://stackoverflow.com/questions/2722159/javascript-how-to-filter-object-array-based-on-attributes
	var loginuser = users.filter(
		// If the user email and password both match, return true.
		function(user){ 
			return user.email === email && user.password === password 
		}
	)[0];
	// If loginuser returns undefined, return false.
	if(loginuser === undefined) {
		return false;
	}
	// Otherwise, log the user in.
	else {
		currentuser = loginuser;
		return true;
	}
}

// Authentication for registering a new user.
function regauthenticate(email) {
	var users = appdata.users;
	
	//regular expression taken from http://www.w3resource.com/javascript/form/email-validation.php
	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	
	//check if email is in the correct format.
	if(email.match(mailformat)) {

		//check if email is already in use.
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
	} else {
		return false;	//return false if email is not in correct format.
	}
}

//tweets function taken from the npm-twitter page https://www.npmjs.com/package/twitter
//inputting the 0auth from twitter website where we had to register for a developer account
function tweet(tweet) {
	// Using Twitter.
	var Twitter = require('twitter');
	
	// Set up the Twitter account to be used.
	var client = new Twitter({
	    consumer_key: 'BWwrpygcZUADDrDdn1YnQuYKn',
	    consumer_secret: 'wL6R7pndeL5INdBpCd64wJYWfS35pWrsZ8vsgUgGafGtWCRd7Q',
	    access_token_key: '3074282449-rCa2tBbzAyzezcMju8ZWPV9hhHvo0b1sZ9jOz1S',
	    access_token_secret: 'rYQHXRDh1OolSsSimzJY2qHJedsrNsQzqG82uxIRuq7uc'
	});

	// Send the tweet, back end not showing on the page.
	client.post('statuses/update', {status:tweet }, function(error, tweet, response){
	    if (!error) {
		console.log(tweet);
	    }
	});
}

// route to login since index do not have anything on there so when the user type in it reached into the login page
router.get('/', function(req, res) {
	res.render('login', {"pagetitle": "Login"});
});

// Route to the login page.
router.get('/login', function(req, res) {
	res.render('login', {"pagetitle": "Login"});
});

// Route to the signup page.
router.get('/signup', function(req, res) {
	res.render('signup', {"pagetitle": "Sign Up!"});
});

//registering new account function
router.post('/signup', function(req,res) {

	var first = req.body.firstname;
	var last = req.body.lastname;
	var email = req.body.email;
	var password = req.body.password;

	var nameFormat = /^[A-Za-z]+$/;
	if(first.length === 0 || last.length === 0 || password.length === 0) {
		res.render('signup',{"message": "All values must be filled.", "pagetitle": "Sign Up!"});
	} else if(!first.match(nameFormat)) {
		res.render('signup',{"message": "First Name must contain only letters.", "pagetitle": "Sign Up!"});
	} else if(!first.match(nameFormat)) {
		res.render('signup',{"message": "Last Name must contain only letters.", "pagetitle": "Sign Up!"});
	} else{
		
		if(regauthenticate(email)) {
			appdata["users"].push({"firstName": first, "lastName": last, "email": email, "password" : password});
			res.redirect('/login');
			
			//Update required votes.
			totalUsers = appdata.users.length;
			requiredVotes = Math.ceil(totalUsers / 2);
		}
		else {
			res.render('signup',{"message": "Email is invalid or already registered.", "pagetitle": "Sign Up!"});
		}
	}
});

// Logging in as an existing user.
router.post('/login', function(req, res) {
	// Take user email and password.
	var email = req.body.email;
	var password = req.body.password;

	// If the email and password combination matches, log in.
	if(authenticate(email, password)) {
		res.redirect('/propose');
	}
	// Otherwise, display an error message.
	else {
		res.render('login', {"message": "Please try again.", "pagetitle": "Login"});
	}
});

// Propose a new tweet to be made.
router.get('/propose', function(req, res) {
	// If no user is logged in, redirect to the login page.
	if(currentuser === null) {
		res.redirect('/login');
	}
	// Otherwise, go on with the proposal.
	else {
		var proposal = appdata.proposal;
		res.render('propose', {"proposal": proposal, "currentuser": currentuser, "pagetitle": "Propose a Tweet"});
	}
});

// Create appdata for the proposed tweet.
router.post('/propose', function(req, res) {
	// If no user is logged in, redirect to the login page.
	if(currentuser === null) {
		res.redirect('/login');
	}
	// Otherwise, add the proposal to the appdata page.
	else {
		var proposal = req.body.proposal;
		if(proposal != undefined && proposal.length <= 140 && proposal.length > 0){
		
			appdata["proposal"].push({"author": currentuser.firstName + " " + currentuser.lastName, "email": currentuser.email,  "content": proposal, "upvote": [currentuser.email], "downvote": [], "status": "pending"});
	
			// Redirect to the vote page.
			res.redirect('/vote');
		} else {
			res.render('propose',{"message": "Please keep the tweet length between 1 and 140 characters.", "pagetitle": "Propose a Tweet"});
		}
	}
});

// Route to the vote page.
router.get('/vote', function(req, res) {
	// If no user is logged in, redirect to the login page.
	if(currentuser === null) {
		res.redirect('/login');
	}
	// Otherwise, show the proposed tweets.
	else {
		var proposal = appdata.proposal;

		res.render('vote.ejs', {"proposal": proposal, "currentuser": currentuser, "requiredVotes": requiredVotes, "totalUsers": totalUsers, "pagetitle": "Vote"} );
	}
});

// Casting votes on the vote page.
router.post('/vote', function(req, res) {
	// If no user is logged in, redirect to the login page.
	if(currentuser === null) {
		res.redirect('/login');
	}
	// Otherwise, allow the user to vote.
	else {
		var index = parseInt(req.body.index);
		var vote = req.body.vote;

		var proposals = appdata.proposal;
		
		// Variables to track whether or not the current user has
		//   voted on a proposal and where their email is indexed.
		var voteup = false;
		var votedown = false;
		var locup
		var locdown
		
		// Check if the current user has upvoted the submission.
		//   If they have, save the index of their email.
		for(var up=0; up < proposals[index].upvote.length; up++){
			if (proposals[index].upvote[up] == currentuser.email){
				voteup = true;
				locup = up;
			}
		}

		// Check if the current user has downvoted the submission.
		//   If they have, save the index of their email.
		for(var down=0; down < proposals[index].downvote.length; down++){
			if (proposals[index].downvote[down] == currentuser.email){
				votedown = true;
				locdown = down;
			}
		}

		// If the user upvotes one of the proposals...
		if(vote === "up") {
			// If the user has not yet upvoted the post.
			if(voteup != true){
				// If the user has previously downvoted the proposal,
				//   remove their name from the downvote list.
				if(votedown == true){
					proposals[index].downvote.splice(locdown,1);
				}
				// Increase the approval count
				proposals[index].upvote.push(currentuser.email);
				// If the approval count is greater than the required
				//   votes, send the tweet.
				if(proposals[index].upvote.length >= requiredVotes) {
					proposals[index].status = "Approved";
					tweet(proposals[index].content);
				}
			// If the user is clicking the upvote button again, remove
			//   their name from the upvote list.
			} else if(voteup == true){
				proposals[index].upvote.splice(locup,1);
			}
		}
		// If the user downvotes one of the proposals...
		else if(vote === "down") {
			// If the user has not yet downvoted the proposal.
			if(votedown != true){
				// If the user has upvoted the proposal, remove their
				//   email from the upvote list.
				if(voteup == true){
					proposals[index].upvote.splice(locup,1);
				}
				// Increase the disapproval count.
				proposals[index].downvote.push(currentuser.email);
				// If the disapproval count is creater than the
				//   required votes, deny the tweet.
				if(proposals[index].downvote.length >= requiredVotes) {
					proposals[index].status = "Denied";
				}
			// If the user is clicking the downvote button again, remove
			//   their email from the downvote list.
			} else if(votedown == true){
				proposals[index].downvote.splice(locdown,1);
			}
		}
		
		// Refresh the proposal.
		res.render('vote.ejs', {"proposal": proposals, "currentuser": currentuser, "requiredVotes": requiredVotes, "totalUsers": totalUsers, "pagetitle": "Vote"} );
	}
});


// Logout reroute.
router.get('/logout', function(req, res) {
	// Set current user to null and go to the login page.
	currentuser = null;
	res.redirect('/login');
});

module.exports = router;
