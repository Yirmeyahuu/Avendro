import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import LoginModal from './components/Auth/LoginModal'
import CompanyDashboard from './components/Company/CompanyDashboard'
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
    return <div>Loading...</div>
  }

  // If user exists, show dashboard
  if (user) {
    if (user.user_type === 'lending_company') {
      return <CompanyDashboard user={user} onLogout={handleLogout} />
    }
    // Add other user types here
    return <div>Dashboard for {user.user_type}</div>
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