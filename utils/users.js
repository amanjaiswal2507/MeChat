const users =[];

//join user to chat
function userJoin(id,username,room){
    const user = {id,username,room};
    users.push(user);
    return user;
}

//Get current user
function getCurrentUser(id){
    return users.find(user => user.id===id);
}

//user leaves chat
function userLeave(id){
    const index = users.findIndex(user => user.id===id);
    if(index!==-1)
    {
        return users.splice(index,1)[0];
    }
}
//to get room users
function getRoomUsers(room){
    return users.filter(user=>user.room===room);
}

//to get count of room users
function getUserCount(room){
    var count=0;
    for(var i=0;i<users.length;i++)
    {
        if(users[i].room===room)count=count+1;
    }
    return count;
}
module.exports={userJoin,getCurrentUser,userLeave,getRoomUsers,getUserCount};