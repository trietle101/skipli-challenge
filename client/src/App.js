import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import EmployeeLogin from "./pages/EmployeeLogin";
import LoginOTP from "./pages/LoginOTP";
import Main from "./pages/Main";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp/:role" element={<LoginOTP />} />
          <Route path="/employee/login" element={<EmployeeLogin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
