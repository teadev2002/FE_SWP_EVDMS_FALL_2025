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
  
  getItem('Account Management', 'account-management', <DesktopOutlined />),
  getItem('Reports & Analysis', 'reports-analysis', <PieChartOutlined /> ),
  getItem('Inventory & Consumtion', 'inventory-&-consumtion-report', <DesktopOutlined />),
  ] 

const Admin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: 0, background: '#001529', position: 'sticky', top: 0, zIndex: 1000 }}>
        <DashboardHeader />
      </Header>
      <Layout>
        <Sider width={250} collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
          <div className="demo-logo-vertical" />
          <h4 style={{color:"white",textAlign:"center", marginTop:"10px", marginBottom:"10px", fontWeight:"bold"}}>DASHBOARD</h4>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        <Layout style={{ padding: '0 16px' }}>
          <Content style={{ margin: '16px 0' }}>
            <div
              style={{
                padding: 0,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Project EVDMS ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default Admin;