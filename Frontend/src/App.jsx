import { useEffect, useState } from "react";
import io from 'socket.io-client'
import "./App.css";

let socket;
const CONNECTION_PORT = 'localhost:3000'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')

  useEffect(()=>{
    socket = io(CONNECTION_PORT) // this will establish connection
  },[CONNECTION_PORT])

  const connectToRoom = ()=>{
    socket.emit('join_room', room)
    console.log("hello", room);
    
  }
  return (
    <>
      <div className="bg-chatBubbleSent">
        {!loggedIn ? (
          <div className=" flex justify-center items-center h-screen">
            <div className="flex border flex-col w-full">
              <h2 className=" text-center font-bold text-textColor text-3xl my-4">Chat App</h2>
              <input
                type="text"
                className=" my-2 p-2 w-1/2 mx-auto focus:outline-none rounded-md text-textColor font-medium"
                placeholder="Name..."
                onChange={(e)=>{setName(e.target.value)}}

              />
              <input
                type="text"
                className=" my-2 p-2 w-1/2 mx-auto focus:outline-none rounded-md text-textColor font-medium"
                placeholder="Room.."
                onChange={(e)=>{setRoom(e.target.value)}}

              />
              <button onClick={connectToRoom} className="bg-secondary block m-auto py-2 px-3 font-semibold rounded-md my-2 hover:opacity-95">
                Enter Chat
              </button>
            </div>
          </div>
        ) : (
          <h1>you are logged in</h1>
        )}
      </div>
    </>
  );
}

export default App;
