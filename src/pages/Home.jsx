// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: "",
            title: "Government Verified",
            description: "All NGOs are verified and registered under government regulations"
        },
        {
            icon: "",
            title: "Direct Connect",
            description: "Connect directly with NGOs and service providers in your area"
        },
        {
            icon: "",
            title: "Transparent Process",
            description: "Track your applications and see real-time status updates"
        },
        {
            icon: "",
            title: "Secure & Safe",
            description: "Your data is protected with bank-level security measures"
        }
    ];

    const services = [
        {
            title: "Food Distribution",
            description: "Access nutritious meals through verified NGOs",
            count: "150+ Programs"
        },
        {
            title: "Education Support",
            description: "Free tutoring, scholarships, and learning resources",
            count: "200+ Programs"
        },
        {
            title: "Healthcare Services",
            description: "Medical camps, consultations, and medicines",
            count: "120+ Programs"
        },
        {
            title: "Skill Development",
            description: "Vocational training and job placement assistance",
            count: "80+ Programs"
        },
        {
            title: "Housing Assistance",
            description: "Shelter support and affordable housing programs",
            count: "60+ Programs"
        },
        {
            title: "Emergency Relief",
            description: "Disaster relief and immediate assistance programs",
            count: "40+ Programs"
        }
    ];

    const stats = [
        { number: "500+", label: "Verified NGOs" },
        { number: "10,000+", label: "Citizens Helped" },
        { number: "650+", label: "Active Programs" },
        { number: "35+", label: "Cities Covered" }
    ];

    return (
        <div className="home-wrapper">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        National Civic Aid & Services Portal
                    </h1>
                    <p className="hero-subtitle">
                        Connecting citizens with verified NGOs and government-backed welfare programs.
                        Transparent, accountable, and impactful assistance for every Indian.
                    </p>
                    <div className="hero-buttons">
                        <div className="button-group">
                            <h3>For Citizens</h3>
                            <div className="btn-row">
                                <button 
                                    className="btn-primary-large"
                                    onClick={() => navigate('/_auth/register')}
                                >
                                    Register as Citizen
                                </button>
                                <button 
                                    className="btn-secondary-large"
                                    onClick={() => navigate('/_auth/login')}
                                >
                                    Citizen Login
                                </button>
                            </div>
                        </div>
                        <div className="divider-vertical"></div>
                        <div className="button-group">
                            <h3>For NGO Partners</h3>
                            <div className="btn-row">
                                <button 
                                    className="btn-primary-large"
                                    onClick={() => navigate('/_auth/register/ngo')}
                                >
                                    Register as NGO
                                </button>
                                <button 
                                    className="btn-secondary-large"
                                    onClick={() => navigate('/_auth/login/ngo')}
                                >
                                    NGO Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-decoration">
                    <div className="decoration-circle circle-1"></div>
                    <div className="decoration-circle circle-2"></div>
                    <div className="decoration-circle circle-3"></div>
                </div>
            </section>
           
           <div className='min-h-[500px]'></div>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Make a Difference?</h2>
                        <p>Join thousands of citizens and NGOs working together for a better tomorrow</p>
                        <div className="cta-buttons">
                            <button 
                                className="btn-cta-primary"
                                onClick={() => navigate('/_auth/register')}
                            >
                                Get Started Now
                            </button>
                            <button className="btn-cta-secondary">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-col">
                            <h4>About Us</h4>
                            <ul>
                                <li><a href="#">Our Mission</a></li>
                                <li><a href="#">How We Work</a></li>
                                <li><a href="#">Impact Report</a></li>
                                <li><a href="#">Partners</a></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>For Citizens</h4>
                            <ul>
                                <li><a href="#">Browse Programs</a></li>
                                <li><a href="#">Apply for Help</a></li>
                                <li><a href="#">Track Application</a></li>
                                <li><a href="#">FAQs</a></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>For NGOs</h4>
                            <ul>
                                <li><a href="#">Register NGO</a></li>
                                <li><a href="#">Create Programs</a></li>
                                <li><a href="#">Verification Process</a></li>
                                <li><a href="#">Resources</a></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Contact</h4>
                            <ul>
                                <li>📧 support@ncas.gov.in</li>
                                <li>📞 1800-XXX-XXXX</li>
                                <li>🏢 New Delhi, India</li>
                                <li>🕐 Mon-Fri: 9AM-6PM</li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>© {new Date().getFullYear()} National Civic Aid & Services Portal. All rights reserved.</p>
                        <div className="footer-links">
                            <a href="#">Privacy Policy</a>
                            <span>|</span>
                            <a href="#">Terms of Service</a>
                            <span>|</span>
                            <a href="#">Accessibility</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
