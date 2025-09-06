import React, { useState } from 'react'
import { authAPI } from '../../services/api'

const BorrowerRegistrationForm = ({ onSuccess, isLoading, setIsLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    date_of_birth: ''
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
      const response = await authAPI.registerBorrower(formData)
      console.log('Borrower registration successful:', response)
      
      // Show success message
      alert('Registration successful! Welcome to Avendro!')
      onSuccess()
      
    } catch (error) {
      console.error('Registration error:', error)
      
      // Handle validation errors
      if (error.message.includes('400')) {
        setErrors({
          general: 'Please check your input and try again.'
        })
      } else if (error.message.includes('email')) {
        setErrors({
          email: 'This email is already registered.'
        })
      } else {
        setErrors({
          general: error.message || 'Registration failed. Please try again.'
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

      {/* Personal Information Section */}
      <div className="mb-4">
        <h5 className="fw-semibold text-dark mb-3">Personal Information</h5>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="form-control"
              placeholder="Your first name"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="form-control"
              placeholder="Your last name"
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="form-control"
              placeholder="+63 XXX XXX XXXX"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-control"
            rows="3"
            placeholder="Your complete address"
          />
        </div>
      </div>

      {/* Account Information Section */}
      <div className="mb-4">
        <h5 className="fw-semibold text-dark mb-3">Account Information</h5>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="your@email.com"
              required
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              placeholder="Choose a username"
              required
            />
            {errors.username && <div className="error-message">{errors.username}</div>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Create password"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              className="form-control"
              placeholder="Confirm password"
              required
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="submit-button"
      >
        {isLoading ? 'Creating Account...' : 'Create Borrower Account'}
      </button>
    </form>
  )
}

export default BorrowerRegistrationForm