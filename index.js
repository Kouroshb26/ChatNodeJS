var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
let clients = []
let nameCounter = 0;
let names = ["John","Joe","Hellen","Smith","Dylan","Sukh","Mandy","Michael","Travis"];
let messages = []


function Client(name,color){
  this.name = name;
  this.color = color;
}

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

    let client = new Client(names[nameCounter++%names.length],"black")
    clients.push(client);
    console.log(client);
    

    socket.emit("update client",client);
    io.emit("update clients",clients);

    socket.on('disconnect', function(){
      console.log('user disconnected');
      
    });

    socket.on('chat message', function(message){
        message.time = new Date();
        messages.push(message);
        io.emit('chat message', message);
    });

    socket.on("update client name",function(change){
      let oldClient = change[0];
      let newClient = change[1];
      
      if( clients.find(function(client){ return client.name == this },newClient.name) === undefined){
        let tempClient = clients.find(function(client){ return client.name == this },oldClient.name);
        
        tempClient.name = newClient.name;
        socket.emit("update client",newClient);
        io.emit("update clients",clients);
      }

    });

    socket.on("update client color", function(newClient){

      
      let tempClient = clients.find(function(client){ return client.name == this },newClient.name);

      //Update clients array for color
      tempClient.color = newClient.color;

      socket.emit("update client",newClient);
      io.emit("update clients",clients);
    });


});

http.listen(3000, function(){
  console.log('listening on *:3000');
});