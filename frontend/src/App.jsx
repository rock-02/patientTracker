import { Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";
import HomePage from "./pages/HomePage";
import UploadReport from "./pages/uploadReport";
import GetAllReports from "./pages/GetAllReports";
import Login from "./auth/Login";
import Register from "./auth/Register";

function App() {
  const token = localStorage.getItem("authToken");

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/upload" element={token ? <UploadReport /> : <Login />} />
      <Route path="/records" element={token ? <GetAllReports /> : <Login />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default App;
