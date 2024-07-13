import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "antd";
import { useState } from "react";
import { Toaster, toast } from "sonner";

function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    toast.success("Phone number submitted");
    try {
      const response = await axios.post("http://localhost:3001/api/login", {
        phoneNumber: phoneNumber
      });

      toast.success("OTP sent successfully:", response.data.message);
      navigate("/otp/admin");
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error("Login error:", error.response.data.error);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error("Error:", error.message);
      }
      throw error;
    }
  };

  return (
    <div className="login">
      <div className="login--container">
        <h1>Login</h1>
        <p>Please enter your phone number to sign in</p>
        <Input
          // onKeyPress={(event) => {
          //   if (!/[0-9]/.test(event.key)) {
          //     event.preventDefault();
          //   }
          // }}
          onChange={(event) => setPhoneNumber(event.target.value)}
          placeholder="Enter your phone number"
        />
        <Button type="primary" block onClick={handleSubmit}>
          Next
        </Button>
        <p>Password-less authentication methods.</p>
        <p>
          Are you an employee? <a href="/employee/login">Login here</a>
        </p>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default Login;
