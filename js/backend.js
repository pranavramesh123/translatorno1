var baseURL = "https://enghack2016.firebaseio.com/rooms";
var ref = new Firebase(baseURL);
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
	  	if(getRoomSize >= 4){
	  		console.log('Room Full');
	  		alert('Room Full');
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

function deletePlayer(roomName,playerName){debugger;
	var roomRef = ref.child(roomName);
	roomRef.once("value", function(snapshot) {
	  if(snapshot.hasChild(playerName) == false){
	  	console.log(playerName + ' DNE');
	  }else{
		var playerRef = roomRef.child(playerName);
		playerRef.set(null);
		console.log(playerRef + ' deleted');
	  }
	});
}

function deleteAllRoom(){
	console.log('All rooms deleted');
	ref.set({
		placeholder:'Johnson Han'
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
		playerRef.update({'positionY':x});
		playerRef.update({'health':health});
	  }
	});
}
function getRoomStatus(roomName){
	var segmentRef = ref.child(roomName);
	segmentRef.on("value", function(snapshot) {
	  var unique = snapshot.val();
	  return unique;
	}, function (errorObject) {
	  //console.log("Then read failed: " + errorObject.code);
	  return null;
	});
	return null;
}
function getRoomSize(roomName){
	var segmentRef = ref.child(roomName);
	segmentRef.on("value", function(snapshot) {
	  var size=0;
	  for(i in snapshot.val()) size++;
	  return size;
	}, function (errorObject) {
	  return 0;
	});
	return 0;
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
