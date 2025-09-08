import React from 'react'
import '../../../styles/Sidebar.css' 

const Sidebar = ({ menuItems, activeSection, setActiveSection, collapsed, setCollapsed, brandConfig }) => {
  return (
    <div className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="brand-icon">{brandConfig.icon}</span>
          {!collapsed && (
            <div className="brand-text">
              <span className="brand-name">{brandConfig.name}</span>
              <span className="brand-subtitle">{brandConfig.subtitle}</span>
            </div>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map(item => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
                title={collapsed ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {!collapsed && (
                  <div className="nav-text">
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-description">{item.description}</span>
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar