import React, { useState } from 'react'
import LoginForm from './LoginForm'
import '../../styles/AuthModal.css' 

const LoginModal = ({ onClose }) => {
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
          <h2 className="text-2xl font-bold">Login</h2>
          <button 
            onClick={onClose}
            className="close-button text-2xl hover:text-red-500"
          >
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <LoginForm 
            onSuccess={onClose}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default LoginModal