function Client(name,color){
    this.name = name;
    this.color = color;
}
$(function () {
    var socket = io();
    let client;

    let clients = [];

    $('form').submit(function(){
        let message = $('#message').val().trim();

        if (message.substr(0,10) === "/nickcolor"){

            socket.emit("update client color",{name: client.name, color: "#"+ message.split(" ")[1] });
        
        }else if (message.substr(0,5) === "/nick"){
            socket.emit("update client name",[client,{name: message.split(" ")[1], color : client.color }]);
        
        }else if(message != ""){
            socket.emit('chat message',{ name : client.name,
                                        message : message});
        }
        $('#message').val('');
        return false;
    });

    socket.on('chat message', function(message){
        $('#messages').append($('<li client='+message.name+'>').text(message.message));

        $("#messages li[client=" +message.name+"]").css("color",message.color);
    });

    socket.on("history messages",function(messages){
        for (let message of messages){
            $('#messages').append($('<li client='+message.name+'>').text(message.message));
            $("#messages li[client=" +message.name+"]").css("color",message.color);
        };
    })


    socket.on("update client",function(newClient){
        client = newClient;
        console.log(client);
    });

    socket.on("update clients", function(newClients){
        clients = newClients;
        console.log(clients);
    });



});


