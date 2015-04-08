var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));

app.use('/', routes);

var server = app.listen(3000, function() {
	console.log('Listening on port 3000');
});