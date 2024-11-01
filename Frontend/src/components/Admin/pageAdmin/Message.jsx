import { useEffect, useState } from "react";
import io from "socket.io-client";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";

const socket = io("http://localhost:3000");

const Message = () => {
  const [message, setMessage] = useState("");
  const auth = useSelector((state) => state.auth.currentUser);
  const [messages, setMessages] = useState(
    localStorage.getItem(`messages_${auth?.username}`)
      ? JSON.parse(localStorage.getItem(`messages_${auth?.username}`))
      : []
  );

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  useEffect(() => {
    if (auth?.username) {
      localStorage.setItem(
        `messages_${auth.username}`,
        JSON.stringify(messages)
      );
    }
  }, [messages, auth?.username]);

  const sendMessage = () => {
    if (message) {
      const newMessage = {
        text: message,
        role: "user",
        username: auth.username,
      };
      socket.emit("message", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
    }
  };

  const toggleForm = () => {
    const form = document.getElementById("myForm");
    form.style.display = form.style.display === "none" ? "block" : "none";
  };

  if (!auth) return null;

  return (
    <div className="fixed bottom-2 right-2 z-30">
      <button
        className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-500 text-white flex items-center justify-center"
        onClick={toggleForm}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-8 h-8 md:w-10 md:h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
          />
        </svg>
      </button>

      <div
        id="myForm"
        className="w-full sm:w-80 h-[410px] p-1 rounded-md shadow-lg fixed bottom-16 right-0 sm:right-2 z-50 bg-white hidden"
      >
        <div className="h-[50px] w-full bg-cyan-600 rounded-md text-white p-3 flex justify-between items-center">
          <label className="text-xl">Tin nhắn</label>
          <button
            onClick={toggleForm}
            className="flex items-center justify-center w-8 h-8 cursor-pointer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
                fill="white"
                fillOpacity="0.1"
              ></path>
              <path
                d="M22.0278 15.0278C22.5647 15.0278 23 15.4631 23 16.0001C23 16.537 22.5647 16.9723 22.0278 16.9723L9.97222 16.9723C9.43528 16.9723 9 16.537 9 16.0001C9 15.4631 9.43528 15.0278 9.97222 15.0278L22.0278 15.0278Z"
                fill="white"
              ></path>
            </svg>
          </button>
        </div>
        <div className="box-chat h-[305px] w-full rounded-sm m-1 p-1 overflow-y-auto overflow-x-auto">
          {messages.map((item, index) => {
            if (item.role === "user") {
              return (
                <div key={index} className="text-right mb-2">
                  <div className="bg-blue-200 rounded-md p-2 inline-block max-w-[80%] break-words">
                    {item.text}
                  </div>
                </div>
              );
            } else {
              return (
                <div key={index} className="text-left mb-2">
                  <div className="bg-gray-200 rounded-md p-2 inline-block max-w-[80%] break-words">
                    {item.text}
                  </div>
                </div>
              );
            }
          })}
        </div>

        <div className="mess-input">
          <div className="flex items-center gap-x-3 rounded-lg p-2 bg-gray-200">
            <input
              type="text"
              value={message}
              className="w-full outline-none bg-transparent text-md font-medium"
              placeholder="Hãy nhập tin nhắn của bạn"
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="flex-shrink-0">
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
