import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./App.css";
import "./index.css";
import HomePage from "./pages/HomePage";
import UploadReport from "./pages/uploadReport";
import GetAllReports from "./pages/GetAllReports";
import Login from "./auth/Login";
import Register from "./auth/Register";

function App() {
  const [token, setToken] = useState(null);

  // Simple token check on mount and updates
  useEffect(() => {
    const checkToken = () => {
      const currentToken = localStorage.getItem("authToken");
      setToken(currentToken);
    };

    // Initial check
    checkToken();

    // Set up interval to check for token changes
    const interval = setInterval(checkToken, 1000);

    return () => clearInterval(interval);
  }, []);

  console.log("Current token:", token); // Debug log

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/upload"
          element={token ? <UploadReport /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/records"
          element={token ? <GetAllReports /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
