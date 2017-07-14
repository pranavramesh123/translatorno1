//Basic Setup
var express = require('express');
var path = require("path");
var app = express();
//FireBase Setup
var rootURL = "https://enghack2016.firebaseio.com";
var roomsURL = "https://enghack2016.firebaseio.com/rooms";
var allowedURL = "*";
// var allowedURL = "http://www.survivalgameonline.com";
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
    res.setHeader('Access-Control-Allow-Origin', allowedURL);
    response.render('index');
});

app.get('/getRootURL', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', allowedURL);
    res.status(200).jsonp(roomsURL);
});

app.post('/createConnection/:roomName/:playerName', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', allowedURL);
	console.log('Created: ' + req.params.roomName + ' ' + req.params.playerName);
	playerManager.add(req.params.roomName, req.params.playerName);
	res.status(200).send(true);
});

app.post('/renewConnection/:roomName/:playerName', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', allowedURL);
	playerManager.addPing(req.params.roomName, req.params.playerName);
	console.log('RENEW: ' + req.params.roomName + ' ' + req.params.playerName);
	res.status(200).send(true);
});

app.get('/deletePlayer/:roomName/:playerName', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', allowedURL);
	console.log('RESTful DELETE');
	deletePlayer(req, res, 'remote');
});

app.get('/deleteAllRooms', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', allowedURL);
	console.log('Database Cleared & Reset');
	playerManager.data = [];
	ref.set({
		placeholder:'Johnson Han'
	});
	res.status(200).send('Delete All Rooms Request Sent');
});

//Port Setting
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => {
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
	roomRef.once("value", snapshot => {
	  if(!snapshot.hasChild(playerName)){
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
// Play Manager
var playerManager = new LinkedList();
//Timer
setInterval(() => {
	console.log("Janitor in action with: " + playerManager.length() + ' players');
	if(playerManager.length() == 0) return;
	for(var x = 0;x < playerManager.length();x++){
		var individual = playerManager.data[x];
		var feedback = playerManager.minusPing(individual.roomname, individual.username);
		console.log(feedback);
		if(individual.ping <= 0)
			deletePlayer(individual.roomname, individual.username, 'local');
	}
	playerManager.print();
}, playerManager.pingIncrement * 1000);

// LinkedList.js
function LinkedList(){
    this.data = [];
    this.length = getLength;
    this.add = add;
    this.print = print;
    this.remove = remove;
    this.addPing = addPing;
    this.minusPing = minusPing;
    this.pingIncrement = 5;
    this.setPingIncrement = setPingIncrement;
}
function getLength(){
	return this.data.length;
}
function setPingIncrement(newPing){
    this.pingIncrement = newPing;
}
function addPing(roomname, username){
    for(var x = 0;x < this.data.length;x++){
        if(this.data[x].username == username && this.data[x].roomname == roomname){
            this.data[x].ping += this.pingIncrement;
            return username + " ping added";
        }
    }
    return false;
}
function minusPing(roomname, username){
    for(var x = 0;x < this.data.length;x++){
        if(this.data[x].username == username && this.data[x].roomname == roomname){
            this.data[x].ping -= this.pingIncrement;
            if(this.data[x].ping <= 0){
            	this.remove(roomname,username);
            	return username + " removed"
            }
            return username + " ping minus-ed";
        }
    }
    return false;
}
function add(roomname, username){
    var user = {};
    user["username"] = username;
    user['roomname'] = roomname;
    user["ping"] = 15;
    this.data.push(user);
    return username + " added";
}
function remove(roomname,username){
    for(var x = 0;x < this.data.length;x++){
        if(this.data[x].username == username && this.data[x].roomname == roomname){
            this.data.splice(x,1);
            return username + " in room: " + roomname + " removed";
        }
    }
    return false;
}
function print(){
    console.log("|||||||||||||||||||||||||||||||||");
    for(var x = 0;x < this.data.length;x++){
        console.log(this.data[x].roomname + '  ' + this.data[x].username + '  ' + this.data[x].ping);
    }
    console.log("--------------------------------");
}
