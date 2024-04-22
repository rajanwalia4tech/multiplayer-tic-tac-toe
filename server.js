const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const cors = require("cors");
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors());


app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');
    // console.log(socket)
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('mark-point', (data) => {
        console.log(data);
        // socket.broadcast("set-points",{data});
        io.emit("set-points",{data});
    });

    // socket.on('set-points', (data) => {
    //     console.log(data);
    //     socket.emit("broadcast",{data});
    // });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});