
function LinkedList(){
    this.data = [];
    this.length = this.data.length;
    this.add = add;
    this.print = print;
    this.remove = remove;
    this.addPing = addPing;
    this.minusPing = minusPing;
    this.pingIncrement = 5;
    this.setPingIncrement = setPingIncrement;
}
function setPingIncrement(newPing){
    this.pingIncrement = newPing;
}
function addPing(username){
    for(var x = 0;x < this.data.length;x++){
        if(this.data[x].username == username){
            this.data[x].ping += this.pingIncrement;
            return username + " ping added";
        }
    }
    return false;
}
function minusPing(username){
    for(var x = 0;x < this.data.length;x++){
        if(this.data[x].username == username){
            this.data[x].ping -= this.pingIncrement;
            return username + " ping minus-ed";
        }
    }
    return false;
}
function add(username){
    var user = {};
    user["username"] = username;
    user["ping"] = 15;
    this.data.push(user);
    return username + " added";
}
function remove(username){
    for(var x = 0;x < this.data.length;x++){
        if(this.data[x].username == username){
            this.data.splice(x,1);
            return username + " removed";
        }
    }
    return false;
}
function print(){
    console.log("|||||||||||||||||||||||||||||||||");
    for(var x = 0;x < this.data.length;x++){
        console.log(this.data[x].username + '  ' + this.data[x].ping);
    }
    console.log("--------------------------------");
} 