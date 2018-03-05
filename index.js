var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
let clients = []
let nameCounter = 0;
let names = ["John","Joe","Hellen","Smith","Dylan","Sukh","Mandy","Michael","Travis","Jeremy","Kris","Mathew"];
let messages = []


function Client(name,color,id){
  this.name = name;
  this.color = color;
  this.id = id;
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


function formatDate(time){
  let h = time.getHours();
  let m = time.getMinutes();
  let s = time.getSeconds();
  // These lines the seconds are two digits
  if (h < 10) {h = "0"+h;};
  if (m < 10) {m = "0"+m;};
  if (s < 10) {s = "0"+s;};
  // This formats your string to hours:minutes:seconds
  return(h+":"+m+":"+s);
}

io.on('connection', function(socket){
    console.log('a user connected');

    let newclient;
    do{
      newclient = new Client(names[nameCounter++%names.length],"black",socket.id);
    } while(!(clients.find(function(client){ return client.name == newclient.name}) === undefined));

    clients.push(newclient);
    console.log(newclient);
    

    socket.emit("update client",newclient);
    io.emit("update clients",clients);

    socket.emit("history messages",messages);

    socket.on('disconnect', function(){
      console.log('user disconnected');

      clients = clients.filter(function(client){return client.id != socket.id});
      io.emit("update clients",clients);   
      console.log(clients);   
    });

    socket.on('chat message', function(message){
        message.time = formatDate(new Date());
        messages.push(message);
        io.emit('chat message', message);
    });

    socket.on("update client",function(change){

      let newClient;
      //This is a change name branch
      if(change.length == 2){
          let oldClient = change[0];
          newClient = change[1];
        
        if( clients.find(function(client){ return client.name == newClient.name}) === undefined){
          let tempClient = clients.find(function(client){ return client.name == oldClient.name });
          
          tempClient.name = newClient.name;
        }
      }else{
        newClient = change[0]
        let tempClient = clients.find(function(client){ return client.name == newClient.name });
        tempClient.color = newClient.color; //change the color
      }

      socket.emit("update client",newClient);
      io.emit("update clients",clients);


    });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});