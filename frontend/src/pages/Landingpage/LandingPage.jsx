import React, { useState } from 'react'
import RegisterModal from '../../components/Auth/RegisterModal'
import LoginModal from '../../components/Auth/LoginModal'
import '../../styles/LandingPage.css'

const LandingPage = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [registerType, setRegisterType] = useState(null) // 'borrower' or 'company'

  const handleRegisterClick = (type) => {
    setRegisterType(type)
    setShowRegisterModal(true)
  }

  const handleLoginClick = () => {
    setShowLoginModal(true)
  }

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="logo">
            <h1 className="text-2xl font-bold text-blue-600">AvendroLMS</h1>
          </div>
          <nav className="nav-buttons">
            <button 
              onClick={handleLoginClick}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Streamline Your Lending Management
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Automate the process of recording, monitoring, and managing lending transactions 
            with our comprehensive Lending Management System.
          </p>
          
          {/* Registration Buttons */}
          <div className="registration-options flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => handleRegisterClick('borrower')}
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
            >
              Register as Borrower
            </button>
            <span className="text-gray-500">or</span>
            <button 
              onClick={() => handleRegisterClick('company')}
              className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg"
            >
              Register as Lending Company
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose AvendroLMS?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card text-center p-6">
              <div className="icon text-4xl mb-4">📊</div>
              <h4 className="text-xl font-semibold mb-3">Real-time Monitoring</h4>
              <p className="text-gray-600">
                Track all lending transactions in real-time with comprehensive dashboards and analytics.
              </p>
            </div>
            <div className="feature-card text-center p-6">
              <div className="icon text-4xl mb-4">🔒</div>
              <h4 className="text-xl font-semibold mb-3">Secure & Compliant</h4>
              <p className="text-gray-600">
                Built with security in mind, ensuring all financial data is protected and compliant.
              </p>
            </div>
            <div className="feature-card text-center p-6">
              <div className="icon text-4xl mb-4">⚡</div>
              <h4 className="text-xl font-semibold mb-3">Automated Processes</h4>
              <p className="text-gray-600">
                Streamline your workflow with automated notifications, payments, and reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 AvendroLMS. All rights reserved.</p>
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