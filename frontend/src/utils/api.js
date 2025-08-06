// API utility functions for handling authenticated requests

const API_BASE_URL = "http://localhost:8081";

// Get token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Remove token from localStorage (for logout)
export const removeAuthToken = () => {
  localStorage.removeItem("authToken");
  // Dispatch custom event to notify App component
  window.dispatchEvent(new Event("tokenChanged"));
};

// Logout function
export const logout = () => {
  removeAuthToken();
  // Redirect to login page
  window.location.href = "/login";
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

// Specific API functions
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    // Store token in localStorage
    localStorage.setItem("authToken", data.token);
    // Dispatch custom event to notify App component
    window.dispatchEvent(new Event("tokenChanged"));
  }

  return { response, data };
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (response.ok) {
    // Store token in localStorage after successful signup
    localStorage.setItem("authToken", data.token);
    // Dispatch custom event to notify App component
    window.dispatchEvent(new Event("tokenChanged"));
  }

  return { response, data };
};

// Get current user details
export const getUserDetails = async () => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_BASE_URL}/api/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Handle unauthorized responses (token expired/invalid)
    if (response.status === 401) {
      removeAuthToken();
      window.location.href = "/login";
      throw new Error("Authentication failed. Please login again.");
    }

    return response;
  } catch (error) {
    console.error("Get user details failed:", error);
    throw error;
  }
};

// File upload function for FormData
export const uploadFile = async (formData) => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_BASE_URL}/api/documents/upload?file`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData,
    });

    // Handle unauthorized responses (token expired/invalid)
    if (response.status === 401) {
      removeAuthToken();
      window.location.href = "/login";
      throw new Error("Authentication failed. Please login again.");
    }

    return response;
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};

export const getAllReports = async () => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_BASE_URL}/api/documents`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Handle unauthorized responses (token expired/invalid)
    if (response.status === 401) {
      removeAuthToken();
      window.location.href = "/login";
      throw new Error("Authentication failed. Please login again.");
    }

    return response;
  } catch (error) {
    console.error("Get all reports failed:", error);
    throw error;
  }
};

export const deleteReport = async (id) => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_BASE_URL}/api/documents/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Handle unauthorized responses (token expired/invalid)
    if (response.status === 401) {
      removeAuthToken();
      window.location.href = "/login";
      throw new Error("Authentication failed. Please login again.");
    }

    return response;
  } catch (error) {
    console.error("Delete report failed:", error);
    throw error;
  }
};

export const downloadFile = async (id) => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_BASE_URL}/api/documents/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Handle unauthorized responses (token expired/invalid)
    if (response.status === 401) {
      removeAuthToken();
      window.location.href = "/login";
      throw new Error("Authentication failed. Please login again.");
    }

    if (!response.ok) {
      throw new Error("Download failed");
    }

    return response;
  } catch (error) {
    console.error("Download file failed:", error);
    throw error;
  }
};

// Helper function to trigger file download in browser
export const downloadFileAndSave = async (id, fileName) => {
  try {
    const response = await downloadFile(id);

    // Get the blob from response
    const blob = await response.blob();

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || `document_${id}`;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Download and save failed:", error);
    throw error;
  }
};
