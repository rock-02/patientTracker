import React from "react";
import { useNavigate } from "react-router-dom";
import { logout, isAuthenticated } from "../utils/api";
import "../App.css";
const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // This will clear token and redirect to login
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="home-container">
      {/* Navigation Header */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>🏥 CityCare Hospital</h2>
          </div>
          <div className="nav-right">
            <ul className="nav-menu">
              <li>
                <a href="#services">Services</a>
              </li>
              <li>
                <a href="#departments">Departments</a>
              </li>
              <li>
                <a href="#doctors">Doctors</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
            <div className="nav-auth">
              {isAuthenticated() ? (
                <button onClick={handleLogout} className="btn btn-logout">
                  🚪 Logout
                </button>
              ) : (
                <button onClick={handleLogin} className="btn btn-login">
                  🔑 Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Care Hospital</h1>
          <p className="hero-subtitle">
            "Compassionate Care, Advanced Medicine, Trusted Excellence"
          </p>
          <p className="hero-description">
            Leading healthcare provider with 50+ years of excellence in medical
            care, serving our community with state-of-the-art facilities and
            dedicated professionals.
          </p>

          {/* Patient Portal in Hero Section */}
          <div className="hero-patient-portal">
            <h3>Patient Portal</h3>
            <p>Access your medical records and upload reports securely</p>
            <div className="hero-action-buttons">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/upload")}
              >
                📋 Upload Medical Reports
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/records")}
              >
                📁 My Medical Reports
              </button>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <h3>50,000+</h3>
              <p>Patients Served</p>
            </div>
            <div className="stat">
              <h3>200+</h3>
              <p>Expert Doctors</p>
            </div>
            <div className="stat">
              <h3>24/7</h3>
              <p>Emergency Care</p>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Modern Hospital Building"
          />
        </div>
      </header>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <h2>Our Medical Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🫀</div>
              <h3>Cardiology</h3>
              <p>
                Advanced heart care with cutting-edge technology and experienced
                cardiologists.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">🧠</div>
              <h3>Neurology</h3>
              <p>
                Comprehensive neurological care for brain and nervous system
                disorders.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">🦴</div>
              <h3>Orthopedics</h3>
              <p>
                Expert bone, joint, and muscle care with minimally invasive
                procedures.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">👶</div>
              <h3>Pediatrics</h3>
              <p>
                Specialized healthcare for infants, children, and adolescents.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">🚑</div>
              <h3>Emergency Care</h3>
              <p>
                24/7 emergency services with rapid response and critical care.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">🔬</div>
              <h3>Laboratory</h3>
              <p>
                State-of-the-art diagnostic testing with accurate and timely
                results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="doctors-section">
        <div className="container">
          <h2>Meet Our Expert Doctors</h2>
          <div className="doctors-grid">
            <div className="doctor-card">
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Dr. Sarah Johnson"
              />
              <div className="doctor-info">
                <h3>Dr. Sarah Johnson</h3>
                <p className="specialty">Chief of Cardiology</p>
                <p className="experience">15+ years experience</p>
              </div>
            </div>
            <div className="doctor-card">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Dr. Michael Chen"
              />
              <div className="doctor-info">
                <h3>Dr. Michael Chen</h3>
                <p className="specialty">Neurologist</p>
                <p className="experience">12+ years experience</p>
              </div>
            </div>
            <div className="doctor-card">
              <img
                src="https://media.istockphoto.com/id/638647058/photo/we-offer-our-patients-premium-healthcare-here.jpg?s=612x612&w=0&k=20&c=pek5ehwgsZNPemeEh4bObQ1U5DRPEs0WHleosG-daa8="
                alt="Dr. Emily Rodriguez"
              />
              <div className="doctor-info">
                <h3>Dr. Emily Rodriguez</h3>
                <p className="specialty">Pediatrician</p>
                <p className="experience">10+ years experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hospital Features */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose MediCare Hospital?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🏆</div>
              <h3>Award-Winning Care</h3>
              <p>
                Recognized for excellence in patient care and medical innovation
              </p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <h3>Secure Digital Records</h3>
              <p>Safe and encrypted storage of all your medical information</p>
            </div>
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <h3>Advanced Technology</h3>
              <p>Latest medical equipment and cutting-edge treatment methods</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💼</div>
              <h3>Insurance Accepted</h3>
              <p>
                We accept most major insurance plans and offer financial
                assistance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="upload-section">
        <div className="container">
          <div className="upload-content">
            <div className="upload-text">
              <h2>Upload Your Medical Reports</h2>
              <p>
                Easily upload and share your medical reports, test results, and
                prescriptions with our medical team. Our secure system ensures
                your privacy and enables better coordination of your care.
              </p>
              <ul className="upload-features">
                <li>✅ Secure file encryption</li>
                <li>✅ Instant doctor access</li>
                <li>✅ Multiple file formats supported</li>
                <li>✅ 24/7 availability</li>
              </ul>
              <button
                className="btn btn-upload"
                onClick={() => navigate("/upload")}
              >
                📤 Start Uploading Reports
              </button>
            </div>
            <div className="upload-image">
              <img
                src="https://c8.alamy.com/comp/CYW3K0/medical-report-form-in-doctors-hospital-office-showing-health-concept-CYW3K0.jpg"
                alt="Medical Reports and Documents"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <h2>Contact Information</h2>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">📍</div>
              <h3>Address</h3>
              <p>
                123 Health Avenue
                <br />
                Wellness City, WC 12345
              </p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h3>Phone</h3>
              <p>
                Main: (123) 456-7890
                <br />
                Emergency: (123) 456-7891
              </p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">⏰</div>
              <h3>Hours</h3>
              <p>
                24/7 Emergency Care
                <br />
                Outpatient: Mon-Fri 8AM-6PM
              </p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <h3>Email</h3>
              <p>
                info@citycare.hospital
                <br />
                appointments@citycare.hospital
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>🏥 CityCare Hospital</h3>
              <p>
                Committed to providing exceptional healthcare services with
                compassion and excellence.
              </p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="/about">About Us</a>
                </li>
                <li>
                  <a href="/services">Services</a>
                </li>
                <li>
                  <a href="/doctors">Doctors</a>
                </li>
                <li>
                  <a href="/careers">Careers</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Patient Resources</h4>
              <ul>
                <li>
                  <a href="/upload">Upload Reports</a>
                </li>
                <li>
                  <a href="/records">Medical Records</a>
                </li>
                <li>
                  <a href="/billing">Billing</a>
                </li>
                <li>
                  <a href="/insurance">Insurance</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Emergency</h4>
              <p>
                <strong>Call 911</strong> for life-threatening emergencies
              </p>
              <p>
                <strong>(123) 456-7891</strong> for hospital emergency
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              &copy; 2025 CityCare Hospital. All rights reserved. | Privacy
              Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
