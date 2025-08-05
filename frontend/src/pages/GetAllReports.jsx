import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GetAllReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Fetch all reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching reports from:", "http://localhost:8081/documents");

      const response = await fetch("http://localhost:8081/documents", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Reports fetched:", data);
        setReports(data);
      } else {
        throw new Error(`Failed to fetch reports: ${response.status}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError(
        "Failed to load reports. Please check if the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, fileName) => {
    try {
      console.log("Downloading file:", fileName);

      const response = await fetch(`http://localhost:8081/documents/${id}`, {
        method: "GET",
      });

      if (response.ok) {
        // Create blob from response
        const blob = await response.blob();

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } else {
        throw new Error("Download failed");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Download failed. Please try again.");
    }
  };

  const handleDelete = async (id, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      setDeleteLoading(id);
      console.log("Deleting file:", fileName);

      const response = await fetch(`http://localhost:8081/documents/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted report from the list
        setReports(reports.filter((report) => report.id !== id));
        alert("File deleted successfully!");
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const truncateFileName = (fileName, maxLength = 25) => {
    if (fileName.length <= maxLength) {
      return fileName;
    }
    return fileName.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="reports-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-container">
        <div className="error-message">
          <div className="error-icon">❌</div>
          <h2>Error Loading Reports</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchReports}>
            🔄 Try Again
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/")}>
            🏠 Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-container">
      {/* Header */}
      <div className="reports-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
        <h1>📁 Medical Reports</h1>
        <p>View, download, and manage your uploaded medical reports</p>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/upload")}
          >
            📤 Upload New Report
          </button>
          <button className="btn btn-secondary" onClick={fetchReports}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Reports Content */}
      <div className="reports-content">
        {reports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3>No Reports Found</h3>
            <p>You haven't uploaded any medical reports yet.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/upload")}
            >
              📤 Upload Your First Report
            </button>
          </div>
        ) : (
          <div className="reports-table-container">
            <div className="table-info">
              <h3>All Reports ({reports.length})</h3>
              <p>
                Total files: {reports.length} | Total size:{" "}
                {formatFileSize(
                  reports.reduce((sum, report) => sum + report.fileSize, 0)
                )}
              </p>
            </div>

            <div className="table-wrapper">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Upload Date</th>
                    <th>File Size</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td className="file-name-cell">
                        <div className="file-info">
                          <span className="file-icon">📄</span>
                          <span className="file-name" title={report.fileName}>
                            {truncateFileName(report.fileName)}
                          </span>
                        </div>
                      </td>
                      <td className="date-cell">
                        {formatDate(report.uploadDate)}
                      </td>
                      <td className="size-cell">
                        {formatFileSize(report.fileSize)}
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button
                            className="btn btn-download"
                            onClick={() =>
                              handleDownload(report.id, report.fileName)
                            }
                            title="Download file"
                          >
                            📥 Download
                          </button>
                          <button
                            className="btn btn-delete"
                            onClick={() =>
                              handleDelete(report.id, report.fileName)
                            }
                            disabled={deleteLoading === report.id}
                            title="Delete file"
                          >
                            {deleteLoading === report.id ? "⏳" : "🗑️"} Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAllReports;
