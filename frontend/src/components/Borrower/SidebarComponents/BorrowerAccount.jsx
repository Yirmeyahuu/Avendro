import React from 'react'

const BorrowerAccount = ({ user }) => {
  return (
    <div className="dashboard-content">
      <div className="card">
        <div className="card-header">
          <h4 className="mb-0">Account Settings</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6>Personal Information</h6>
              <p><strong>Name:</strong> {user?.first_name} {user?.last_name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
            </div>
            <div className="col-md-6">
              <h6>Account Details</h6>
              <p><strong>User Type:</strong> {user?.user_type}</p>
              <p><strong>Username:</strong> {user?.username}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BorrowerAccount