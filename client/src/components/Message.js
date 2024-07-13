import MessageList from "./MessageList";
import ChatBox from "./ChatBox";
import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";

function Message(props) {
  const socket = io("http://localhost:3001");
  socket.on("connect", () => {
    console.log(socket.id);
    console.log(socket.connected); // x8WIv7-mJelg7on_ALbx
  });
  const [employeeData, setEmployeeData] = useState([]);
  const [currentChatReceiver, setCurrentChatReceiver] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("userCreadentials")).user
    .userData;
  const room = "911";
  const getCurrentChatReceiver = (val) => {
    setCurrentChatReceiver(val);
    socket.emit("join_room", room);
  };
  useEffect(() => {
    setEmployeeData(props.employeeData);
  }, [props.employeeData]);
  return (
    <div className="message">
      <div className="message--container">
        <MessageList
          sendCurrentChatReceiver={getCurrentChatReceiver}
          employeeData={employeeData}
          currentChatReceiver={currentChatReceiver}
        />
        <ChatBox
          currentChatReceiver={currentChatReceiver}
          room={room}
          socket={socket}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}

export default Message;
