import React from 'react';
import { Dropdown, Space } from 'antd';
import { UserOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardHeader = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = !isAuthenticated
    ? [
        {
          key: 'login',
          icon: <LoginOutlined />,
          label: 'Login',
          onClick: handleLogin,
        },
      ]
    : [
        {
          key: 'user-info',
          label: (
            <div>
              <strong>{user.role}</strong>
              <br />
              <small style={{ color: '#888' }}>{user.username}</small>
            </div>
          ),
          disabled: true,
        },
        {
          type: 'divider',
        },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'Logout',
          danger: true,
          onClick: handleLogout,
        },
      ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        height: '100%',
        background: 'linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%)',
      }}
    >
      <h3 style={{ color: '#fff', margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
        EV Dealer Management System
      </h3>
      <Dropdown
        menu={{ items: menuItems }}
        placement="bottomRight"
        trigger={['click']}
      >
        <Space
          style={{
            cursor: 'pointer',
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            color: '#fff',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          }}
        >
          <UserOutlined style={{ fontSize: '16px' }} />
          <span>{isAuthenticated && user ? user.role : 'Guest'}</span>
        </Space>
      </Dropdown>
    </div>
  );
};

export default DashboardHeader;

