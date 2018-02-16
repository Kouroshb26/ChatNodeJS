$(function () {
    var socket = io();
    let name = "Kourosh"
    let color = "rgb(255,0,0)"

    $('form').submit(function(){
        let message = $('#message').val().trim();

        if (message.substr(0,10) === "/nickcolor"){
            color = "#"+ message.split(" ")[1];
        }else if (message.substr(0,5) === "/nick"){
            socket.emit("name change", message.split(" ")[1]);
        }else if(message != ""){

            socket.emit('chat message',{ name : name,
                                        color : color,
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

});
