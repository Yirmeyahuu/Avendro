import React, { useState } from 'react'
import BorrowerRegistrationForm from './BorrowerRegistrationForm' 
import CompanyRegistrationForm from './CompanyRegistrationForm' 
import '../../styles/AuthModal.css'

const RegisterModal = ({ type, onClose }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Dynamic content based on registration type
  const getModalContent = () => {
    if (type === 'borrower') {
      return {
        title: 'Create Borrower Account',
        subtitle: 'Join thousands of borrowers who trust our platform',
        icon: '💳'
      }
    } else {
      return {
        title: 'Register Your Company',
        subtitle: 'Start your lending business with our platform',
        icon: '🏢'
      }
    }
  }

  const { title, subtitle, icon } = getModalContent()

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content register-modal wide-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="d-flex align-items-center">
            <span className="me-2 fs-4">{icon}</span>
            <div>
              <h3 className="fw-semibold text-dark mb-0">{title}</h3>
              <small className="text-muted">{subtitle}</small>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="btn-close"
            aria-label="Close"
          />
        </div>
        
        {/* Modal Body */}
        <div className="modal-body">
          {type === 'borrower' ? (
            <BorrowerRegistrationForm 
              onSuccess={onClose}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          ) : (
            <CompanyRegistrationForm 
              onSuccess={onClose}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div className="w-100 text-center">
            <small className="text-muted">
              Already have an account? 
              <button 
                className="btn btn-link btn-sm p-0 ms-1"
                onClick={() => {
                  onClose()
                  // This would trigger the login modal
                }}
              >
                Sign in here
              </button>
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterModal 