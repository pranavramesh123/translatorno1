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
 	res.status(200).send(roomsURL);
});

app.post('/createConnection/:roomName/:playerName', function (req, res) {
	console.log('Created: ' + req.params.roomName + ' ' + req.params.playerName);
	if(head == null){
		head = new playerManager(req.params.roomName, req.params.playerName);
	}else{
		var temp = head;
		while(temp.next != null){
			temp = temp.next;
		}
		temp.next = new playerManager(req.params.roomName, req.params.playerName);
	}
	console.log(head);
	res.status(200).send(true);
});

app.post('/renewConnection/:roomName/:playerName', function (req, res) {
	console.log('RENEW: ' + req.params.roomName + ' ' + req.params.playerName);
	var temp = head;
	while(temp.next != null){
		temp = temp.next;
		if(temp.roomName == req.params.roomName && temp.playerName == req.params.playerName){
			break;
		}
	}
	temp.renew();
	res.status(200).send(true);
});

app.get('/deletePlayer/:roomName/:playerName', function (req, res) {
	console.log('RESTful DELETE');
	deletePlayer(req, res, 'remote');
});

app.get('/deleteAllRooms', function (req, res) {
	console.log('Database Cleared & Reset');
	ref.set({
		placeholder:'Johnson Han'
	});
	res.status(200).send('Delete All Rooms Request Sent');
}); 

//Port Setting
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//utility function
function deletePlayer(req, res, owner){
	console.log('delete Player Function is called');
	if(owner == 'remote')	var roomName = req.params.roomName;
	else var roomName = req;
	if(owner == 'remote')	var playerName = req.params.playerName;
	else var roomName = res;
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

function playerManager(roomName, playerName){
	this.roomName = roomName;
	this.playerName = playerName;
	this.token = 10;
	this.next = null;
	this.renew = function(){
		token += 5;
	}
}

var head = null;

//Timer
setInterval(function(){ 
	if(head != null){
		if(head.token <= 0){
			deletePlayer(head.roomName, head.playerName);
		}
	}
}, 5000);



