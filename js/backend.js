var baseURL, rootURL, ref = null;
$.get( "http://www.survivalgameonline.com/getRootURL", function(data) {
// $.get( "http://localhost:5000/getRootURL", function(data) {
	rootURL = data;
	baseURL = rootURL + '/rooms';
	ref = new Firebase(baseURL);
});
function hasRoom(roomName,playerName){
	getRoomStatus(roomName);
	ref.once("value", function(snapshot) {
	  if(snapshot.hasChild(roomName) == true){
	  	console.log(snapshot.hasChild(roomName));
	  	console.log('room exist');
	  	hasPlayer(roomName,playerName);
	  }else{
	  	console.log('room free');
	  	createRoom(roomName,playerName);
 		login_status(false);
	  }
	});
}
function hasPlayer(roomName,playerName){
	console.log('hasPlayer function called');
	var usersRef = ref.child(roomName);
	usersRef.once("value", function(snapshot) {
	  if(snapshot.hasChild(playerName) == true){
	  	console.log('player exist');
		alert('player with the same name exist in this room');
		document.getElementById('room-name').value = '';
	  	document.getElementById('player-name').value = '';
	  }else{
	  	console.log('player Name is free');
	  	if(getRoomSize() >= 3){
	  		alert('Room Full');
	  		console.log('Room Full ');
	  		console.log('Room Full ' + getRoomSize());
	  		document.getElementById('room-name').value = '';
		  	document.getElementById('player-name').value = '';
	  	}
	  	else{
		  	addPlayer(roomName,playerName);
	 		login_status(false);
	  	} 
	  }
	});
}
function createRoom(roomName,playerName){
	ref.once("value", function(snapshot) {
	  if(snapshot.hasChild(roomName) == true){
	  		return false;
	  }else{
	  	console.log('creating Room: ' + roomName);
		var newPlayerDetail = {
			'positionX': 0,
			'positionY': 0,
			'health': 4
		};
		var newPlayer = {};
		newPlayer[playerName] = newPlayerDetail;
		var newRoom = {};
		newRoom[roomName] = newPlayer;
		ref.update(newRoom);
		return true;
	  }
	});
}
function addPlayer(roomName,playerName){ 
	var usersRef = ref.child(roomName);
	usersRef.once("value", function(snapshot) {
	  if(snapshot.hasChild(playerName)){
	  	console.log('cannot create player ' + playerName +' : pick a different name');
	  }else{ 
  		console.log('adding player ' + playerName +' in ' + roomName);
		var newPlayerDetail = {
			'positionX': 0,
			'positionY': 0,
			'health': 4
		};
		var newPlayer = {};
		newPlayer[playerName] = newPlayerDetail;
		usersRef.update(newPlayer);
	  }
	});
} 
function deleteRoom(roomName){
	ref.once("value", function(snapshot) {
	  if(snapshot.hasChild(roomName) == false){
	  	console.log(roomName + ' DNE');
	  }else{
		var usersRef = ref.child(roomName);
		usersRef.set(null);
		console.log(roomName + ' deleted');
	  }
	});
}

function deletePlayer(roomName,playerName){ 
	$.ajax({
	  	url: rootURL + '/deletePlayer/' + roomName + '/' + playerName, 
	  	headers: { 'upadmin': 'upadmin' },
	  	type : 'GET',
	}).complete(function(data) {
    	if(data == true) console.log(roomName + '/' + playerName + ' deleted');
	    else console.log(playerName + ' DNE');
	});
}

function deleteAllRooms(){
	$.ajax({
	  	url: rootURL + '/deleteAllRooms', 
	  	headers: { 'upadmin': 'upadmin' },
	  	type : 'GET',
	}).complete(function() {
    	console.log('Database Clear Request Sent');
	});
}

function updatePlayerStatus(roomName,playerName,x,y,health){
	var roomRef = ref.child(roomName);
	roomRef.once("value", function(snapshot) {
	  if(snapshot.hasChild(playerName) == false){
		//console.log('Cannot updatePlayerStatus: room/playerName DNE');
	  }else{
	  	//console.log('updating Player status');
		var playerRef = ref.child(roomName+'/'+playerName);
		playerRef.update({'positionX':x});
		playerRef.update({'positionY':y});
		playerRef.update({'health':health});
	  }
	});
}
function getRoomStatus(roomName){
	var segmentRef = ref.child(roomName);
	segmentRef.on("value", function(snapshot) {
	  special_key_pair = snapshot.val();
	  return snapshot.val();
	}, function (errorObject) {
	  //console.log("Then read failed: " + errorObject.code);
	  return null;
	});
	return null;
}
function getRoomSize(){ 
	var sum = 0;
	for(i in special_key_pair) sum++;
	return sum;
}
function getPlayerStatus(roomName,playerName){
	var segmentRef = ref.child(roomName+'/'+playerName);
	segmentRef.on("value", function(snapshot) {
	  console.log(snapshot.val());
	  return snapshot.val();
	}, function (errorObject) {
	  console.log("Then read failed: " + errorObject.code);
	  return null;
	});
}

setInterval(function(){ 
	$.ajax({
	  	url: rootURL + '/renewConnection/' + roomName + '/' + playerName,
	  	headers: { 'upadmin': 'upadmin' },
	  	type : 'POST',
	}).complete(function(data) {
    	console.log('renewed status');
	});
}, 5000);
