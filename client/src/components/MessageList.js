import { UserOutlined } from "@ant-design/icons";
// import React, { useState, useEffect } from "react";

function MessageList(props) {
  const currentUser = JSON.parse(localStorage.getItem("userCreadentials")).user
    .userData;

  const filteredUsers = props.employeeData.filter(
    (user) => user.email !== currentUser.email
  );
  return (
    <div className="messagelist">
      <div className="messagelist--container">
        <h1>Messages</h1>
        <div className="item-list">
          {filteredUsers.length !== 0 ? (
            filteredUsers.map((employee) => (
              <div
                className={`item ${
                  props.currentChatReceiver.email === employee.email
                    ? "active"
                    : ""
                }`}
                onClick={() => props.sendCurrentChatReceiver(employee)}
                key={employee.id}
              >
                <UserOutlined />
                <p>
                  <strong>{employee.name}</strong>
                  {/* <br />
                <span>Hi, how are you today?</span> */}
                </p>
              </div>
            ))
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageList;
