import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Button } from "antd";
import { useState } from "react";
import { Toaster, toast } from "sonner";

function LoginOTP() {
  const [otp, setOTP] = useState("");
  const navigate = useNavigate();
  let { role } = useParams();

  const handleOtpChange = (value) => {
    if (value !== "") {
      setOTP(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (role === "admin") {
        const response = await axios.post("http://localhost:3001/api/verify", {
          otpReq: otp
        });
        localStorage.setItem("userCreadentials", JSON.stringify(response.data));
      }
      if (role === "employee") {
        const response = await axios.post(
          "http://localhost:3001/api/employee/verify",
          {
            otpReq: otp
          }
        );
        localStorage.setItem("userCreadentials", JSON.stringify(response.data));
      }
      // localStorage.setItem("userToken", response.data.token);
      navigate("/");
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = error.response.data.error;
        toast.error(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error(error.message);
      }
    }
  };
  return (
    <div className="login otp">
      <div className="login--container">
        <h1>Phone verification</h1>
        <p>Please enter your code that send to your phone</p>
        <Input.OTP
          onKeyPress={(event) => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
          onChange={handleOtpChange}
        />
        <Button type="primary" block onClick={handleSubmit}>
          Submit
        </Button>
        {/* <div className="resend">
          <p>Code not receive?</p>
          <p>Send again</p>
        </div> */}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default LoginOTP;
