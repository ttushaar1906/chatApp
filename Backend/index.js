const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');

const app = express();

app.use(cors()); // Make sure CORS is configured correctly
app.use(express.json());

const server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000", // Replace with your frontend's origin
        methods: ["GET", "POST"],
        credentials: true
    }
});

 // emit : it is used to transfer data from client to server
 // socket.on is used to receive data 
 // join_room is the name of the socket
 // data is the message that is comming 
 
io.on('connection', (socket) => {
    console.log('A user connected with socket ID:', socket.id);

    socket.on('join_room', (data) => {
        socket.join(data);
        console.log("User joined room:", data);
    });

    socket.on('send_message',(data)=>{
        console.log(data);
        socket.to(data.room).emit("receive_message", data.content)
    })
    socket.on('disconnect', () => {
        console.log("User Disconnected:", socket.id);
    });
});
