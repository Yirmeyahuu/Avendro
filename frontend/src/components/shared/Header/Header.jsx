import React, { useState } from 'react'
import '../../../styles/Header.css' 

const Header = ({ user, onLogout, toggleSidebar, title, subtitle }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      onLogout()
    }
  }

  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <div className="header-title">
          <h1>{title}</h1>
          {subtitle && <span className="header-subtitle">{subtitle}</span>}
        </div>
      </div>

      <div className="header-right">
        <div className="header-actions">
          <button className="notification-btn" title="Notifications">
            🔔
            <span className="notification-badge">0</span>
          </button>
          
          <div className="profile-dropdown">
            <button
              className="profile-btn"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <div className="profile-avatar">
                {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
              <div className="profile-info">
                <span className="profile-name">{user.full_name}</span>
                <span className="profile-role">{user.role}</span>
              </div>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showProfileDropdown && (
              <div className="profile-dropdown-menu">
                <div className="dropdown-header">
                  <div className="user-info">
                    <strong>{user.full_name}</strong>
                    <span>{user.email}</span>
                  </div>
                </div>
                <hr />
                <button className="dropdown-item">
                  👤 Profile Settings
                </button>
                <button className="dropdown-item">
                  🏢 Account Settings
                </button>
                <button className="dropdown-item">
                  ❓ Help & Support
                </button>
                <hr />
                <button 
                  className="dropdown-item logout"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header