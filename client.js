function Client(name,color){
    this.name = name;
    this.color = color;
}
let oldscrollTop; 
function scroll(){
    let messages = document.getElementById("messages");

    messages.scrollTop = messages.scrollHeight;
    oldscrollTop = messages.scrollHeight;
}
$(function () {
    var socket = io();
    let client;
    let clients = [];

    $('form').submit(function(){
        let message = $('#message').val().trim();

        if (message.substr(0,10) === "/nickcolor"){            
            socket.emit("update client",[{name: client.name, color: "#"+ message.split(" ")[1] }]);
        
        }else if (message.substr(0,5) === "/nick"){
            socket.emit("update client",[client,{name: message.split(" ")[1], color : client.color, id:client.id}]);
           
        
        }else if(message != ""){
            socket.emit('chat message',{ name : client.name,
                                        message : message,
                                        color : client.color});
        }
        $('#message').val('');
        return false;
    });

    socket.on('chat message', function(message){
        //Adding Messages
        let htmlMessage = $('<li>').append($("<p>").text(message.name + ": " + message.message),$("<span class=time>").text(message.time)).css("color",message.color);
        if(message.name == client.name){
            htmlMessage.css("font-weight","bold");
        }

        $('#messages').prepend(htmlMessage);
        scroll();
    });

    //Load previous messages
    socket.on("history messages",function(messages){
        for (let message of messages){
            let htmlMessage = $('<li>').append($("<p>").text(message.name + ": " + message.message),$("<span class=time>").text(message.time)).css("color",message.color);
            $('#messages').prepend(htmlMessage);
        };
        scroll();
    });

    //Update client name.
    socket.on("update client",function(newClient){
        var name = document.cookie.split(';').find(function(key){return key.substring(0,5) == "name="});
        
        if(client == null && name  != undefined){
            client = newClient;
            name = name.substring(5,name.length);
            socket.emit("update client",[client,{name:name, color : client.color, id:client.id}]);
        }else{
            client = newClient;
            document.cookie = "name="+client.name+";";
        }

        console.log(client.name);
        $("#user li").text("Hello User: "+client.name);
        //console.log(client);
    });

    //When someone new joins or leaves
    socket.on("update clients", function(newClients){
        clients = newClients;
        clients = clients.filter(function(otherClient){ return otherClient.name != client.name});
        //$('#users').html("");
        $('#users').html("<li>Users online:</h2>");
        clients.forEach(function(client){$('#users').append("<li class=online>"+client.name+"</li>")});
        //console.log(clients);
    });



});


