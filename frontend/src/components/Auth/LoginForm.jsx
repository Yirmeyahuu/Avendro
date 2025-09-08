import React, { useState } from 'react'
import { authAPI } from '../../services/api'

const LoginForm = ({ onLoginSuccess, isLoading, setIsLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  // DEBUG: Check if onLoginSuccess is passed
  console.log('🔍 LoginForm props:', { onLoginSuccess: typeof onLoginSuccess, isLoading, setIsLoading })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      console.log('🔐 Attempting login with:', { email: formData.email })
      const response = await authAPI.login(formData)
      console.log('✅ Login API response:', response)
      
      if (response?.user && response?.tokens) {
        console.log('📞 About to call onLoginSuccess...', typeof onLoginSuccess)
        
        // SAFETY CHECK: Make sure onLoginSuccess exists
        if (typeof onLoginSuccess === 'function') {
          onLoginSuccess(response.user, response.tokens)
        } else {
          console.error('❌ onLoginSuccess is not a function:', onLoginSuccess)
          // Fallback: store in localStorage and refresh
          localStorage.setItem('access_token', response.tokens.access)
          localStorage.setItem('refresh_token', response.tokens.refresh)
          localStorage.setItem('user_data', JSON.stringify(response.user))
          window.location.reload()
        }
      } else {
        throw new Error('Invalid response from server')
      }
      
    } catch (error) {
      console.error('❌ Login error:', error)
      setErrors({
        general: error.response?.data?.message || 'Login failed. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors.general && (
        <div className="alert alert-danger mb-3">
          <strong>Error:</strong> {errors.general}
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary w-100"
        style={{
          padding: '12px',
          fontSize: '16px',
          fontWeight: '500'
        }}
      >
        {isLoading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  )
}

export default LoginForm