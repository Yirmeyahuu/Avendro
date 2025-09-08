import React from 'react'

const CompanyOverview = ({ user }) => {
  return (
    <div className="dashboard-content">
      <div className="welcome-section mb-4">
        <div className="card">
          <div className="card-body">
            <h2 className="welcome-title">Welcome back, {user.full_name}! 👋</h2>
            <p className="welcome-subtitle">
              Here's what's happening with <strong>{user.company_name}</strong> today.
            </p>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="row">
          <div className="col-md-4">
            <div className="stat-card bg-primary">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>0</h3>
                <p>Active Loans</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card bg-success">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>₱0</h3>
                <p>Total Disbursed</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card bg-warning">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <h3>0</h3>
                <p>Pending Applications</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions-section mt-4">
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="quick-action-buttons">
                  <button className="btn btn-primary btn-sm me-2 mb-2">
                    📝 New Loan Application
                  </button>
                  <button className="btn btn-outline-primary btn-sm me-2 mb-2">
                    👥 Add New Client
                  </button>
                  <button className="btn btn-outline-secondary btn-sm mb-2">
                    📊 Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Recent Activity</h5>
              </div>
              <div className="card-body">
                <div className="activity-item">
                  <span className="activity-icon">🎉</span>
                  <span className="activity-text">Company account created successfully!</span>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">🔐</span>
                  <span className="activity-text">Profile setup completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyOverview