var path    = require("path");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname+'/../index.html'));
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
var time = 0;
setInterval(function(){time++;}, 1000);
databaseGarbageCollection();

setInterval(function(){
  	databaseGarbageCollection();
}, 1000 * 60 * 5);  

function databaseGarbageCollection(){
	console.log('databaseGarbageCollection done ' + time);
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});