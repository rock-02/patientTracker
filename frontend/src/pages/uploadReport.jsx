import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFile, isAuthenticated } from "../utils/api";

const UploadReport = () => {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file", file);
      });

      // Use the uploadFile function from api utilities
      const response = await uploadFile(formData);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      await response.text(); // Or .json() if backend returns JSON
      setUploadProgress(100);
      setUploadSuccess(true);
    } catch (error) {
      console.error("Upload error:", error.message);
      setIsUploading(false);
      setUploadProgress(0);
      let errorMessage = "Upload failed. Please try again.";
      if (
        error.message.includes("500") &&
        error.message.includes("Duplicate entry")
      ) {
        const match = error.message.match(/"fileName":"([^"]+)"/);
        const fileName = match ? match[1] : "This file";
        errorMessage = `${fileName} already exists. Please rename or choose a different file.`;
      } else {
        errorMessage =
          "Upload failed. Please check your internet connection or try again later.";
      }
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFiles([]);
    setUploadSuccess(false);
    setUploadProgress(0);
  };

  if (uploadSuccess) {
    return (
      <div className="upload-container">
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h2>Upload Successful!</h2>
          <p>Your medical reports have been uploaded successfully.</p>
          <div className="success-details">
            <p>
              <strong>Files Uploaded:</strong> {files.length}
            </p>
            <p>
              <strong>Upload Date:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="success-actions">
            <button className="btn btn-primary" onClick={resetForm}>
              📋 Upload More Files
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/")}>
              🏠 Back to Home
            </button>
            <button
              className="btn btn-tertiary"
              onClick={() => navigate("/records")}
            >
              📁 View My Records
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-container">
      <div className="upload-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
        <h1>📋 Upload Medical Reports</h1>
        <p>Simply select and upload your medical files</p>
      </div>

      <div className="upload-form-container">
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-section">
            <h3>📁 Select Your Files</h3>
            <div className="file-upload-area">
              <div className="file-upload-box">
                <div className="upload-icon">📤</div>
                <p className="upload-text">
                  <strong>Choose files</strong> or drag and drop here
                </p>
                <p className="upload-subtext">
                  Supported formats: PDF, JPG, PNG, DOCX (Max 10MB per file)
                </p>
                <input
                  type="file"
                  id="files"
                  name="files"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.docx,.doc"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <label htmlFor="files" className="file-upload-btn">
                  Select Files
                </label>
              </div>

              {files.length > 0 && (
                <div className="selected-files">
                  <h4>Selected Files ({files.length}):</h4>
                  <ul className="file-list">
                    {files.map((file, index) => (
                      <li key={index} className="file-item">
                        <span className="file-icon">📄</span>
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {isUploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p>Uploading... {uploadProgress}%</p>
            </div>
          )}

          <div className="security-notice">
            <div className="security-icon">🔒</div>
            <div className="security-text">
              <h4>Your Privacy is Protected</h4>
              <p>
                All uploads are encrypted and secure. Your files are safely
                stored and accessible only to authorized personnel.
              </p>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-upload"
              disabled={isUploading || files.length === 0}
            >
              {isUploading ? "⏳ Uploading..." : "📤 Upload Files"}
            </button>
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadReport;
