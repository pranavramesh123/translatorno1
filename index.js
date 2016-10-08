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
	res.status(200).send(true);
});

app.post('/renewConnection/:roomName/:playerName', function (req, res) {
	var temp = head;
	while(temp.next != null){
		temp = temp.next;
		if(temp.roomName == req.params.roomName && temp.playerName == req.params.playerName){
			break;
		}
	}
	temp.renewToken();
	console.log('RENEW: ' + req.params.roomName + ' ' + req.params.playerName + ' ' + temp.getToken());
	res.status(200).send(true);
});

app.get('/deletePlayer/:roomName/:playerName', function (req, res) {
	console.log('RESTful DELETE');
	deletePlayer(req, res, 'remote');
});

app.get('/ping', function (req, res) {
	console.log("System PING!!!!: " + "SurvivalGameOnline");
	res.status(200).send("SurvivalGameOnline");
});

app.get('/deleteAllRooms', function (req, res) {
	console.log('Database Cleared & Reset');
	head = null;
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
	if(owner == 'remote')	var roomName = req.params.roomName;
	else var roomName = req;
	if(owner == 'remote')	var playerName = req.params.playerName;
	else var playerName = res;
	console.log('delete Player Function is called ' + roomName + ' ' + playerName);
	var roomRef = ref.child(roomName);
	roomRef.once("value", function(snapshot) {
	  if(snapshot.hasChild(playerName) == false){
	  	console.log(playerName + ' DNE ');
		if(owner == 'remote') res.status(404).send(false);
	  }else{
	  	//Deleting
		var playerRef = roomRef.child(playerName);
		playerRef.set(null);
	  	console.log(playerName + ' EXIST ');
		if(owner == 'remote') res.status(200).send(true);
	  }
	});
}

function playerManager(roomName, playerName){
	this.roomName = roomName;
	this.playerName = playerName;
	this.token_duration = 10;
	this.next = null;
	this.renewToken = function(){
		this.token_duration += 5;
	}
	this.getToken = function(){
		return this.token_duration;
	}
	this.deductToken = function(){
		this.token_duration -= 5;
	}
}

var head = null;

function equality(first, second){
	if(first.roomName == second.roomName && first.playerName == second.playerName) return true;
	else return false;
}

function deleteLinkedList(target){
	if(equality(head,target) || head == null){head = null; return;}
	console.log('target !+ had');
	var temp = head;
	while(1){
		if(equality(temp.next,target)){
			if(temp.next.next == null) temp.next = null;
			else temp.next = temp.next.next;
			return;
		}
		temp = temp.next;
	}
}

//Timer
setInterval(function(){ 
	if(head != null){  
		console.log('GAMGER ACTIVE');
		var temp = head;
		while(1) {
		    temp.deductToken();
			if(temp.getToken() <= 0){
				console.log('AUTO DELETION: ' + temp.roomName + ' ' + temp.playerName);
				deletePlayer(temp.roomName, temp.playerName, 'local');
				deleteLinkedList(temp);
				console.log('Player Manager:' + head);
			}
			if(temp.next == null) break;
			else temp = temp.next;
		} 
	}
}, 5000);



