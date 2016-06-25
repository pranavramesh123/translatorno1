window.onload = function() {
	console.log('DOM Ready');
    document.getElementsByTagName('body')[0].onkeydown = function(e) { 
      var ev = e || event; 
      if(ev.keyCode == 38 || ev.keyCode == 87) {registerEvent('jump');} 
      if(ev.keyCode == 37 || ev.keyCode == 65) {registerEvent('left');} 
      if(ev.keyCode == 68 || ev.keyCode == 39) {registerEvent('right');} 
      if(ev.keyCode == 40 || ev.keyCode == 83) {registerEvent('down');} 
      if(ev.keyCode == 32 || ev.keyCode == 32) {registerEvent('attack');} 
   } 
};
var action_log = '';	
function registerEvent(message){
	function clear_action_log(){
		action_log = '';
	} 
	if(message == 'jump') action_log += 'j';
	else if(message == 'left') action_log += 'a';
	else if(message == 'right') action_log += 'd';
	else if(message == 'attack') action_log += ' ';
	else if(message == 'down') action_log += 's';
	console.log(action_log);
}