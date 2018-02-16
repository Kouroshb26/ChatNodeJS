var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

let messages = []
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/styles.css',function(req,res){
    res.sendFile(__dirname + "/styles.css");
});

app.get("/client.js",function(req,res){
  res.sendFile(__dirname + "/client.js");
});


io.on('connection', function(socket){
    console.log('a user connected');
    socket.emit("history messages",messages);
    
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });


    socket.on('chat message', function(message){
        message.time = new Date();
        messages.push(message);
        io.emit('chat message', message);
    });


});

http.listen(3000, function(){
  console.log('listening on *:3000');
});