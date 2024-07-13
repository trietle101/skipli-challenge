import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "antd";
import { useState } from "react";
import { Toaster, toast } from "sonner";

function EmployeeLogin() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    toast.success("Phone number submitted:", email);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/employee/login",
        {
          email: email
        }
      );

      toast.success("OTP sent successfully:", response.data.message);
      navigate("/otp/employee");
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
        <p>for employee</p>
        <p>Please enter your email to sign in</p>
        <Input
          // onKeyPress={(event) => {
          //   if (!/[0-9]/.test(event.key)) {
          //     event.preventDefault();
          //   }
          // }}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
        />
        <Button type="primary" block onClick={handleSubmit}>
          Next
        </Button>
        <p>Password-less authentication methods.</p>
        <p>
          Are you an admin? <a href="/login">Login here</a>
        </p>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default EmployeeLogin;
