const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers,getUserCount} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'Me-chat ';

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//Run when client connects
io.on("connection", (socket) => {
    
    socket.on('joinroom',({username,room})=>{
        const user =userJoin(socket.id,username,room);
        socket.join(user.room); 
        //welcome current user
        socket.emit("message",formatMessage(botName,`<p style="color:blue;">Welcome to Me-Chat ${user.username}, Aman jaiswal <br>this side! check Room-Info for guests.</p>`));
        

        //Broadcast when a user connects,broadcast emit means when user connected it will show to everybody
        socket.broadcast.to(user.room).emit("message", formatMessage(botName,`<p style="color:blue;">${user.username} has joined the chat!</p>`));
        //send users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users: getRoomUsers(user.room)
        });

    });
    //console.log("New Web socket connection..");

   
    //listen for chatMessage
    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);
        //console.log(msg);
        io.to(user.room).emit("message", formatMessage(user.username,msg));
    });

     
    //run when disconnects
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit("message", formatMessage(botName,`<p style="color:blue;">${user.username} has left the chat!</p>`));
            io.to(user.room).emit('roomUsers',{
            room:user.room,
            users: getRoomUsers(user.room)
        });
        }
    });

    

});
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));