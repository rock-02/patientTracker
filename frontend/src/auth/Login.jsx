import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/api";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  if (token) {
    // Redirect to home page if already logged in
    navigate("/");
  }
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Use the API utility function
      const { response, data } = await loginUser(
        formData.email,
        formData.password
      );

      if (response.ok) {
        // Handle successful login
        console.log("Login successful:", data.message);
        console.log("Token stored in localStorage");

        // Navigate to dashboard/home page after successful login
        navigate("/");
      } else {
        // Handle error response
        setErrors({
          submit:
            data.message || "Login failed. Please check your credentials.",
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({
        submit: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert("Forgot password functionality would be implemented here");
  };

  const handleCreateAccount = () => {
    navigate("/register"); // Navigate to registration page
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);

    // Set guest credentials
    const guestEmail = "guest@gmail.com";
    const guestPassword = "guest@1234";

    // Update form data to show guest credentials
    setFormData({
      email: guestEmail,
      password: guestPassword,
      rememberMe: false,
    });

    try {
      // Use the API utility function with guest credentials
      const { response, data } = await loginUser(guestEmail, guestPassword);

      if (response.ok) {
        // Handle successful login
        console.log("Guest login successful:", data.message);
        console.log("Token stored in localStorage");

        // Navigate to dashboard/home page after successful login
        navigate("/");

        window.location.reload(); // Reload to ensure guest session is set
      } else {
        // Handle error response
        setErrors({
          submit: data.message || "Guest login failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Guest login failed:", error);
      setErrors({
        submit: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Hospital Header */}
        <div className="hospital-header">
          <div className="hospital-logo">
            <div className="logo-icon">🏥</div>
            <h1>MediCare Hospital</h1>
          </div>
          <p className="tagline">Your Health, Our Priority</p>
          <button
            type="button"
            className="back-to-home"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>
        </div>

        {/* Login Form */}
        <div className="login-form-container">
          <form onSubmit={handleSubmit} className="login-form">
            <h2>Patient Portal Login</h2>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={errors.password ? "error" : ""}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Remember me
              </label>

              <button
                type="button"
                className="forgot-password-link"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </div>

            {errors.submit && (
              <div className="error-message submit-error">{errors.submit}</div>
            )}

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="guest-login-section">
              <div className="divider">
                <span>OR</span>
              </div>
              <button
                type="button"
                className="guest-login-button"
                onClick={handleGuestLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Logging in...
                  </>
                ) : (
                  <>👤 Guest Login</>
                )}
              </button>
              <p className="guest-info">Quick access with demo credentials</p>
            </div>

            <div className="additional-options">
              <p>Don't have an account?</p>
              <button
                type="button"
                className="create-account-link"
                onClick={handleCreateAccount}
              >
                Create Patient Account
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="security-notice">
            <div className="security-icon">🔒</div>
            <div className="security-text">
              <p>
                <strong>Secure Connection</strong>
              </p>
              <p>
                Your personal health information is protected with 256-bit SSL
                encryption.
              </p>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="emergency-contact">
            <h3>Need Immediate Medical Attention?</h3>
            <p>
              For medical emergencies, call <strong>911</strong> or visit the
              Emergency Room.
            </p>
            <p>
              For urgent care: <strong>(555) 123-CARE</strong>
            </p>
          </div>

          {/* Footer Links */}
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Use</a>
            <a href="#accessibility">Accessibility</a>
            <a href="#help">Help & Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
