import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import LoginModal from './components/Auth/LoginModal'
import CompanyDashboard from './components/Company/CompanyDashboard'
import BorrowerDashboard from './components/Borrower/BorrowerDashboard'
import LandingPage from './pages/Landingpage/LandingPage'
import { authAPI } from './services/api'
import './styles/App.css'

function App() {
  const [user, setUser] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing login on app start
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const userData = localStorage.getItem('user_data')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        localStorage.clear()
      }
    }
    setIsLoading(false)
  }, [])

  // DEAD SIMPLE LOGIN HANDLER
  const handleLoginSuccess = (userData, tokens) => {
    console.log('🚀 Login successful:', userData)
    
    // Store data
    localStorage.setItem('access_token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
    localStorage.setItem('user_data', JSON.stringify(userData))
    
    // Close modal and set user in one go
    setShowLoginModal(false)
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.clear()
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  // If user exists, show appropriate dashboard
  if (user) {
    console.log('User logged in:', user.user_type)
    
    if (user.user_type === 'lending_company') {
      return <CompanyDashboard user={user} onLogout={handleLogout} />
    }
    
    if (user.user_type === 'borrower') {
      return <BorrowerDashboard user={user} onLogout={handleLogout} />
    }
    
    // Fallback for unknown user types
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="alert alert-warning">
          <h4>Unknown User Type</h4>
          <p>User type "{user.user_type}" is not recognized.</p>
          <button className="btn btn-primary" onClick={handleLogout}>
            Logout and Try Again
          </button>
        </div>
      </div>
    )
  }

  // No user, show landing page
  return (
    <Router>
      <div className="App">
        <LandingPage onLoginClick={() => setShowLoginModal(true)} />
        
        {showLoginModal && (
          <LoginModal 
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </div>
    </Router>
  )
}

export default App