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
  // Initialize token synchronously from localStorage to avoid initial null state
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));

  // Simple token check on mount and updates
  useEffect(() => {
    const checkToken = () => {
      const currentToken = localStorage.getItem("authToken");
      setToken(currentToken);
    };

    // Listen for storage changes (from other tabs)
    window.addEventListener("storage", checkToken);

    // Listen for custom token change events (from same tab)
    window.addEventListener("tokenChanged", checkToken);

    return () => {
      window.removeEventListener("storage", checkToken);
      window.removeEventListener("tokenChanged", checkToken);
    };
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
