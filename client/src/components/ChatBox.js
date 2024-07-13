import { UserOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Input, Button, Form } from "antd";
import MyMessage from "./MyMessage";
import TheirMessage from "./TheirMessage";

function ChatBox({ currentChatReceiver, room, socket, currentUser }) {
  const [messages, setMessages] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [form] = Form.useForm();
  var currentdate = new Date();
  const sendMessage = async () => {
    if (messages) {
      const messageData = {
        user: currentUser.name,
        text: messages,
        room: room,
        time:
          currentdate.getHours() +
          ":" +
          currentdate.getMinutes() +
          ":" +
          currentdate.getSeconds()
      };
      await socket.emit("send_message", messageData);
      form.resetFields();
    }
  };
  useEffect(() => {
    socket.on("receive_message", (message) => {
      setMessageList((list) => [...list, message]);
    });
  }, [socket]);
  return (
    <div className="chatbox">
      <div
        className="chatbox--container"
        hidden={Object.keys(currentChatReceiver).length !== 0 ? false : true}
      >
        <div className="header">
          <UserOutlined />
          <h1>{currentChatReceiver.name}</h1>
        </div>
        <div className="chats">
          {messageList.map((message, index) =>
            message.user === currentUser.name ? (
              <MyMessage key={index} message={message} />
            ) : (
              <TheirMessage key={index} message={message} />
            )
          )}
        </div>
        <Form className="inputs" form={form} onFinish={sendMessage}>
          <Form.Item name="name">
            <Input
              placeholder="Text Message"
              onChange={(e) => setMessages(e.target.value)}
            />
          </Form.Item>
          <Button
            size="large"
            type="primary"
            shape="circle"
            icon={<ArrowUpOutlined />}
            htmlType="submit"
          />
        </Form>
      </div>
    </div>
  );
}

export default ChatBox;
