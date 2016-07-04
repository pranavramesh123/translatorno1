var express = require('express');
var path    = require("path");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + ''));
app.set('views', __dirname + '');
app.set('view engine', 'html');

//RESTful API
app.get('/', function(request, response) {
  response.render('index');
});

app.get('/room', function (req, res) {
 	res.status(500).send('room get ' + req.originalUrl + ' place xiaojijun');
});

app.get('/room/:roomName', function (req, res) {
  	res.status(500).send('room get ' + req.params.roomName + ' place');
});

app.get('/room/:roomName/:playerName', function (req, res) {
  	res.status(500).send('room get ' + req.params.roomName + ' place ' + req.params.playerName);
});

app.post('/', function (req, res) {
  	res.send('EMPTY post ' + req.body + 'place');
});

app.post('/room', function (req, res) {
	console.log(req.body.id);
	res.json(req.body.id);
});

//Port Setting
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


