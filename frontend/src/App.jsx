import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import LoginModal from './components/Auth/LoginModal'
import CompanyDashboard from './components/Company/CompanyDashboard'
import LandingPage from './pages/Landingpage/LandingPage'
import { authAPI } from './services/api'
import './styles/App.css'


function App() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token')
    const userData = localStorage.getItem('user_data')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        console.log('User loaded from localStorage:', parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_data')
      }
    }
    setIsLoading(false)
  }, [])

  const handleLoginSuccess = (userData, tokens) => {
    console.log('Login success handler called:', userData, tokens)
    console.log('Setting user state...')  // Add this debug log
    setUser(userData)
    localStorage.setItem('access_token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
    localStorage.setItem('user_data', JSON.stringify(userData))
    setShowLoginModal(false)
    console.log('Login flow completed, user set to:', userData)  // Add this debug log
  }

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        await authAPI.logout({ refresh_token: refreshToken })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_data')
    }
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    )
  }

  // Debug log
  console.log('Current user state:', user)

  // Show appropriate dashboard based on user type
  if (user) {
    console.log('User exists, checking user_type:', user.user_type)  // Add this debug log
    if (user.user_type === 'lending_company') {
      console.log('Rendering CompanyDashboard')  // Add this debug log
      return (
        <CompanyDashboard 
          user={user} 
          onLogout={handleLogout}
        />
      )
    } else if (user.user_type === 'borrower') {
      return (
        <div className="borrower-dashboard">
          <h1>Borrower Dashboard (Coming Soon)</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )
    }
  }

  console.log('Rendering LandingPage')  // Add this debug log
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