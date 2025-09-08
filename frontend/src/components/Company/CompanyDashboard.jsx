import React, { useState, useEffect } from 'react'
import Sidebar from '../shared/Sidebar/Sidebar'
import Header from '../shared/Header/Header'
import CompanyOverview from './CompanyOverview'
import '../../styles/CompanyDashboard.css'

const CompanyDashboard = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('🏢 CompanyDashboard mounted for user:', user)
    // Simulate loading time for smooth transition
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [user])

  // Show loading if user data is not ready
  if (!user || isLoading) {
    return (
      <div className="dashboard-loading" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <h5>Loading Dashboard...</h5>
          <p className="text-muted">Welcome back, {user?.full_name}!</p>
        </div>
      </div>
    )
  }

  // Company-specific menu items
  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: '📊',
      description: 'Dashboard overview'
    },
    {
      id: 'loans',
      label: 'Loans',
      icon: '💰',
      description: 'Manage active loans'
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: '📋',
      description: 'Review loan applications'
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: '👥',
      description: 'Manage clients'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: '📈',
      description: 'Financial reports'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      description: 'Company settings'
    }
  ]

  // Brand configuration for company
  const brandConfig = {
    icon: '🏢',
    name: 'Avendro',
    subtitle: 'Company Portal'
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <CompanyOverview user={user} />
      case 'loans':
        return (
          <div className="dashboard-content">
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">Loan Management</h4>
              </div>
              <div className="card-body">
                <p>Loan management functionality coming soon...</p>
              </div>
            </div>
          </div>
        )
      case 'applications':
        return (
          <div className="dashboard-content">
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">Loan Applications</h4>
              </div>
              <div className="card-body">
                <p>Loan applications functionality coming soon...</p>
              </div>
            </div>
          </div>
        )
      case 'clients':
        return (
          <div className="dashboard-content">
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">Client Management</h4>
              </div>
              <div className="card-body">
                <p>Client management functionality coming soon...</p>
              </div>
            </div>
          </div>
        )
      case 'reports':
        return (
          <div className="dashboard-content">
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">Financial Reports</h4>
              </div>
              <div className="card-body">
                <p>Reports functionality coming soon...</p>
              </div>
            </div>
          </div>
        )
      case 'settings':
        return (
          <div className="dashboard-content">
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">Company Settings</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Company Information</h6>
                    <p><strong>Company Name:</strong> {user.company_name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Account Details</h6>
                    <p><strong>User Type:</strong> {user.user_type}</p>
                    <p><strong>Full Name:</strong> {user.full_name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return <CompanyOverview user={user} />
    }
  }

  return (
    <div className="company-dashboard">
      <Sidebar
        menuItems={menuItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        brandConfig={brandConfig}
      />
      
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header
          user={user}
          onLogout={onLogout}
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          title="Company Dashboard"
          subtitle={user.company_name}
        />
        
        <main className="dashboard-main">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default CompanyDashboard