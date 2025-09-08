import React, { useState, useEffect } from 'react'
import Sidebar from '../shared/Sidebar/Sidebar'
import Header from '../shared/Header/Header'
import BorrowerOverview from './BorrowerOverview'
import BorrowerLoans from './SidebarComponents/BorrowerLoans'
import BorrowerLoanApplication from './SidebarComponents/BorrowerLoanApplications'
import BorrowerPayments from './SidebarComponents/BorrowerPayments'
import BorrowerAccount from './SidebarComponents/BorrowerAccount'
import BorrowerHelp from './BorrowerHelp'
import '../../styles/BorrowerDashboard.css'

const BorrowerDashboard = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('👤 BorrowerDashboard mounted for user:', user)
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
          <p className="text-muted">Welcome back, {user?.first_name}!</p>
        </div>
      </div>
    )
  }

  // Borrower-specific menu items
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      description: 'Account overview'
    },
    {
      id: 'my-loans',
      label: 'My Loans',
      icon: '📋',
      description: 'View active loans'
    },
    {
      id: 'apply-loan',
      label: 'Apply for Loans',
      icon: '➕',
      description: 'Apply for new loan'
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: '💳',
      description: 'Make payments'
    },
    {
      id: 'account',
      label: 'Account',
      icon: '👤',
      description: 'Account settings'
    },
    {
      id: 'help',
      label: 'Help Center',
      icon: '❓',
      description: 'Get support'
    }
  ]

  // Brand configuration for borrower
  const brandConfig = {
    icon: '👤',
    name: 'Avendro',
    subtitle: 'Borrower Portal'
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <BorrowerOverview user={user} />
      case 'my-loans':
        return <BorrowerLoans user={user} />
      case 'apply-loan':
        return <BorrowerLoanApplication user={user} />
      case 'payments':
        return <BorrowerPayments user={user} />
      case 'account':
        return <BorrowerAccount user={user} />
      case 'help':
        return <BorrowerHelp user={user} />
      default:
        return <BorrowerOverview user={user} />
    }
  }

  return (
    <div className="borrower-dashboard">
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
          title="Borrower Dashboard"
          subtitle={`${user.first_name} ${user.last_name}`}
        />
        
        <main className="dashboard-main">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default BorrowerDashboard