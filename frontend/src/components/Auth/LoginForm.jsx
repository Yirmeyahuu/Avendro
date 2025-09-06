import React, { useState } from 'react'
import { authAPI } from '../../services/api'

const LoginForm = ({ onSuccess, isLoading, setIsLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error for this field when user starts typing
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
      const response = await authAPI.login(formData)
      console.log('Login successful:', response)
      
      // Show success message
      alert(`Welcome back, ${response.user.full_name}!`)
      onSuccess()
      
    } catch (error) {
      console.error('Login error:', error)
      
      // Handle login errors
      if (error.message.includes('Invalid email or password')) {
        setErrors({
          general: 'Invalid email or password. Please try again.'
        })
      } else if (error.message.includes('disabled')) {
        setErrors({
          general: 'Your account has been disabled. Please contact support.'
        })
      } else {
        setErrors({
          general: error.message || 'Login failed. Please try again.'
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* General Error Message */}
      {errors.general && (
        <div className="alert alert-danger mb-3" role="alert">
          {errors.general}
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
          placeholder="Enter your email"
          required
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="form-control"
          placeholder="Enter your password"
          required
        />
        {errors.password && <div className="error-message">{errors.password}</div>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="submit-button"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}

export default LoginForm