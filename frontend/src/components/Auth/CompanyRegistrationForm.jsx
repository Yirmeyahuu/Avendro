import React, { useState } from 'react'
import { authAPI } from '../../services/api'

const CompanyRegistrationForm = ({ onSuccess, isLoading, setIsLoading }) => {
  const [formData, setFormData] = useState({
    // Account Information
    email: '',
    username: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    
    // Company Information
    company_name: '',
    business_street: '',
    business_barangay: '',
    business_city: '',
    business_region: '',
    
    // Contact Information
    contact_person_name: '',
    contact_person_email: '',
    contact_person_phone: '',
    company_phone: '',
    
    // Legal Registration
    sec_registration_number: '',
    company_tin: '',
    
    // Business Details
    business_type: '',
    license_number: '',
    
    // Business Operations
    loan_products_offered: [],
    minimum_interest_rate: '',
    maximum_interest_rate: '',
    processing_fee: '',
    late_payment_fee: '',
    
    // Lending Policies
    lending_policy_description: '',
    minimum_loan_amount: '',
    maximum_loan_amount: '',
    loan_term_minimum_months: '',
    loan_term_maximum_months: '',
    
    // Bank Information
    bank_name: '',
    bank_account_number: '',
    bank_account_name: '',
    bank_branch: ''
  })
  const [errors, setErrors] = useState({})

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

  // Business Types for Philippine Lending Companies
  const businessTypes = [
    { value: 'corporation', label: 'Corporation' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
    { value: 'cooperative', label: 'Cooperative' },
    { value: 'microfinance_institution', label: 'Microfinance Institution' },
    { value: 'lending_company', label: 'Lending Company' },
    { value: 'financing_company', label: 'Financing Company' },
    { value: 'pawnshop', label: 'Pawnshop' }
  ]

  // Loan Products
  const loanProducts = [
    { value: 'personal', label: 'Personal Loans' },
    { value: 'business', label: 'Business Loans' },
    { value: 'salary', label: 'Salary Loans' },
    { value: 'vehicle', label: 'Vehicle Loans' },
    { value: 'housing', label: 'Housing Loans' },
    { value: 'payday', label: 'Payday Loans' },
    { value: 'collateral', label: 'Collateral Loans' },
    { value: 'sme', label: 'SME Loans' }
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name === 'loan_products_offered') {
      if (checked) {
        setFormData({
          ...formData,
          loan_products_offered: [...formData.loan_products_offered, value]
        })
      } else {
        setFormData({
          ...formData,
          loan_products_offered: formData.loan_products_offered.filter(product => product !== value)
        })
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
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
      
      alert('Company registration successful! Welcome to Avendro!')
      onSuccess()
      
    } catch (error) {
      console.error('Registration error:', error)
      
      if (error.response && error.response.data) {
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
    <form onSubmit={handleSubmit} className="company-registration-form">
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
            <label className="form-label">Email Address *</label>
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
            <label className="form-label">Username *</label>
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
            <label className="form-label">Password *</label>
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
            <label className="form-label">Confirm Password *</label>
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

      {/* Company Information Section */}
      <div className="mb-4">
        <h5 className="fw-semibold text-dark mb-3">Company Information</h5>
        
        <div className="mb-3">
          <label className="form-label">Company Name *</label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="form-control"
            placeholder="Full legal name of the company"
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Business Type *</label>
            <select
              name="business_type"
              value={formData.business_type}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Business Type</option>
              {businessTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.business_type && (
              <div className="error-message">{errors.business_type}</div>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">License Number *</label>
            <input
              type="text"
              name="license_number"
              value={formData.license_number}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., BSP-1234567, DOF-987654"
              required
            />
            {errors.license_number && (
              <div className="error-message">{errors.license_number}</div>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">SEC Registration Number *</label>
            <input
              type="text"
              name="sec_registration_number"
              value={formData.sec_registration_number}
              onChange={handleChange}
              className="form-control"
              placeholder="SEC-XXXXXXXX"
              required
            />
            {errors.sec_registration_number && (
              <div className="error-message">{errors.sec_registration_number}</div>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Tax Identification Number (TIN) *</label>
            <input
              type="text"
              name="company_tin"
              value={formData.company_tin}
              onChange={handleChange}
              className="form-control"
              placeholder="XXX-XXX-XXX-XXX"
              required
            />
            {errors.company_tin && (
              <div className="error-message">{errors.company_tin}</div>
            )}
          </div>
        </div>
      </div>

      {/* Business Address Section */}
      <div className="mb-4">
        <h5 className="fw-semibold text-dark mb-3">Business Address</h5>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Street Address *</label>
            <input
              type="text"
              name="business_street"
              value={formData.business_street}
              onChange={handleChange}
              className="form-control"
              placeholder="Building No., Street Name"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Barangay *</label>
            <input
              type="text"
              name="business_barangay"
              value={formData.business_barangay}
              onChange={handleChange}
              className="form-control"
              placeholder="Barangay"
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">City *</label>
            <input
              type="text"
              name="business_city"
              value={formData.business_city}
              onChange={handleChange}
              className="form-control"
              placeholder="City"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Region *</label>
            <select
              name="business_region"
              value={formData.business_region}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Region</option>
              {regions.map(region => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="mb-4">
        <h5 className="fw-semibold text-dark mb-3">Contact Information</h5>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Contact Person Name *</label>
            <input
              type="text"
              name="contact_person_name"
              value={formData.contact_person_name}
              onChange={handleChange}
              className="form-control"
              placeholder="Primary contact person"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Contact Person Email *</label>
            <input
              type="email"
              name="contact_person_email"
              value={formData.contact_person_email}
              onChange={handleChange}
              className="form-control"
              placeholder="contact@company.com"
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Contact Person Phone *</label>
            <input
              type="tel"
              name="contact_person_phone"
              value={formData.contact_person_phone}
              onChange={handleChange}
              className="form-control"
              placeholder="+63 XXX XXX XXXX"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Company Phone *</label>
            <input
              type="tel"
              name="company_phone"
              value={formData.company_phone}
              onChange={handleChange}
              className="form-control"
              placeholder="+63 XX XXX XXXX"
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Primary Contact First Name *</label>
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
            <label className="form-label">Primary Contact Last Name *</label>
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

      {/* Loan Products Section */}
      <div className="mb-4">
        <h5 className="fw-semibold text-dark mb-3">Loan Products Offered *</h5>
        
        <div className="row">
          {loanProducts.map(product => (
            <div key={product.value} className="col-md-4 mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="loan_products_offered"
                  value={product.value}
                  id={`product_${product.value}`}
                  checked={formData.loan_products_offered.includes(product.value)}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor={`product_${product.value}`}>
                  {product.label}
                </label>
              </div>
            </div>
          ))}
        </div>
        {errors.loan_products_offered && (
          <div className="error-message">{errors.loan_products_offered}</div>
        )}
      </div>

      {/* Interest Rates and Fees Section */}
      <div className="mb-4">
        <h5 className="fw-semibold text-dark mb-3">Interest Rates and Fees</h5>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Minimum Interest Rate (%) *</label>
            <input
              type="number"
              step="0.01"
              name="minimum_interest_rate"
              value={formData.minimum_interest_rate}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 5.00"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Maximum Interest Rate (%) *</label>
            <input
              type="number"
              step="0.01"
              name="maximum_interest_rate"
              value={formData.maximum_interest_rate}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 24.00"
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Processing Fee (%) *</label>
            <input
              type="number"
              step="0.01"
              name="processing_fee"
              value={formData.processing_fee}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 2.50"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Late Payment Fee (%) *</label>
            <input
              type="number"
              step="0.01"
              name="late_payment_fee"
              value={formData.late_payment_fee}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 1.50"
              required
            />
          </div>
        </div>
      </div>

      {/* Lending Policies Section */}
      <div className="mb-4">
        <h5 className="fw-semibold text-dark mb-3">Lending Policies</h5>
        
        <div className="mb-3">
          <label className="form-label">Lending Policy Description *</label>
          <textarea
            name="lending_policy_description"
            value={formData.lending_policy_description}
            onChange={handleChange}
            className="form-control"
            rows="4"
            placeholder="Describe your loan approval process, criteria, and requirements..."
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Minimum Loan Amount (₱) *</label>
            <input
              type="number"
              step="0.01"
              name="minimum_loan_amount"
              value={formData.minimum_loan_amount}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 5000.00"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Maximum Loan Amount (₱) *</label>
            <input
              type="number"
              step="0.01"
              name="maximum_loan_amount"
              value={formData.maximum_loan_amount}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 1000000.00"
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Minimum Loan Term (Months) *</label>
            <input
              type="number"
              name="loan_term_minimum_months"
              value={formData.loan_term_minimum_months}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 3"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Maximum Loan Term (Months) *</label>
            <input
              type="number"
              name="loan_term_maximum_months"
              value={formData.loan_term_maximum_months}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 60"
              required
            />
          </div>
        </div>
      </div>

      {/* Bank Account Information Section */}
      <div className="mb-4">
        <h5 className="fw-semibold text-dark mb-3">Bank Account Information</h5>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Bank Name *</label>
            <input
              type="text"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., BDO, BPI, Metrobank"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Account Number *</label>
            <input
              type="text"
              name="bank_account_number"
              value={formData.bank_account_number}
              onChange={handleChange}
              className="form-control"
              placeholder="Bank account number"
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Account Name *</label>
            <input
              type="text"
              name="bank_account_name"
              value={formData.bank_account_name}
              onChange={handleChange}
              className="form-control"
              placeholder="Account holder name"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Bank Branch *</label>
            <input
              type="text"
              name="bank_branch"
              value={formData.bank_branch}
              onChange={handleChange}
              className="form-control"
              placeholder="Branch location"
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