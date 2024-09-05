import { useEffect, useState } from "react";
import io from "socket.io-client";
import { FaVideo } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

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

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessageList([...messageList, data]);
    });
  });

  const connectToRoom = () => {
    setLoggedIn(true);
    socket.emit("join_room", room);
    console.log("Joined room", room);
  };

  // function to send message
  const sendMessage = async () => {
    let messageContent = {
      room: room,
      content: {
        author: name,
        message: message,
      },
    };

    await socket.emit("send_message", messageContent);
    setMessageList([...messageList, messageContent.content]);
    setMessage(""); // Log to confirm clearing
    console.log("Message after setMessage:", message);
  };

  const logout = () => setLoggedIn(false);
  return (
    <>
      <div className=" bg-secondary">
        {!loggedIn ? (
          <div className=" flex justify-center items-center h-screen">
            <div className="flex flex-col w-max[1200px] w-[80%] rounded-md bg-chatBubbleSent shadow-lg p-6">
              <h2 className=" text-center font-bold text-textColor text-3xl my-4">
                Chatgram
              </h2>
              <input
                type="text"
                className=" my-2 p-2 w-1/2 mx-auto focus:outline-none rounded-md text-textColor font-medium shadow-lg"
                placeholder="Name..."
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <input
                type="text"
                className=" my-2 p-2 w-1/2 mx-auto focus:outline-none rounded-md text-textColor font-medium shadow-lg"
                placeholder="Room.."
                onChange={(e) => {
                  setRoom(e.target.value);
                }}
              />
              <button
                onClick={connectToRoom}
                className="bg-secondary block m-auto py-2 px-3 font-semibold rounded-md my-2 hover:opacity-95 shadow-lg"
              >
                Enter Chat
              </button>
            </div>
          </div>
        ) : (
          <div className="p-2 bg-primary h-screen">
            <h1 className=" text-center p-4 font-bold text-2xl">Chatgram</h1>
            <div className="relative flex flex-col justify-center w-3/5 mx-auto h-[80vh] bg-chatBubbleSent border-2">
              <div className="flex bg-secondary z-50 align-middle justify-between py-2 px-4 border-b-2">
                <div className="flex gap-4 align-middle">
                  <FaArrowLeft className="my-auto cursor-pointer text-sm" onClick={logout} />
                  <FaUserCircle className="my-auto text-4xl"/>
                  <h2 className="font-extrabold text-lg bg-secondary my-auto">
                    {room}
                  </h2>
                </div>
                <div className="flex gap-6 align-middle">
                  <FaVideo className="my-auto cursor-pointer" />
                  <IoCall className="my-auto cursor-pointer" />
                  <BsThreeDotsVertical className="my-auto cursor-pointer" />
                </div>
              </div>
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src="../src/images/chatBg.avif"
                  className="w-full h-full object-cover opacity-10"
                  alt="Chat Background"
                />
              </div>
              <div
                className=" p-4 bg-gray-100 overflow-y-auto flex-1"
                style={{ position: "relative" }}
              >
                {messageList.map((val, key) => {
                  const isCurrentUser = val.author === name;
                  return (
                    <div
                      key={key}
                      className={`flex mb-2 ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[60%] ${
                          isCurrentUser ? "text-right" : "text-left"
                        }`}
                      >
                        <h2
                          className={`font-bold mb-1 text-textColor${
                            isCurrentUser
                              ? "text-chatBubbleSent"
                              : "text-chatBubbleReceived"
                          }`}
                          id={isCurrentUser ? "You" : "Other"}
                        >
                          {val.author}
                        </h2>
                        <div
                          className={`p-2 rounded-lg ${
                            isCurrentUser
                              ? "bg-secondary text-textColor"
                              : "bg-chatBubbleReceived text-textColor"
                          }`}
                        >
                          <p>{val.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex border-t-2 z-50 ">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="py-2 px-3 w-full border-none rounded-none focus:outline-none "
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                />
                <button
                  className="bg-secondary py-2 px-4 font-bold hover:opacity-90"
                  onClick={sendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
