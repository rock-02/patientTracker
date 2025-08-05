import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../utils/api";
import "./Login.css"; // Reuse the same styling

const Register = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");
  if (token) {
    // Redirect to home page if already logged in
    navigate("/");
  }

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
    country: "",
    state: "",
    pincode: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Prepare user data for registration - matching backend structure
      const userData = {
        email: formData.email,
        name: formData.name,
        password: formData.password,
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
        state: formData.state,
        pincode: formData.pincode,
      };

      // Use the API utility function
      const { response, data } = await registerUser(userData);

      if (response.ok) {
        // Handle successful registration
        console.log("Registration successful:", data.message);
        console.log("Token stored in localStorage");

        // Navigate to home page after successful registration (user is now logged in)
        navigate("/");
      } else {
        // Handle error response
        setErrors({
          submit: data.message || "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors({
        submit: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);

    // Set guest credentials
    const guestEmail = "guest@gmail.com";
    const guestPassword = "guest@1234";

    try {
      // Use the API utility function with guest credentials
      const { response, data } = await loginUser(guestEmail, guestPassword);

      if (response.ok) {
        // Handle successful login
        console.log("Guest login successful:", data.message);
        console.log("Token stored in localStorage");

        // Navigate to dashboard/home page after successful login
        navigate("/");
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
      <div className="register-wrapper">
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
            onClick={() => navigate("/login")}
          >
            ← Back to Login
          </button>
        </div>

        {/* Registration Form */}
        <div className="login-form-container">
          <form onSubmit={handleSubmit} className="login-form">
            <h2>Create Patient Account</h2>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={errors.name ? "error" : ""}
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

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
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your 10-digit phone number"
                className={errors.phone ? "error" : ""}
              />
              {errors.phone && (
                <span className="error-message">{errors.phone}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  className={errors.city ? "error" : ""}
                />
                {errors.city && (
                  <span className="error-message">{errors.city}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter your state"
                  className={errors.state ? "error" : ""}
                />
                {errors.state && (
                  <span className="error-message">{errors.state}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Enter your country"
                  className={errors.country ? "error" : ""}
                />
                {errors.country && (
                  <span className="error-message">{errors.country}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="pincode">Pincode</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="Enter your 6-digit pincode"
                  className={errors.pincode ? "error" : ""}
                />
                {errors.pincode && (
                  <span className="error-message">{errors.pincode}</span>
                )}
              </div>
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
                  placeholder="Create a password"
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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? "error" : ""}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            {errors.submit && (
              <div className="error-message submit-error">{errors.submit}</div>
            )}

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account"
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
              <p>Already have an account?</p>
              <button
                type="button"
                className="create-account-link"
                onClick={() => navigate("/login")}
              >
                Sign In Here
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="security-notice">
            <div className="security-icon">🔒</div>
            <div className="security-text">
              <p>
                <strong>Secure Registration</strong>
              </p>
              <p>
                Your personal information is protected with 256-bit SSL
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

export default Register;
