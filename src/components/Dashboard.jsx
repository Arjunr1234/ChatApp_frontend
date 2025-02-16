import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../contexts/authContext";
import io from "socket.io-client";
import ChatRequestNotification from "./ChatRequestNotify";
import { toast } from "sonner";
import { toastnotifyLeaveChat } from "../utils/notification";
import {
  getChatService,
  logoutService,
  sendMessageService,
} from "../services/service";
const fetchedMessages = [
  {
    _id: "67b0548c3e21122df7a3dcd1",
    senderId: "67aeec3727977afb039cb410",
    receiverId: "67add75a343ae8bfbd505788",
    message: "Hey, how are you?",
    time: new Date(),
  },
  {
    _id: "67b0548c3e21122df7a3dcd2",
    senderId: "67add75a343ae8bfbd505788",
    receiverId: "67aeec3727977afb039cb410",
    message: "I am good! What about you?",
    time: new Date(),
  },
  {
    _id: "67b0548c3e21122df7a3dcd3",
    senderId: "67aeec3727977afb039cb410",
    receiverId: "67add75a343ae8bfbd505788",
    message: "I am doing well, thanks!",
    time: new Date(),
  },
  {
    _id: "67b0548c3e21122df7a3dcd4",
    senderId: "67add75a343ae8bfbd505788",
    receiverId: "67aeec3727977afb039cb410",
    message: "What are you up to today?",
    time: new Date(),
  },
  {
    _id: "67b0548c3e21122df7a3dcd5",
    senderId: "67aeec3727977afb039cb410",
    receiverId: "67add75a343ae8bfbd505788",
    message: "Just working on a project.",
    time: new Date(),
  },
  {
    _id: "67b0548c3e21122df7a3dcd6",
    senderId: "67add75a343ae8bfbd505788",
    receiverId: "67aeec3727977afb039cb410",
    message: "That sounds great!",
    time: new Date(),
  },
  {
    _id: "67b0548c3e21122df7a3dcd7",
    senderId: "67aeec3727977afb039cb410",
    receiverId: "67add75a343ae8bfbd505788",
    message: "Yeah, it’s coming along well.",
    time: new Date(),
  },
  {
    _id: "67b0548c3e21122df7a3dcd8",
    senderId: "67add75a343ae8bfbd505788",
    receiverId: "67aeec3727977afb039cb410",
    message: "Let me know if you need help!",
    time: new Date(),
  },
  {
    _id: "67b0548c3e21122df7a3dcd9",
    senderId: "67aeec3727977afb039cb410",
    receiverId: "67add75a343ae8bfbd505788",
    message: "Thanks, I appreciate it!",
    time: new Date(),
  },
  {
    _id: "67b0548c3e21122df7a3dcda",
    senderId: "67add75a343ae8bfbd505788",
    receiverId: "67aeec3727977afb039cb410",
    message: "No problem, happy to help!",
    time: new Date(),
  },
];

const SOCKET_SERVER_URL = "http://localhost:5000"; // Backend URL
const socket = io(SOCKET_SERVER_URL);

const sampleUsers = [
  { userId: 1, name: "Arjun" },
  { userId: 2, name: "Rahul" },
  { userId: 3, name: "Sneha" },
  { userId: 4, name: "Vikram" },
  { userId: 5, name: "Anjali" },
];

