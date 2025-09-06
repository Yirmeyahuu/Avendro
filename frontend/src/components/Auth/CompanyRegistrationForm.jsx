import React, { useState } from 'react'
import { authAPI } from '../../services/api'

const CompanyRegistrationForm = ({ onSuccess, isLoading, setIsLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password_confirm: '',
    company_name: '',
    company_registration_number: '',
    company_address: '',
    company_phone: '',
    first_name: '',
    last_name: ''
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
      const response = await authAPI.registerCompany(formData)
      console.log('Company registration successful:', response)
      
      // Show success message
      alert('Company registration successful! Welcome to Avendro!')
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
      } else if (error.message.includes('registration number')) {
        setErrors({
          company_registration_number: 'This registration number already exists.'
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
              placeholder="company@example.com"
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
      </div>

      {/* Company Information Section */}
      <div className="mb-4">
        <h5 className="fw-semibold text-dark mb-3">Company Information</h5>
        
        <div className="mb-3">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="form-control"
            placeholder="Your Company Name"
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Registration Number</label>
            <input
              type="text"
              name="company_registration_number"
              value={formData.company_registration_number}
              onChange={handleChange}
              className="form-control"
              placeholder="Business Registration No."
              required
            />
            {errors.company_registration_number && (
              <div className="error-message">{errors.company_registration_number}</div>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Company Phone</label>
            <input
              type="tel"
              name="company_phone"
              value={formData.company_phone}
              onChange={handleChange}
              className="form-control"
              placeholder="+63 XXX XXX XXXX"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Company Address</label>
          <textarea
            name="company_address"
            value={formData.company_address}
            onChange={handleChange}
            className="form-control"
            rows="3"
            placeholder="Complete business address"
            required
          />
        </div>
      </div>

      {/* Contact Person Section */}
      <div className="mb-4">
        <h5 className="fw-semibold text-dark mb-3">Primary Contact Person</h5>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="form-control"
              placeholder="First name"
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
              placeholder="Last name"
              required
            />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="mb-4">
        <h5 className="fw-semibold text-dark mb-3">Security</h5>
        
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
        {isLoading ? 'Creating Account...' : 'Create Company Account'}
      </button>
    </form>
  )
}

export default CompanyRegistrationForm