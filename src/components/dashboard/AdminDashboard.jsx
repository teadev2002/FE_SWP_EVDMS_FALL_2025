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
    label: <Link to={key} style={{ color: '#fff',textDecoration: 'none'  }}>{label}</Link>, 
  };
}

const items = [
  getItem('Vehicle Catalog', 'vehicle-catalog', <PieChartOutlined />), // ('TÊN HIỂN THỊ RA', 'ĐƯỜNG DẪN KHI CLICK VÀO', <ICON>)
  getItem('Inventory & Allocation', 'inventory-allocation', <TeamOutlined />, [
    getItem('Inventory Management', 'inventory-allocation/inventory', <FileOutlined />),
    getItem('Vehicle Allocation', 'inventory-allocation/vehicle-allocation', <FileOutlined />),
  ],
  
),
  getItem('Price Promotion', 'price-promotion-manage', <UserOutlined />),
  
  getItem('Agency Management', 'agency-management',  <FileOutlined />,[
    getItem('Agreements', 'agency-management/agreements-management', <FileOutlined />),
    getItem('Sales', 'agency-management/sales-management', <FileOutlined />),
    getItem('Debt', 'agency-management/debt-management', <FileOutlined />),
  ]),
  getItem('Account Management', 'account-management', <DesktopOutlined />),
  getItem('Reports & Analysis', 'reports-analysis', <PieChartOutlined /> ),
  getItem('Inventory & Consumtion', 'inventory-&-consumtion-report', <DesktopOutlined />),
  ] 

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250}  collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <h4 style={{color:"white",textAlign:"center", marginTop:"10px", marginBottom:"10px", fontWeight:"bold"}}>Dashboard</h4 >
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
              background: 'colorBgContainer',
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
export default AdminDashboard;