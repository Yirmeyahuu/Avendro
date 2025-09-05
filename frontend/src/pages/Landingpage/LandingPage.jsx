import React, { useState } from 'react'
import RegisterModal from '../../components/Auth/RegisterModal'
import LoginModal from '../../components/Auth/LoginModal'

const LandingPage = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [registerType, setRegisterType] = useState(null)

  const handleRegisterClick = (type) => {
    setRegisterType(type)
    setShowRegisterModal(true)
  }

  const handleLoginClick = () => {
    setShowLoginModal(true)
  }

  return (
    <div className="landing-page">
      {/* Modern Header */}
      <header className="bg-white shadow-sm sticky-top">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light py-3">
            <div className="container-fluid px-0">
              <a className="navbar-brand text-primary" href="#">
                <span className="fw-bold">Avendro</span>
              </a>
              <div className="d-flex align-items-center gap-3">
                <button 
                  onClick={handleLoginClick}
                  className="btn btn-custom-blue px-4"
                >
                  Sign In
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient section-padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-8">
              <div className="text-center">
                <h1 className="display-4 fw-bold mb-4">
                  Lending for a 
                  <span className="text-primary"> Better Future</span>
                </h1>
                <p className="lead text-muted mb-5 mx-auto" style={{maxWidth: '600px'}}>
                  Streamline operations, reduce risks, and accelerate growth with our 
                  comprehensive lending management platform designed for modern financial institutions.
                </p>
                
                {/* CTA Buttons */}
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center mb-5">
                  <button 
                    onClick={() => handleRegisterClick('borrower')}
                    className="btn btn-custom-green btn-lg px-5"
                  >
                    <span>💳</span>
                    Apply for Loan
                  </button>
                  <div className="text-muted fw-medium">or</div>
                  <button 
                    onClick={() => handleRegisterClick('company')}
                    className="btn btn-custom-blue btn-lg px-5"
                  >
                    <span>🏢</span>
                    Start Lending Business
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="row justify-content-center text-center mt-5">
                  <div className="col-6 col-md-3 mb-3">
                    <div className="h4 fw-bold text-primary mb-1">500+</div>
                    <small className="text-muted">Active Lenders</small>
                  </div>
                  <div className="col-6 col-md-3 mb-3">
                    <div className="h4 fw-bold text-success mb-1">₱2.5B</div>
                    <small className="text-muted">Loans Processed</small>
                  </div>
                  <div className="col-6 col-md-3 mb-3">
                    <div className="h4 fw-bold text-warning mb-1">98%</div>
                    <small className="text-muted">Success Rate</small>
                  </div>
                  <div className="col-6 col-md-3 mb-3">
                    <div className="h4 fw-bold text-info mb-1">24/7</div>
                    <small className="text-muted">Support</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="h1 fw-bold mb-3">
                Everything You Need to 
                <span className="text-primary">Succeed</span>
              </h2>
              <p className="lead text-muted mx-auto" style={{maxWidth: '600px'}}>
                Powerful tools and features designed to streamline your lending operations 
                and provide exceptional user experience.
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            {/* Feature Cards */}
            <div className="col-lg-4 col-md-6">
              <div className="card feature-card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4 p-lg-5">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                       style={{width: '80px', height: '80px'}}>
                    <span className="fs-1">📊</span>
                  </div>
                  <h4 className="card-title fw-semibold mb-3">Real-time Analytics</h4>
                  <p className="card-text text-muted">
                    Comprehensive dashboards with real-time insights into loan performance, 
                    risk metrics, and portfolio analytics.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card feature-card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4 p-lg-5">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                       style={{width: '80px', height: '80px'}}>
                    <span className="fs-1">🔒</span>
                  </div>
                  <h4 className="card-title fw-semibold mb-3">Bank-Grade Security</h4>
                  <p className="card-text text-muted">
                    End-to-end encryption, compliance with financial regulations, 
                    and robust security measures to protect sensitive data.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card feature-card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4 p-lg-5">
                  <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                       style={{width: '80px', height: '80px'}}>
                    <span className="fs-1">⚡</span>
                  </div>
                  <h4 className="card-title fw-semibold mb-3">Automated Workflows</h4>
                  <p className="card-text text-muted">
                    Streamline approval processes, automate payment collections, 
                    and reduce manual work with intelligent automation.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card feature-card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4 p-lg-5">
                  <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                       style={{width: '80px', height: '80px'}}>
                    <span className="fs-1">📱</span>
                  </div>
                  <h4 className="card-title fw-semibold mb-3">Mobile Ready</h4>
                  <p className="card-text text-muted">
                    Fully responsive design that works seamlessly across all devices, 
                    with native mobile app coming soon.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card feature-card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4 p-lg-5">
                  <div className="bg-purple bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                       style={{width: '80px', height: '80px'}}>
                    <span className="fs-1">🤝</span>
                  </div>
                  <h4 className="card-title fw-semibold mb-3">24/7 Support</h4>
                  <p className="card-text text-muted">
                    Round-the-clock customer support with dedicated account managers 
                    for enterprise clients.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card feature-card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4 p-lg-5">
                  <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                       style={{width: '80px', height: '80px'}}>
                    <span className="fs-1">🚀</span>
                  </div>
                  <h4 className="card-title fw-semibold mb-3">Fast Deployment</h4>
                  <p className="card-text text-muted">
                    Get up and running in days, not months, with our streamlined 
                    onboarding process and migration tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white section-padding-sm">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center mb-3 mb-md-0">
                <span className="navbar-brand text-white mb-0">
                  <span className="fw-bold">Avendro</span>
                </span>
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-0 text-light">
                &copy; 2025 Avendro. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showRegisterModal && (
        <RegisterModal 
          type={registerType}
          onClose={() => setShowRegisterModal(false)}
        />
      )}
      
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  )
}

export default LandingPage