var baseURL = "https://enghack2016.firebaseio.com/rooms";
var ref = new Firebase(baseURL);

function createRoom(roomName,playerName){
	ref.once("value", function(snapshot) {
	  if(snapshot.hasChild(roomName) == true){
	  	console.log('cannot create Room ' + roomName +' : pick a different name');
	  }else{ 
	  	console.log('creating Room: ' + roomName);
		var newPlayerDetail = {
			'positionX': 0,
			'positionY': 0,
			'health': 100
		};
		var newPlayer = {};
		newPlayer[playerName] = newPlayerDetail;
		var newRoom = {};
		newRoom[roomName] = newPlayer;
		ref.update(newRoom);
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
			'health': 100
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

function deleteAllRoom(){ 
	console.log('All rooms deleted');
	ref.set({
		placeholder:'palceholder'
	});
}

function updatePlayerStatus(roomName,playerName,x,y,health){
	var roomRef = ref.child(roomName);
	roomRef.once("value", function(snapshot) {
	  if(snapshot.hasChild(playerName) == false){
		console.log('Cannot updatePlayerStatus: room/playerName DNE');	  	
	  }else{
	  	console.log('updating Player status');
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
	  console.log(snapshot.val());
	  return snapshot.val();
	}, function (errorObject) {
	  console.log("Then read failed: " + errorObject.code);
	  return null;
	});
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