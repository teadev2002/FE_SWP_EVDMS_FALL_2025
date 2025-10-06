import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import DashboardHeader from '../DashboardHeader';
 
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={key} style={{ color: '#fff',textDecoration: 'none'  }}>{label}</Link>, // Thêm style màu trắng
  };
}

const items = [
  getItem('E-Vehicles', 'vehicle', <PieChartOutlined />),
  getItem('Sales', 'sales', <TeamOutlined />, [
    getItem('Promotions', 'sales/promotions', <FileOutlined />),
    getItem('Sale Agreements', 'sales/agreements', <UserOutlined />),
    getItem('Factory Orders', 'sales/factory-order', <DesktopOutlined />),
    getItem('Delivery Tracking', 'sales/delivery-tracking', <DesktopOutlined />),
     getItem('Payment Management', 'sales/payment-management', <DesktopOutlined />),
  ],
  
),
  getItem('Customer', 'customer', <UserOutlined />, [
    getItem('Overview', 'customer-overview', <FileOutlined />),
   getItem('Profile', 'customer-profile', <FileOutlined />),
  ]
 
  ),
  
  getItem('Report', 'report',  <FileOutlined />,[
    getItem('Staff Sales Report', 'report/staff-sales-report', <FileOutlined />),
    getItem('Customer Debt Report', 'report/customer-debt-report', <FileOutlined />),
  ]),
];
const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250}  collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
         <h4 style={{color:"white",textAlign:"center", marginTop:"10px", marginBottom:"10px", fontWeight:"bold"}}>Dealer</h4 >
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#2d5016' }}>
          <DashboardHeader />
        </Header>
        <Content style={{ margin: '0 16px' }}>
          
          <div
            style={{
              padding: 0,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
          <Outlet  />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
        Project EVDMS ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Dashboard;