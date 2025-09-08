import React, { useState } from 'react'
import { authAPI } from '../../services/api'

const BorrowerRegistrationForm = ({ onSuccess, isLoading, setIsLoading }) => {
  const [formData, setFormData] = useState({
    // User fields
    email: '',
    username: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    phone_number: '',
    
    // Client profile fields
    middle_name: '',
    gender: '',
    marital_status: '',
    
    // Current Address
    current_street: '',
    current_barangay: '',
    current_city: '',
    current_region: 'ncr',
    
    // Permanent Address
    permanent_street: '',
    permanent_barangay: '',
    permanent_city: '',
    permanent_region: 'ncr',
    
    // Employment Information
    employment_status: '',
    company_name: '',
    job_title: '',
    monthly_income: '',
    source_of_income: '',
    
    // Bank Information
    bank_name: '',
    bank_account_number: '',
    bank_account_name: ''
  })
  
  const [errors, setErrors] = useState({})
  const [sameAddress, setSameAddress] = useState(false)

  // Philippine Regions
  const regions = [
    { value: 'ncr', label: 'National Capital Region (NCR)' },
    { value: 'car', label: 'Cordillera Administrative Region (CAR)' },
    { value: 'region1', label: 'Ilocos Region (Region I)' },
    { value: 'region2', label: 'Cagayan Valley (Region II)' },
    { value: 'region3', label: 'Central Luzon (Region III)' },
    { value: 'region4a', label: 'CALABARZON (Region IV-A)' },
    { value: 'region4b', label: 'MIMAROPA (Region IV-B)' },
    { value: 'region5', label: 'Bicol Region (Region V)' },
    { value: 'region6', label: 'Western Visayas (Region VI)' },
    { value: 'region7', label: 'Central Visayas (Region VII)' },
    { value: 'region8', label: 'Eastern Visayas (Region VIII)' },
    { value: 'region9', label: 'Zamboanga Peninsula (Region IX)' },
    { value: 'region10', label: 'Northern Mindanao (Region X)' },
    { value: 'region11', label: 'Davao Region (Region XI)' },
    { value: 'region12', label: 'SOCCSKSARGEN (Region XII)' },
    { value: 'region13', label: 'Caraga (Region XIII)' },
    { value: 'barmm', label: 'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)' }
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox' && name === 'sameAddress') {
      setSameAddress(checked)
      if (checked) {
        setFormData(prev => ({
          ...prev,
          permanent_street: prev.current_street,
          permanent_barangay: prev.current_barangay,
          permanent_city: prev.current_city,
          permanent_region: prev.current_region
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
      
      // If current address changes and same address is checked, update permanent address
      if (sameAddress && name.startsWith('current_')) {
        const permanentField = name.replace('current_', 'permanent_')
        setFormData(prev => ({
          ...prev,
          [permanentField]: value
        }))
      }
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      console.log('Submitting borrower registration:', formData)
      const response = await authAPI.registerBorrower(formData)
      console.log('Borrower registration successful:', response)
      
      alert('Registration successful! Welcome to Avendro!')
      onSuccess()
      
    } catch (error) {
      console.error('Registration error:', error)
      
      if (error.response?.data) {
        setErrors(error.response.data)
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
    <div className="borrower-registration-form">
      <form onSubmit={handleSubmit}>
        {/* General Error Message */}
        {errors.general && (
          <div className="alert alert-danger mb-4" role="alert">
            {errors.general}
          </div>
        )}

        {/* Personal Information Section */}
        <div className="form-section mb-5">
          <h5 className="section-title mb-4">
            <i className="fas fa-user me-2"></i>
            Personal Information
          </h5>
          
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">First Name <span className="text-danger">*</span></label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                placeholder="Enter first name"
                required
              />
              {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Middle Name</label>
              <input
                type="text"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter middle name (optional)"
              />
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Last Name <span className="text-danger">*</span></label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                placeholder="Enter last name"
                required
              />
              {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
            </div>
          </div>

          <div className="row g-3 mt-2">
            <div className="col-md-3">
              <label className="form-label">Date of Birth <span className="text-danger">*</span></label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className={`form-control ${errors.date_of_birth ? 'is-invalid' : ''}`}
                required
              />
              {errors.date_of_birth && <div className="invalid-feedback">{errors.date_of_birth}</div>}
            </div>
            
            <div className="col-md-3">
              <label className="form-label">Gender <span className="text-danger">*</span></label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
            </div>
            
            <div className="col-md-3">
              <label className="form-label">Marital Status</label>
              <select
                name="marital_status"
                value={formData.marital_status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
                <option value="separated">Separated</option>
              </select>
            </div>
            
            <div className="col-md-3">
              <label className="form-label">Phone Number <span className="text-danger">*</span></label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`}
                placeholder="+63 XXX XXX XXXX"
                required
              />
              {errors.phone_number && <div className="invalid-feedback">{errors.phone_number}</div>}
            </div>
          </div>
        </div>

        {/* Current Address Section */}
        <div className="form-section mb-5">
          <h5 className="section-title mb-4">
            <i className="fas fa-map-marker-alt me-2"></i>
            Current Address
          </h5>
          
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Street Address <span className="text-danger">*</span></label>
              <input
                type="text"
                name="current_street"
                value={formData.current_street}
                onChange={handleChange}
                className={`form-control ${errors.current_street ? 'is-invalid' : ''}`}
                placeholder="Building No., Street Name"
                required
              />
              {errors.current_street && <div className="invalid-feedback">{errors.current_street}</div>}
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Barangay <span className="text-danger">*</span></label>
              <input
                type="text"
                name="current_barangay"
                value={formData.current_barangay}
                onChange={handleChange}
                className={`form-control ${errors.current_barangay ? 'is-invalid' : ''}`}
                placeholder="Enter barangay"
                required
              />
              {errors.current_barangay && <div className="invalid-feedback">{errors.current_barangay}</div>}
            </div>
          </div>

          <div className="row g-3 mt-2">
            <div className="col-md-6">
              <label className="form-label">City <span className="text-danger">*</span></label>
              <input
                type="text"
                name="current_city"
                value={formData.current_city}
                onChange={handleChange}
                className={`form-control ${errors.current_city ? 'is-invalid' : ''}`}
                placeholder="Enter city"
                required
              />
              {errors.current_city && <div className="invalid-feedback">{errors.current_city}</div>}
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Region <span className="text-danger">*</span></label>
              <select
                name="current_region"
                value={formData.current_region}
                onChange={handleChange}
                className={`form-select ${errors.current_region ? 'is-invalid' : ''}`}
                required
              >
                {regions.map(region => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
              {errors.current_region && <div className="invalid-feedback">{errors.current_region}</div>}
            </div>
          </div>
        </div>

        {/* Permanent Address Section */}
        <div className="form-section mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="section-title mb-0">
              <i className="fas fa-home me-2"></i>
              Permanent Address
            </h5>
            <div className="form-check">
              <input
                type="checkbox"
                name="sameAddress"
                id="sameAddress"
                checked={sameAddress}
                onChange={handleChange}
                className="form-check-input"
              />
              <label className="form-check-label" htmlFor="sameAddress">
                Same as current address
              </label>
            </div>
          </div>
          
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Street Address <span className="text-danger">*</span></label>
              <input
                type="text"
                name="permanent_street"
                value={formData.permanent_street}
                onChange={handleChange}
                className={`form-control ${errors.permanent_street ? 'is-invalid' : ''}`}
                placeholder="Building No., Street Name"
                disabled={sameAddress}
                required
              />
              {errors.permanent_street && <div className="invalid-feedback">{errors.permanent_street}</div>}
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Barangay <span className="text-danger">*</span></label>
              <input
                type="text"
                name="permanent_barangay"
                value={formData.permanent_barangay}
                onChange={handleChange}
                className={`form-control ${errors.permanent_barangay ? 'is-invalid' : ''}`}
                placeholder="Enter barangay"
                disabled={sameAddress}
                required
              />
              {errors.permanent_barangay && <div className="invalid-feedback">{errors.permanent_barangay}</div>}
            </div>
          </div>

          <div className="row g-3 mt-2">
            <div className="col-md-6">
              <label className="form-label">City <span className="text-danger">*</span></label>
              <input
                type="text"
                name="permanent_city"
                value={formData.permanent_city}
                onChange={handleChange}
                className={`form-control ${errors.permanent_city ? 'is-invalid' : ''}`}
                placeholder="Enter city"
                disabled={sameAddress}
                required
              />
              {errors.permanent_city && <div className="invalid-feedback">{errors.permanent_city}</div>}
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Region <span className="text-danger">*</span></label>
              <select
                name="permanent_region"
                value={formData.permanent_region}
                onChange={handleChange}
                className={`form-select ${errors.permanent_region ? 'is-invalid' : ''}`}
                disabled={sameAddress}
                required
              >
                {regions.map(region => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
              {errors.permanent_region && <div className="invalid-feedback">{errors.permanent_region}</div>}
            </div>
          </div>
        </div>

        {/* Employment Information Section */}
        <div className="form-section mb-5">
          <h5 className="section-title mb-4">
            <i className="fas fa-briefcase me-2"></i>
            Employment Information
          </h5>
          
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Employment Status <span className="text-danger">*</span></label>
              <select
                name="employment_status"
                value={formData.employment_status}
                onChange={handleChange}
                className={`form-select ${errors.employment_status ? 'is-invalid' : ''}`}
                required
              >
                <option value="">Select Status</option>
                <option value="employed">Employed</option>
                <option value="self_employed">Self-Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="retired">Retired</option>
                <option value="student">Student</option>
              </select>
              {errors.employment_status && <div className="invalid-feedback">{errors.employment_status}</div>}
            </div>
            
            <div className="col-md-4">
              <label className="form-label">
                Company Name 
                {(formData.employment_status === 'employed' || formData.employment_status === 'self_employed') && 
                  <span className="text-danger">*</span>
                }
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className={`form-control ${errors.company_name ? 'is-invalid' : ''}`}
                placeholder="Enter company name"
                required={formData.employment_status === 'employed' || formData.employment_status === 'self_employed'}
              />
              {errors.company_name && <div className="invalid-feedback">{errors.company_name}</div>}
            </div>
            
            <div className="col-md-4">
              <label className="form-label">
                Job Title/Position 
                {(formData.employment_status === 'employed' || formData.employment_status === 'self_employed') && 
                  <span className="text-danger">*</span>
                }
              </label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                className={`form-control ${errors.job_title ? 'is-invalid' : ''}`}
                placeholder="Enter job title"
                required={formData.employment_status === 'employed' || formData.employment_status === 'self_employed'}
              />
              {errors.job_title && <div className="invalid-feedback">{errors.job_title}</div>}
            </div>
          </div>

          <div className="row g-3 mt-2">
            <div className="col-md-6">
              <label className="form-label">
                Monthly Income (₱) 
                {(formData.employment_status === 'employed' || formData.employment_status === 'self_employed') && 
                  <span className="text-danger">*</span>
                }
              </label>
              <input
                type="number"
                name="monthly_income"
                value={formData.monthly_income}
                onChange={handleChange}
                className={`form-control ${errors.monthly_income ? 'is-invalid' : ''}`}
                placeholder="Enter monthly income"
                min="0"
                step="0.01"
                required={formData.employment_status === 'employed' || formData.employment_status === 'self_employed'}
              />
              {errors.monthly_income && <div className="invalid-feedback">{errors.monthly_income}</div>}
            </div>
            
            <div className="col-md-6">
              <label className="form-label">
                Source of Income 
                {(formData.employment_status === 'unemployed' || formData.employment_status === 'student' || formData.employment_status === 'retired') && 
                  <span className="text-danger">*</span>
                }
              </label>
              <textarea
                name="source_of_income"
                value={formData.source_of_income}
                onChange={handleChange}
                className={`form-control ${errors.source_of_income ? 'is-invalid' : ''}`}
                placeholder="Describe your source of income"
                rows="3"
                required={formData.employment_status === 'unemployed' || formData.employment_status === 'student' || formData.employment_status === 'retired'}
              />
              {errors.source_of_income && <div className="invalid-feedback">{errors.source_of_income}</div>}
            </div>
          </div>
        </div>

        {/* Bank Information Section */}
        <div className="form-section mb-5">
          <h5 className="section-title mb-4">
            <i className="fas fa-university me-2"></i>
            Bank Account Information
          </h5>
          
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Bank Name <span className="text-danger">*</span></label>
              <input
                type="text"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
                className={`form-control ${errors.bank_name ? 'is-invalid' : ''}`}
                placeholder="e.g., BDO, BPI, Metrobank"
                required
              />
              {errors.bank_name && <div className="invalid-feedback">{errors.bank_name}</div>}
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Account Number <span className="text-danger">*</span></label>
              <input
                type="text"
                name="bank_account_number"
                value={formData.bank_account_number}
                onChange={handleChange}
                className={`form-control ${errors.bank_account_number ? 'is-invalid' : ''}`}
                placeholder="Enter account number"
                required
              />
              {errors.bank_account_number && <div className="invalid-feedback">{errors.bank_account_number}</div>}
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Account Holder Name <span className="text-danger">*</span></label>
              <input
                type="text"
                name="bank_account_name"
                value={formData.bank_account_name}
                onChange={handleChange}
                className={`form-control ${errors.bank_account_name ? 'is-invalid' : ''}`}
                placeholder="Full name on account"
                required
              />
              {errors.bank_account_name && <div className="invalid-feedback">{errors.bank_account_name}</div>}
            </div>
          </div>
        </div>

        {/* Account Credentials Section */}
        <div className="form-section mb-5">
          <h5 className="section-title mb-4">
            <i className="fas fa-key me-2"></i>
            Account Credentials
          </h5>
          
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Email Address <span className="text-danger">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="your@email.com"
                required
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Username <span className="text-danger">*</span></label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                placeholder="Choose a username"
                required
              />
              {errors.username && <div className="invalid-feedback">{errors.username}</div>}
            </div>
          </div>

          <div className="row g-3 mt-2">
            <div className="col-md-6">
              <label className="form-label">Password <span className="text-danger">*</span></label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Create a strong password"
                required
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Confirm Password <span className="text-danger">*</span></label>
              <input
                type="password"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                className={`form-control ${errors.password_confirm ? 'is-invalid' : ''}`}
                placeholder="Confirm your password"
                required
              />
              {errors.password_confirm && <div className="invalid-feedback">{errors.password_confirm}</div>}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-lg px-5 py-3"
            style={{ minWidth: '200px' }}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating Account...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus me-2"></i>
                Create Borrower Account
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default BorrowerRegistrationForm