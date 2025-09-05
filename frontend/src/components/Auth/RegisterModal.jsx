import React, { useState } from 'react'
import BorrowerRegistrationForm from './BorrowerRegistration'
import CompanyRegistrationForm from './CompanyRegistrationForm'
import '../../styles/AuthModal.css'


const RegisterModal = ({ type, onClose }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="text-2xl font-bold">
            {type === 'borrower' ? 'Register as Borrower' : 'Register as Lending Company'}
          </h2>
          <button 
            onClick={onClose}
            className="close-button text-2xl hover:text-red-500"
          >
            ×
          </button>
        </div>
        
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
      </div>
    </div>
  )
}

export default RegisterModal