function HomePage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const messageEndRef = useRef(null)
  const [chatRequest, setChatRequest] = useState(null);
  const { logout, auth } = useAuth();
  const [chatSession, setChatSession] = useState(false);


  useEffect(() => {
    if (auth?.userId) {
      socket.connect();

      socket.emit("join", { userId: auth.userId, userName: auth.userName });

      const handleUpdateUsers = (onlineUsers) => {
        setUsers(onlineUsers);
      };

      const handleChatNotification = ({ sender, name }) => {
        setChatRequest({ fromUserId: sender, userName: name });
      };

      const handleRequestAcceptedNotify = () => {
        notifyRequestAccept();
        setChatSession(true);
        
      };

      const handleRequestRejectNotify = () => {
        notifyRequestReject();
      };

      const handleNotfiyChatLeaved = ({ userId, userName }) => {
        notfiyChatLeaved(userName);
      };

     

      socket.on("updateUsers", handleUpdateUsers);
      socket.on("receiveChatNotification", handleChatNotification);
      socket.on("requestAcceptedNotify", handleRequestAcceptedNotify);
      socket.on("requestRejectNotify", handleRequestRejectNotify);
      socket.on("leavedChat", handleNotfiyChatLeaved);
      socket.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.off("updateUsers", handleUpdateUsers);
        socket.off("receiveChatNotification", handleChatNotification);
        socket.off("requestAcceptedNotify", handleRequestAcceptedNotify);
        socket.off("requestRejectNotify", handleRequestRejectNotify);
        socket.off("leavedChat", handleNotfiyChatLeaved);

        socket.disconnect();
      };
    }
  }, [auth]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({behavior:"smooth"})
  },[messages])

  useEffect(() => {
   if(selectedUser){
    fetchAllMessage(selectedUser.userId)
   }
  },[selectedUser])

  const handleReceiveMessage = (newMessage) => {
    setMessages((prev) => [...prev,newMessage])
    setMessageInput('')
  };

  
  const fetchAllMessage = async (id) => {
    try {
      
      const response = await getChatService(id);
      setMessages(response.messages)
      console.log("chat response; ", response);
    } catch (error) {
      console.log("Error in fetchAllMessage: ", error);
    }
  };

  const sendMessage = async () => {
    if (messageInput.trim() && selectedUser) {
    
      const receiverId = selectedUser.userId;
      const message = messageInput;
      try {
        
        const response = await sendMessageService(receiverId, message);
      } catch (error) {
        console.log(error);
      }
     
    }
  };

  const handleSelectUser = (user) => {
        setSelectedUser(user);
  };

  const notifyRequestReject = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "error",
      title: "Chat request rejected",
    });
  };

  const notfiyChatLeaved = (name) => {
    toastnotifyLeaveChat(name);
    setChatSession(false);
  };

  const notifyRequestAccept = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: "Chat request accepted",
    });
  };

  const sendChatRequest = () => {
    socket.emit("sendChatRequest", {
      sender: auth.userId,
      receiver: selectedUser.userId,
      name: auth.userName,
    });
    toast.success("Chat request sended...")
  };

  const handleAccept = (userId, userName) => {
    socket.emit("requestAccepted", { userId });
    setChatRequest("");
    setSelectedUser({ userId, name: userName });
    setChatSession(true);
    setMessages(fetchedMessages)
  };

  const handleReject = (userId) => {
    socket.emit("requestRejected", { userId });
    setChatRequest("");
  };

  const handleLeaveChat = () => {
    socket.emit("leaveChat", {
      userId: auth.userId,
      userName: auth.userName,
      rejectedUserId: selectedUser.userId,
    });
    setChatSession(false);
  };

  const confirmLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, log me out!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        logout();
        const repsose = await logoutService();
        if (auth?.userId) {
          socket.emit("disconnectUser", auth.userId);
        }
      }
    });
  };

  

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <nav className="bg-blue-600 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">ChatApp</h1>
        <button
          onClick={confirmLogout}
          className="bg-white cursor-pointer text-blue-600 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </nav>

      {chatRequest && (
        <ChatRequestNotification
          request={chatRequest}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}

      <div className="flex flex-grow">
        <div className="w-1/3 bg-white shadow-md p-4 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Online Users</h2>
          {users.filter((u) => u.userId !== auth?.userId).length > 0 ? (
            users
              .filter((u) => u.userId !== auth?.userId)
              .map((u) => (
                <div
                  key={u.userId}
                  className={`p-3 border-b cursor-pointer ${
                    selectedUser?.userId === u.userId
                      ? "bg-gray-200"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleSelectUser(u)}
                >
                  🟢 <span className="text-lg">{u.name}</span>
                </div>
              ))
          ) : (
            <p className="text-gray-600">No users online...</p>
          )}
        </div>

        <div className="w-2/3 flex flex-col">
          <div className="bg-white shadow-md p-4 text-lg font-bold border-b flex justify-between">
            {selectedUser
              ? `Chat with ${selectedUser.name}`
              : "Select a user to chat"}

            {selectedUser ? (
              !chatSession ? (
                <button
                  onClick={sendChatRequest}
                  className="p-2 bg-blue-400 cursor-pointer rounded-lg"
                >
                  Start Chat
                </button>
              ) : (
                <button
                  onClick={handleLeaveChat}
                  className="p-2 bg-blue-400 cursor-pointer rounded-lg"
                >
                  Leave Chat
                </button>
              )
            ) : (
              ""
            )}
          </div>

          <div className="flex-grow p-4 bg-gray-200 h-[400px] overflow-y-auto">
    {messages
      .filter(
        (m) =>
          m.senderId === selectedUser?.userId ||
          m.receiverId === selectedUser?.userId
      )
      .map((msg, index) => {
        const messageTime = new Date(msg.time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div
            key={index}
            className={`p-2 my-2 ${
              msg.senderId === auth.userId ? "text-right" : "text-left"
            }`}
          >
            <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg">
              {msg.message}
              <div className="text-xs text-gray-300 mt-1">{messageTime}</div>
            </div>
          </div>
        );
      })}
    <div ref={messageEndRef} />
  </div>

          {chatSession && selectedUser && (
            <div className="p-4 bg-white border-t flex">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="w-full p-2 border rounded-lg focus:outline-none"
              />
              <button
                onClick={sendMessage}
                className="ml-2 bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
