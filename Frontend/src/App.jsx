import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;
const CONNECTION_PORT = "http://localhost:3000"; // Ensure this matches your backend

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  // After Login
  const [message, setMessage] = useState();
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket = io(CONNECTION_PORT, {
      transports: ["websocket", "polling"], // Ensure both transports are supported
    });

    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("Connection error:", err.message);
    });
  }, [CONNECTION_PORT]);

  const connectToRoom = () => {
    setLoggedIn(true);
    socket.emit("join_room", room);
    console.log("Joined room", room);
  };

  // function to send message
  const sendMessage = () => {
    let messageContent = {
      room: room,
      content: {
        author: name,
        message: message,
      },
    };

    socket.emit("send_message", messageContent);
    setMessageList([...messageList, messageContent.content]);
    setMessage("");
  };
  return (
    <>
      <div className="bg-chatBubbleSent">
        {!loggedIn ? (
          <div className=" flex justify-center items-center h-screen">
            <div className="flex border flex-col w-full">
              <h2 className=" text-center font-bold text-textColor text-3xl my-4">
                Chat App
              </h2>
              <input
                type="text"
                className=" my-2 p-2 w-1/2 mx-auto focus:outline-none rounded-md text-textColor font-medium"
                placeholder="Name..."
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <input
                type="text"
                className=" my-2 p-2 w-1/2 mx-auto focus:outline-none rounded-md text-textColor font-medium"
                placeholder="Room.."
                onChange={(e) => {
                  setRoom(e.target.value);
                }}
              />
              <button
                onClick={connectToRoom}
                className="bg-secondary block m-auto py-2 px-3 font-semibold rounded-md my-2 hover:opacity-95"
              >
                Enter Chat
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center w-3/5 mx-auto h-screen">
            <div className="border p-4">
              {messageList.map((val, key) => {
                return (
                  <h1>
                    <h2 className=" font-bold">{val.author} </h2>
                   <p> {val.message} </p>
                  </h1>
                );
              })}
            </div>
            <div className="flex border">
              <input
                type="text"
                placeholder="Type your message..."
                className="py-2 px-3 w-full border-none rounded-none focus:outline-none"
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
              <button
                className="bg-secondary py-2 px-4 font-semibold hover:opacity-90"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
