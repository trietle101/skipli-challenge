import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Nav from "../components/Nav";
import Employee from "../components/Employee";
import Message from "../components/Message";
import Task from "../components/Task";
import axios from "axios";
import { toast } from "sonner";

function Main() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("1");
  const [employeeData, setEmployeeData] = useState([]);
  const getData = function (data) {
    setCurrentTab(data);
  };
  const currentUser = JSON.parse(localStorage.getItem("userCreadentials")).user
    .userData;
  const fetchEmployee = async () => {
    const fetchedEmployee = [];
    const token = JSON.parse(localStorage.getItem("userCreadentials")).token;
    try {
      await axios
        .get("http://localhost:3001/api/users/getAll", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
        .then((response) =>
          response.data.map((data) => fetchedEmployee.push(data))
        );
      setEmployeeData(fetchedEmployee);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.error);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        // toast.error("Error:", error.message);
        toast.error(error.message);
      }
    }
  };
  useEffect(() => {
    const userCreads = localStorage.getItem("userCreadentials");
    if (!userCreads) {
      navigate("/login", { replace: true });
      return;
    }
    if (currentUser.role === "admin") {
      setCurrentTab("1");
    }
    if (currentUser.role === "employee") {
      setCurrentTab("3");
    }

    fetchEmployee();
  }, [currentUser.role, navigate]);
  return (
    <div className="home">
      <Header employeeData={employeeData} />
      <div className="wrapper">
        <Nav sendData={getData} />
        <div className="content">
          {currentTab === "1" ? (
            <Employee employeeData={employeeData} />
          ) : currentTab === "2" ? (
            <Task />
          ) : (
            <Message employeeData={employeeData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;
