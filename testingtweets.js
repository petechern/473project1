//code out line from the npm node-twitter api
var Twitter = require('twitter');

//pass in the function to tweetus to tweet later
var tweetus ='this is even more awsome' ;//value to pass in
 
var client = new Twitter({
 consumer_key: 'BWwrpygcZUADDrDdn1YnQuYKn',
 consumer_secret: 'wL6R7pndeL5INdBpCd64wJYWfS35pWrsZ8vsgUgGafGtWCRd7Q',
 access_token_key: '3074282449-rCa2tBbzAyzezcMju8ZWPV9hhHvo0b1sZ9jOz1S',
  access_token_secret: 'rYQHXRDh1OolSsSimzJY2qHJedsrNsQzqG82uxIRuq7uc'
});

 /* couldn't get it to work ,maybe implement in phrase 2 on spring break
 TWITTER_CONSUMER_KEY ='BWwrpygcZUADDrDdn1YnQuYKn';
 TWITTER_CONSUMER_SECRET='wL6R7pndeL5INdBpCd64wJYWfS35pWrsZ8vsgUgGafGtWCRd7Q';
 TWITTER_ACCESS_TOKEN_KEY ='3074282449-rCa2tBbzAyzezcMju8ZWPV9hhHvo0b1sZ9jOz1S';
 TWITTER_ACCESS_TOKEN_SECRET ='rYQHXRDh1OolSsSimzJY2qHJedsrNsQzqG82uxIRuq7uc';

 var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
*/
// send the tweets , back end not showing on the page.
client.post('statuses/update', {status:tweetus }, function(error, tweet, response){

  if (!error) {
    console.log(tweet);
  }
});
//search tweets
//client.get('search/tweets', {q: 'node.js'}, function(error, tweets, response){
//   console.log(tweets);
//});