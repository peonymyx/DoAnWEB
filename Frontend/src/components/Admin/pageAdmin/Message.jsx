import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
} from "@material-tailwind/react";
import SendIcon from "@mui/icons-material/Send";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

// eslint-disable-next-line react/prop-types
const Message = ({ role }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("lastMessage")) || []
  );

  useEffect(() => {
    // Lắng nghe tin nhắn mới từ server
    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      localStorage.setItem(
        "lastMessage",
        JSON.stringify([...messages, newMessage])
      );
    });

    // Dọn dẹp kết nối khi component bị huỷ
    return () => socket.off("message");
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        role: role,
        timestamp: Date.now(),
      };

      socket.emit("message", newMessage);
      setMessage("");
    }
  };

  return (
    <div className="flex h-[760px] sm:h-[580px] justify-center items-center">
      <Card className="w-full sm:w-[700px] md:w-[900px] lg:w-[1100px] shadow-lg">
        <CardHeader className="content-header bg-cyan-600 text-white">
          <h1 className="font-bold text-3xl text-center p-4">
            Tư Vấn Trực Tiếp
          </h1>
        </CardHeader>
        <CardBody className="flex flex-col md:flex-row">
          <div className="list-user w-full md:w-64 bg-slate-400 rounded-r-lg p-4 mb-5 md:mb-0">
            <p className="text-white text-2xl font-semibold">Người Dùng</p>
            <p className="text-lg">
              {localStorage.getItem("lastMessage")
                ? JSON.parse(localStorage.getItem("lastMessage"))[0]?.username
                : ""}
            </p>
          </div>
          <div className="message-box flex-grow ml-0 md:ml-4">
            <div className="chat-window h-96 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg p-4">
              {messages.map((item, index) => {
                const formattedTime = new Date(item.timestamp).toLocaleString();
                if (item.role === "user") {
                  return (
                    <div key={index} className="flex justify-start mb-2">
                      <div className="bg-slate-300 text-black rounded-md p-2 text-xl">
                        {item.text}
                      </div>
                    </div>
                  );
                } else if (item.role === "admin") {
                  // Xử lý tin nhắn của admin
                  return (
                    <div key={index} className="flex justify-end mb-2">
                      <div className="bg-blue-300 text-black rounded-md p-2 text-xl">
                        {item.text}
                        <br />
                        <small className="text-gray-500">{formattedTime}</small>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className="flex justify-end mb-2">
                      <div className="bg-blue-300 text-black rounded-md p-2 text-xl">
                        {item.text}
                        <br />
                        <small className="text-gray-500">{formattedTime}</small>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
            <div className="chat-input flex mt-4">
              <Input
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                value={message}
                placeholder="Enter your message"
                className="flex-grow rounded-lg py-2 px-4 text-xl outline-none focus:border-cyan-500"
              />
              <Button
                onClick={sendMessage}
                className="bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 ml-2"
              >
                <SendIcon />
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Message;
