import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { FaVideo, FaArrowLeft, FaUserCircle } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";

let socket;
const CONNECTION_PORT = "http://localhost:3000";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);

  const messageEndRef = useRef(null); // Ref for the message end

  useEffect(() => {
    socket = io(CONNECTION_PORT, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("Connection error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((prevList) => [...prevList, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [messageList]);

  // Scroll to the bottom when a new message is added
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageList]);

  const connectToRoom = () => {
    if (name && room) {
      setLoggedIn(true);
      socket.emit("join_room", room);
      console.log("Joined room", room);
    } else {
      alert("Please enter both name and room");
    }
  };

  const sendMessage = async () => {
    if (message.trim()) {
      const currentTime = new Date().toLocaleTimeString([], {  // empty array -> it let the browser decide the locale environment automatically
        hour: "2-digit",
        minute: "2-digit",
      });

      const messageContent = {
        room: room,
        content: {
          author: name,
          message: message,
          time: currentTime,
        },
      };

      await socket.emit("send_message", messageContent);
      setMessageList((prevList) => [...prevList, messageContent.content]);
      setMessage(""); // Clear input after sending
      setShowEmoji(false);
    }
  };

  const logout = () => {
    setLoggedIn(false);
    setRoom("");
    setMessageList([]);
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  return (
    <div className="bg-secondary">
      {!loggedIn ? (
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col w-max[1200px] w-[80%] rounded-md bg-chatBubbleSent shadow-lg p-6">
            <h2 className="text-center font-bold text-textColor text-3xl my-4">
              Whisper
            </h2>
            <input
              type="text"
              className="my-2 p-2 w-1/2 mx-auto focus:outline-none rounded-md text-textColor font-medium shadow-lg"
              placeholder="Name..."
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              className="my-2 p-2 w-1/2 mx-auto focus:outline-none rounded-md text-textColor font-medium shadow-lg"
              placeholder="Room.."
              onChange={(e) => setRoom(e.target.value)}
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
          <h1 className="text-center p-4 font-bold text-2xl">Whisper</h1>
          <div className="relative flex flex-col justify-center w-3/5 mx-auto h-[80vh] bg-chatBubbleSent border-2">
            <div className="flex bg-secondary z-50 align-middle justify-between py-2 px-4 border-b-2">
              <div className="flex gap-4 align-middle">
                <FaArrowLeft
                  className="my-auto cursor-pointer text-sm"
                  onClick={logout}
                />
                <FaUserCircle className="my-auto text-4xl" />
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
            <div className="p-4 overflow-y-auto flex-1 z-50">
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
                        className={`font-bold mb-1 ${
                          isCurrentUser
                            ? "text-textColor"
                            : "text-textColor"
                        }`}
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
                        <span className="text-xs text-black font-normal">{val.time}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={messageEndRef} /> {/* Auto-scroll target */}
            </div>
            <div className="flex border-t-2 z-50 ">
              <input
                type="text"
                placeholder="Type your message..."
                className="py-2 px-3 w-full border-none rounded-none focus:outline-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className=" bg-chatBubbleReceived py-2 px-4 font-bold hover:opacity-90 shadow-lg"
                onClick={() => setShowEmoji((prev) => !prev)}
              >
                😊
              </button>
              {showEmoji && (
                <div className="absolute bottom-12 right-4">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
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
  );
}

export default App;
