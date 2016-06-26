 var login = true;
 window.onload = load;
 function load(){
 	document.getElementsByTagName('body')[0].onkeydown = function(e) { 
      var ev = e || event; 
      if(ev.keyCode == 13) {action();} 
      // else if(ev.keyCode == 27)    
  	} 
 	login_status(true);
 	setTimeout(function(){
 		$('input').css('opacity','1');
 		$('input').css('width','80%');
 	}, 500);
 	// login_status(false);
 } 
 function sweet(message){
 	var x;
    if (confirm(message) == true) {
        x = true;
    } else {
        x = false;
    }
    return x;
 }
 function action(){  
 	if(login == false) return;
 	var roomName = document.getElementById('room-name').value;
 	var playerName = document.getElementById('player-name').value;
 	if(roomName == '' || playerName == ''){
 		alert('room or player name cannot be empty');
 		return;
 	}else{
 		hasRoom(roomName,playerName);
 	}
 }
 function login_status(determine){
 	if(determine == true){
 		console.log('login status::::: TRUE');
 		$('#section-main').css('-webkit-filter', 'blur(5px)');
	 	$('#section-main').css('pointer-events', 'none');
	 	$('#section-login').css('visibility', 'visible');
	 	$('#section-login').css('-webkit-filter', 'blur(0px)');
	 }else{
 		console.log('login status::::: FALSE');
 		login = false;
	 	$('#section-main').css('-webkit-filter', 'blur(0px)');
	 	$('#section-main').css('pointer-events', 'auto');
	 	$('body').css('background-color', 'teal');
	 	$('#section-login').css('height', '0px');
	 	$('#section-login').css('width', '0px');
	 	$('#section-login').css('visibility', 'hidden');
	 	$('#section-login').css('opacity', '0');
	 	$('#section-login').css('-webkit-filter', 'blur(0px)');
	 }
 }  