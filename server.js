import   express  from  'express';
import { createServer }  from 'node:http';
import { join } from 'node:path';
import  { Server } from 'socket.io';
import cors  from "cors";
import  {nanoid} from "nanoid";
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors());

const rooms = [];

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// app.post("/join-room",(req,res)=>{
function joinRoom(roomId){
  for(let room of rooms){
    if(room.roomId == roomId){
      // need to send the socket to the user who have created the room.
      return {
        roomId,
        success:true,
        message : "Joined the room successfully"
      }

    }
  }
  console.log("Rooms not found : ",rooms);
  return {
    roomId,
    success:false,
    message : "Invalid roomId"
  }
}
// });

// app.get("/create-room",(req,res)=>{
function createRoom(id){
  const roomId = id || nanoid(10);
  const time = Date.now();
  rooms.push({
    roomId,
    time
  });

  return {roomId, time, message : "Waiting for the player to join the room"};
}
// });

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  // console.log(socket)
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('mark-point', (data) => {
      console.log(data);
      // socket.broadcast("set-points",{data});
      io.emit("set-points",{data});
  });


  // socket.on("create-room",(data)=>{
  //   console.log("rooms", socket.rooms);
  //   // created the room
  //   const roomInfo = createRoom();
  //   console.log("roomInfo ",roomInfo);
  //   socket.join(roomInfo.roomId);
  //   io.to(roomInfo.roomId).emit("create-room", roomInfo);
  //   // io.emit("create-room", roomInfo);
  // })


  socket.on("join-room",(data)=>{
    console.log("before rooms arrays : ", rooms);
    console.log("Socket rooms : ", socket.rooms);
    // created the room
    console.log("roomId: ", data);
    const roomInfo = joinRoom(data.roomId);
    // If room already exist and there are already 2 people then don't allow others to join the same room
    if(roomInfo.success){
      console.log("room Found : ",roomInfo.roomId);
      socket.join(roomInfo.roomId);
      io.to(roomInfo.roomId).emit("join-room", {roomInfo,socketId : socket.id});
    }else{
      const roomInfo = createRoom(data.roomId);
      console.log("roomInfo ",roomInfo);
      socket.join(roomInfo.roomId);
      io.to(roomInfo.roomId).emit("join-room", {roomInfo, socketId : socket.id});
    }
    console.log("after rooms arrays : ", rooms);
  })

  // socket.on('set-points', (data) => {
  //     console.log(data);
  //     socket.emit("broadcast",{data});
  // });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
})