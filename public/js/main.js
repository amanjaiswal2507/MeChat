const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const chatRoom = document.querySelector('.chat-room');
const countUser = document.getElementById('count');



//Get username and room from url
const {username,room} =Qs.parse(location.search,{ignoreQueryPrefix:true});

const socket = io();

//join chatroom
socket.emit('joinroom',{username,room});//now catch on server side

console.log(username, room);


//Get room and users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputRoomUsers(users);
    outputUserCount(users,room);
});

//Message from server to client side
socket.on("message", (message) => {
    //console.log(message);
    outputMessage(message);
    

    //scroll down
    chatMessages.scrollTop= chatMessages.scrollHeight;
});

//Message submit
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    //get message text
    const msg = e.target.elements.msg.value; //targeting the id
    console.log(msg);
    if(msg!==' '){
        //emitting a message to server
        socket.emit("chatMessage", msg);
        

        //clear after texting msg
        e.target.elements.msg.value=" ";
        e.target.elements.msg.focus();
    }    
});

//Output message to DOM
function outputMessage(message) {
    var song=new Audio('audio.mp3');
    if(message!==' ')song.play();
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username}<span>&nbsp;${message.time}</span></p>
                    <p class="text">
                        ${message.text}    
                    </p>`;
                    document.querySelector('.chat-messages').appendChild(div);
}

//add room name to dom
function outputRoomName(room){
    roomName.innerText = room;
    
}




//add users to DOM
function outputRoomUsers(users){
    userList.innerHTML = `${users.map(user =>`<li>${user.username}</li>`).join('')}`;
}

function outputUserCount(users,room){
    const arr=[];
    for(var i=0;i<users.length;i++)
    {
        arr.push(users.filter(user=>user.room===room));
    }
    countUser.innerText=arr.length;

}