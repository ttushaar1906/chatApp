import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { FaVideo, FaArrowLeft, FaUserCircle } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import {
  AiOutlineArrowLeft,
  AiOutlineClockCircle,
  AiOutlineMessage,
  AiOutlineMore,
  AiOutlinePhone,
  AiOutlineSend,
  AiOutlineSmile,
  AiOutlineTeam,
  AiOutlineUser,
  AiOutlineUsergroupAdd,
  AiOutlineVideoCamera,
} from "react-icons/ai";

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
      const currentTime = new Date().toLocaleTimeString([], {
        // empty array -> it let the browser decide the locale environment automatically
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {!loggedIn ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
              {/* Logo and Title */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <AiOutlineMessage className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Giggle
                </h1>
                <p className="text-gray-500">Connect and chat with friends</p>
              </div>

              {/* Input Fields */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <AiOutlineUser className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <AiOutlineUsergroupAdd className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter room name"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        connectToRoom();
                      }
                    }}
                  />
                </div>
              </div>

              {/* Connect Button */}
              <button
                onClick={connectToRoom}
                disabled={!name || !room}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                Join Chat Room
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <div className="bg-white shadow-lg border-b">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <AiOutlineMessage className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Giggle</h1>
              </div>
            </div>
          </div>
          <div className="flex-1 max-w-4xl mx-auto w-full p-4">
            <div className="bg-white rounded-2xl shadow-xl h-full flex flex-col overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={logout}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <AiOutlineArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <AiOutlineTeam className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">{room}</h2>
                    <p className="text-sm text-blue-100">
                      {messageList.length > 0
                        ? `${
                            new Set(messageList.map((m) => m.author)).size
                          } participants`
                        : "No messages yet"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <AiOutlineVideoCamera className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <AiOutlinePhone className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <AiOutlineMore className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messageList.length === 0 ? (
                <div className="text-center py-8">
                  <AiOutlineMessage className="w-12 h-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                messageList.map((val, key) => {
                  const isCurrentUser = val.author === name;
                  return (
                    <div
                      key={key}
                      className={`flex ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          isCurrentUser ? "text-right" : "text-left"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {!isCurrentUser && (
                            <div className="w-6 h-6 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                              <AiOutlineUser className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <p className="text-xs text-gray-500 font-medium">
                            {val.author}
                          </p>
                          <div className="flex items-center gap-1">
                            <AiOutlineClockCircle className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {val.time}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`p-3 rounded-2xl shadow-sm ${
                            isCurrentUser
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md"
                              : "bg-white text-gray-800 rounded-bl-md border"
                          }`}
                        >
                          <p className="break-words">{val.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messageEndRef} />

          

              <div className="border-t bg-white p-4">
                <div className="flex items-end gap-3 relative">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="w-full p-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-gray-50 focus:bg-white transition-colors"
                      value={message}
                      // onChange={handleTyping}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <button
                      onClick={() => setShowEmoji(!showEmoji)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <AiOutlineSmile className="w-5 h-5 text-gray-500" />
                    </button>
                    {showEmoji && (
                      <div className="absolute right-12 bottom-0.5">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    <AiOutlineSend className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
