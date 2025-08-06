import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllReports,
  deleteReport,
  downloadFileAndSave,
  isAuthenticated,
  getUserDetails,
} from "../utils/api";

const GetAllReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated()) {
        navigate("/login");
        return;
      }

      console.log("Component mounted, loading data...");

      // Fetch reports
      setLoading(true);
      setError(null);

      try {
        const response = await getAllReports();

        if (!response.ok) {
          // Handle specific error responses
          if (response.status === 401) {
            navigate("/login");
            return;
          } else if (response.status === 403) {
            setError(
              "Access denied. Please check your authentication and try again."
            );
            return;
          }

          // Try to get error message from response
          const errorData = await response.text();
          console.log("Error response:", errorData);

          // Check if it's a "no files found" message
          if (
            errorData.includes("No files found for user") ||
            errorData.includes("Failed to retrieve file list")
          ) {
            console.log("No files found - showing empty state");
            setReports([]);
            setLoading(false);
            return;
          }

          throw new Error(`HTTP error: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        console.log("Reports data received:", data);
        // Ensure data is always an array, even if empty
        setReports(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching reports:", err.message);

        // Check if the error message indicates no files found
        if (
          err.message.includes("No files found for user") ||
          err.message.includes("Failed to retrieve file list")
        ) {
          console.log("No files found in catch block - showing empty state");
          setReports([]);
          setLoading(false);
          return;
        }

        // Check if it's a network error
        if (
          err.message.includes("Failed to fetch") ||
          err.message.includes("NetworkError")
        ) {
          setError(
            "Network error. Please check your internet connection and try again."
          );
        } else {
          setError(
            err.message || "Failed to load reports. Please try again later."
          );
        }
      } finally {
        setLoading(false);
      }

      // Fetch user details
      fetchUserDetails();
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const fetchUserDetails = async () => {
    try {
      setUserLoading(true);
      console.log("Fetching user details...");

      const response = await getUserDetails();

      if (response.ok) {
        const data = await response.json();
        console.log("User details fetched:", data);
        setUserDetails(data);
      } else {
        throw new Error(`Failed to fetch user details: ${response.status}`);
      }
    } catch (error) {
      console.error("User details fetch error:", error);
      // Don't set main error for user details failure
    } finally {
      setUserLoading(false);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllReports();

      if (!response.ok) {
        // Handle specific error responses
        if (response.status === 401) {
          navigate("/login");
          return;
        } else if (response.status === 403) {
          setError(
            "Access denied. Please check your authentication and try again."
          );
          return;
        }

        // Try to get error message from response
        const errorData = await response.text();
        console.log("Error response:", errorData);

        // Check if it's a "no files found" message
        if (
          errorData.includes("No files found for user") ||
          errorData.includes("Failed to retrieve file list")
        ) {
          console.log("No files found - showing empty state");
          setReports([]);
          return;
        }

        throw new Error(`HTTP error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log("Reports data received:", data);
      // Ensure data is always an array, even if empty
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching reports:", err.message);

      // Check if the error message indicates no files found
      if (
        err.message.includes("No files found for user") ||
        err.message.includes("Failed to retrieve file list")
      ) {
        console.log("No files found in catch block - showing empty state");
        setReports([]);
        return;
      }

      // Check if it's a network error
      if (
        err.message.includes("Failed to fetch") ||
        err.message.includes("NetworkError")
      ) {
        setError(
          "Network error. Please check your internet connection and try again."
        );
      } else {
        setError(
          err.message || "Failed to load reports. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, fileName) => {
    try {
      console.log("Downloading file:", fileName);
      await downloadFileAndSave(id, fileName);
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

      const response = await deleteReport(id);

      if (response.ok) {
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
      {/* User Profile Section */}
      {userDetails && (
        <div className="user-profile-section">
          <div className="user-info">
            <div className="user-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <div className="user-details">
              <h2>{userDetails.name}</h2>
              <div className="user-contact">
                <p>
                  <strong>Email:</strong> {userDetails.email}
                </p>
                <p>
                  <strong>Phone:</strong> {userDetails.phone}
                </p>
              </div>
              <div className="user-address">
                <p>
                  <strong>Location:</strong> {userDetails.city},{" "}
                  {userDetails.state}, {userDetails.country}
                </p>
                <p>
                  <strong>Pincode:</strong> {userDetails.pincode}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="reports-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
        <h1>📁 My Medical Reports</h1>
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
            <h3>No Medical Reports Yet</h3>
            <p>
              You haven't uploaded any medical reports yet. Start by uploading
              your first report to keep track of your medical history.
            </p>
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
