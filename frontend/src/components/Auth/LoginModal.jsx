import React, { useState } from 'react'
import LoginForm from './LoginForm'
import '../../styles/AuthModal.css'

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content modern-modal">
        {/* Modal Header */}
        <div className="modal-header border-0 pb-0">
          <div className="w-100">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="modal-brand">
                <span className="text-primary fw-bold fs-5">Avendro</span>
                <span className="text-muted fw-light fs-5">LMS</span>
              </div>
              <button 
                onClick={onClose}
                className="btn-close"
                aria-label="Close modal"
              />
            </div>
            <div className="text-center mb-2">
              <div className="welcome-icon mb-3">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style={{width: '60px', height: '60px'}}>
                  <span className="text-primary fs-3">👋</span>
                </div>
              </div>
              <h2 className="h3 fw-bold text-dark mb-2">Welcome Back!</h2>
              <p className="text-muted mb-0">Sign in to access your account</p>
            </div>
          </div>
        </div>
        
        {/* Modal Body */}
        <div className="modal-body pt-2">
          <LoginForm 
            onSuccess={onClose}
            onLoginSuccess={onLoginSuccess}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          
          {/* Additional Options */}
          <div className="text-center mt-4">
            <div className="d-flex align-items-center justify-content-center mb-3">
              <hr className="flex-grow-1" />
              <span className="px-3 text-muted small">Don't have an account?</span>
              <hr className="flex-grow-1" />
            </div>
            <div className="d-grid gap-2 d-md-flex justify-content-md-center">
              <button 
                className="btn btn-outline-success btn-sm px-4"
                onClick={() => {
                  onClose()
                  // Trigger borrower registration modal
                }}
              >
                Sign up as Borrower
              </button>
              <button 
                className="btn btn-outline-purple btn-sm px-4"
                onClick={() => {
                  onClose()
                  // Trigger company registration modal
                }}
              >
                Register Company
              </button>
            </div>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="modal-footer border-0 pt-0">
          <div className="w-100 text-center">
            <small className="text-muted">
              By signing in, you agree to our 
              <a href="#" className="text-decoration-none text-primary ms-1">Terms of Service</a> and 
              <a href="#" className="text-decoration-none text-primary ms-1">Privacy Policy</a>
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginModal