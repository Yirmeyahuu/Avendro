import React, { useState, useEffect } from 'react'

const BorrowerOverview = ({ user }) => {
  const [notifications, setNotifications] = useState([])
  const [activeLoan, setActiveLoan] = useState(null)
  const [loanApplications, setLoanApplications] = useState([])

  // Sample data - replace with actual API calls
  useEffect(() => {
    setNotifications([
      { id: 1, type: 'payment', message: 'Payment due in 3 days', date: '2024-09-11' },
      { id: 2, type: 'info', message: 'New loan products available', date: '2024-09-08' }
    ])

    setActiveLoan({
      id: 'L-001',
      amount: 50000,
      outstanding: 35000,
      nextPayment: '2024-09-15',
      amountDue: 2500,
      interestRate: 12,
      term: 24,
      disbursementDate: '2024-01-15'
    })

    setLoanApplications([
      { id: 'APP-001', type: 'Personal Loan', amount: 25000, status: 'pending', date: '2024-09-05' }
    ])
  }, [])

  return (
    <div className="dashboard-content">
      <div className="row">
        {/* Welcome Section */}
        <div className="col-12 mb-4">
          <div className="card">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h2 className="mb-2">Welcome back, {user?.first_name}! 👋</h2>
                  <p className="text-muted mb-0">Here's an overview of your account activity</p>
                </div>
                <div className="col-md-4">
                  <div className="row text-center">
                    <div className="col-6">
                      <h4 className="text-primary mb-1">{activeLoan ? '1' : '0'}</h4>
                      <small className="text-muted">Active Loans</small>
                    </div>
                    <div className="col-6">
                      <h4 className="text-warning mb-1">
                        {activeLoan ? `₱${activeLoan.outstanding.toLocaleString()}` : '₱0'}
                      </h4>
                      <small className="text-muted">Outstanding</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Loan Summary */}
        <div className="col-lg-8 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-chart-pie me-2"></i>Active Loan Summary
              </h5>
            </div>
            <div className="card-body">
              {activeLoan ? (
                <div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="text-muted small">Loan Amount</label>
                        <h5 className="mb-0">₱{activeLoan.amount.toLocaleString()}</h5>
                      </div>
                      <div>
                        <label className="text-muted small">Outstanding Balance</label>
                        <h5 className="mb-0 text-warning">₱{activeLoan.outstanding.toLocaleString()}</h5>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="text-muted small">Next Payment Due</label>
                        <h6 className="mb-0">{new Date(activeLoan.nextPayment).toLocaleDateString()}</h6>
                      </div>
                      <div>
                        <label className="text-muted small">Amount Due</label>
                        <h5 className="mb-0 text-danger">₱{activeLoan.amountDue.toLocaleString()}</h5>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <label className="text-muted small">Loan Progress</label>
                    <div className="progress">
                      <div 
                        className="progress-bar bg-success" 
                        style={{ width: `${((activeLoan.amount - activeLoan.outstanding) / activeLoan.amount) * 100}%` }}
                      ></div>
                    </div>
                    <small className="text-muted">
                      {((activeLoan.amount - activeLoan.outstanding) / activeLoan.amount * 100).toFixed(1)}% paid
                    </small>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-info-circle text-muted fa-3x mb-3"></i>
                  <h6>No Active Loans</h6>
                  <p className="text-muted">You don't have any active loans at the moment.</p>
                  <button className="btn btn-primary">Apply for a Loan</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & Notifications */}
        <div className="col-lg-4 mb-4">
          <div className="card mb-3">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="fas fa-bolt me-2"></i>Quick Actions
              </h6>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                {activeLoan && (
                  <button className="btn btn-success btn-sm">
                    <i className="fas fa-credit-card me-2"></i>Pay Now
                  </button>
                )}
                <button className="btn btn-primary btn-sm">
                  <i className="fas fa-plus me-2"></i>Apply for New Loan
                </button>
                {activeLoan && (
                  <button className="btn btn-outline-info btn-sm">
                    <i className="fas fa-eye me-2"></i>View Loan Details
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="fas fa-bell me-2"></i>Notifications
              </h6>
            </div>
            <div className="card-body">
              {notifications.length > 0 ? (
                <div>
                  {notifications.map(notif => (
                    <div key={notif.id} className="border-bottom pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                      <p className="mb-1 small">{notif.message}</p>
                      <small className="text-muted">{new Date(notif.date).toLocaleDateString()}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center mb-0">No new notifications</p>
              )}
            </div>
          </div>
        </div>

        {/* Loan Application Status */}
        {loanApplications.length > 0 && (
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-hourglass-half me-2"></i>Loan Application Status
                </h5>
              </div>
              <div className="card-body">
                {loanApplications.map(app => (
                  <div key={app.id} className="row align-items-center border-bottom pb-3 mb-3">
                    <div className="col-md-8">
                      <h6 className="mb-1">{app.type}</h6>
                      <p className="mb-1">Amount: ₱{app.amount.toLocaleString()}</p>
                      <small className="text-muted">Applied: {new Date(app.date).toLocaleDateString()}</small>
                    </div>
                    <div className="col-md-4 text-end">
                      <span className={`badge bg-warning`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BorrowerOverview