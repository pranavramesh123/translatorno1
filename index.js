//Basic Setup
var express = require('express');
var path    = require("path");
var app = express();
//FireBase Setup
var rootURL = "https://enghack2016.firebaseio.com";
var roomsURL = "https://enghack2016.firebaseio.com/rooms";
var firebase = require("firebase");
firebase.initializeApp({ 
  databaseURL: rootURL
});
var db = firebase.database();
var ref = db.ref("/rooms");
//JSON Parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//Heroku Node Setup
app.use(express.static(__dirname + ''));
app.set('views', __dirname + '');
app.set('view engine', 'html');

//RESTful API
app.get('/', function(request, response) {
  response.render('index');
});

app.get('/getRootURL', function (req, res) {
 	res.status(200).send(rootURL);
});

// app.get('/room/:roomName', function (req, res) {
//   	res.status(500).send('room get ' + req.params.roomName + ' place');
// });

// app.get('/room/:roomName/:playerName', function (req, res) {
//   	res.status(500).send('room get ' + req.params.roomName + ' place ' + req.params.playerName);
// });

// app.post('/', function (req, res) {
//   	res.send('EMPTY post ' + req.body + 'place');
// });

app.post('/renewConnection/:roomName/:playerName', function (req, res) {
	console.log(req.body.id);
	res.json(req.body.id);
});

app.get('/deletePlayer/:roomName/:playerName', function (req, res) {
	console.log('RESTful DELETE');
	deletePlayer(req, res);
});

app.get('/deleteAllRooms', function (req, res) {
	console.log('Database Cleared & Reset');
	ref.set({
		placeholder:'Johnson Han'
	});
	res.send('Delete All Rooms Request Sent');
});

function deletePlayer(req, res){
	var roomName = req.params.roomName;
	var playerName = req.params.playerName;
	var roomRef = ref.child(roomName);
	roomRef.once("value", function(snapshot) {
	  if(snapshot.hasChild(playerName) == false){
	  	console.log(playerName + ' DNE ');
		res.status(404).send(false);
	  }else{
	  	//Deleting
		var playerRef = roomRef.child(playerName);
		playerRef.set(null);
	  	console.log(playerName + ' EXIST ');
		res.status(200).send(true);
	  }
	});
}

//Port Setting
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


