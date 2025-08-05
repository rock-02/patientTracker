import { Routes, Route } from 'react-router-dom'
import "./App.css";
import "./index.css";
import HomePage from "./pages/HomePage";
import UploadReport from "./pages/uploadReport";
import GetAllReports from "./pages/GetAllReports";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/upload" element={<UploadReport />} />
      <Route path="/records" element={<GetAllReports />} />
    </Routes>
  );
}

export default App;
