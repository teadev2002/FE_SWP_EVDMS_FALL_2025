import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';
import '../styles/Header.scss';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navTabs = [
    { name: 'Products', path: '/' },
    { name: 'Test Drive History', path: '/test-drives' }
  ];

  const isActiveTab = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h3 className="header-title">EV Dealer Management System</h3>
        </div>
        
        {/* Navigation Tabs */}
        <nav className="header-nav">
          {navTabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`nav-tab ${isActiveTab(tab.path) ? 'active' : ''}`}
            >
              {tab.name}
            </Link>
          ))}
        </nav>

        <div className="header-right">
          <Dropdown align="end">
            <Dropdown.Toggle variant="eco-header" id="dropdown-user" className="user-dropdown-toggle">
              <User size={18} className="me-2" />
              {isAuthenticated && user ? user.role : 'Guest'}
            </Dropdown.Toggle>

            <Dropdown.Menu className="user-dropdown-menu">
              {!isAuthenticated ? (
                <Dropdown.Item onClick={handleLogin}>
                  <span className="dropdown-icon">🔐</span>
                  Login
                </Dropdown.Item>
              ) : (
                <>
                  <Dropdown.Item disabled className="user-info-item">
                    <strong>{user.role}</strong>
                    <br />
                    <small className="text-muted">{user.username}</small>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="logout-item">
                    <span className="dropdown-icon">🚪</span>
                    Logout
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Header;

