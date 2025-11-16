// import React, { useState } from 'react';
// import {
//   DesktopOutlined,
//   FileOutlined,
//   PieChartOutlined,
//   TeamOutlined,
//   UserOutlined,
// } from '@ant-design/icons';
// import { Breadcrumb, Layout, Menu, theme } from 'antd';
// import { Link, Outlet } from 'react-router-dom';
// import DashboardHeader from '../DashboardHeader';
 
// const { Header, Content, Footer, Sider } = Layout;
// function getItem(label, key, icon, children) {
//   return {
//     key,
//     icon,
//     children,
//     label: <Link to={key} style={{ color: '#fff',textDecoration: 'none'  }}>{label}</Link>, 
//   };
// }

// const items = [
  
//   getItem('Account Management', 'account-management', <DesktopOutlined />),
// //  getItem('Reports & Analysis', 'reports-analysis', <PieChartOutlined /> ),
//   getItem('Inventory & Consumtion', 'inventory-&-consumtion-report', <DesktopOutlined />),
//   getItem('Brand Management', 'brands-management', <UserOutlined />),
//   getItem('Store Management', 'store-management', <TeamOutlined />),
//   ] 

// const Admin = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const {
//     token: { colorBgContainer, borderRadiusLG },
//   } = theme.useToken();
//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       <Header style={{ padding: 0, background: '#001529', position: 'sticky', top: 0, zIndex: 1000 }}>
//         <DashboardHeader />
//       </Header>
//       <Layout>
//         <Sider width={250} collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
//           <div className="demo-logo-vertical" />
//           <h4 style={{color:"white",textAlign:"center", marginTop:"10px", marginBottom:"10px", fontWeight:"bold"}}>Dashboard</h4>
//           <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
//         </Sider>
//         <Layout style={{ padding: '0 16px' }}>
//           <Content style={{ margin: '16px 0' }}>
//             <div
//               style={{
//                 padding: 0,
//                 minHeight: 360,
//                 background: colorBgContainer,
//                 borderRadius: borderRadiusLG,
//               }}
//             >
//               <Outlet />
//             </div>
//           </Content>
//           <Footer style={{ textAlign: 'center' }}>
//             Project EVDMS ©{new Date().getFullYear()}
//           </Footer>
//         </Layout>
//       </Layout>
//     </Layout>
//   );
// };
// export default Admin;

// auto close / open
 import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import DashboardHeader from '../DashboardHeader';

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={key} style={{ color: '#fff', textDecoration: 'none' }}>{label}</Link>,
  };
}

const items = [
  getItem('Account Management', 'account-management', <DesktopOutlined />),
  getItem('Inventory & Consumtion', 'inventory-&-consumtion-report', <DesktopOutlined />),
  getItem('Brand Management', 'brands-management', <UserOutlined />),
  getItem('Store Management', 'store-management', <TeamOutlined />),
];

const Admin = () => {
  const [collapsed, setCollapsed] = useState(true); // Bắt đầu: thu gọn
  const [pinned, setPinned] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* HEADER – sticky */}
      <Header style={{ padding: 0, background: '#001529', position: 'sticky', top: 0, zIndex: 1000 }}>
        <DashboardHeader />
      </Header>

      <Layout>
      
        <Sider
          width={250}
          collapsedWidth={80}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          onMouseEnter={() => !pinned && setCollapsed(false)}
          onMouseLeave={() => !pinned && setCollapsed(true)}
          style={{
            overflow: 'hidden',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 64,      
            bottom: 0,
            zIndex: 999,
          }}
        >
          <div className="demo-logo-vertical" />
          <h4
            style={{
              color: 'white',
              textAlign: 'center',
              margin: '10px 0',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              transition: 'opacity 0.2s ease',
            }}
          >
            Dashboard
            <span
              onClick={() => setPinned(!pinned)}
              style={{ cursor: 'pointer', marginLeft: '8px' }}
            >
              {pinned ? '📍' : '📌'}
            </span>
          </h4>

          <Menu
            theme="dark"
            defaultSelectedKeys={['account-management']}
            mode="inline"
            items={items}
            style={{ borderRight: 0 }}
          />
        </Sider>

        {/* CONTENT – dịch theo sidebar, giống Brands */}
        <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'margin 0.2s ease' }}>
          <Content style={{ padding: '0 16px', marginTop: 64 }}>
            <div
              style={{
                padding: 0,
                minHeight: 'calc(100vh - 128px)',
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </div>
          </Content>

          <Footer style={{ textAlign: 'center', padding: '12px 0' }}>
            Project EVDMS ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Admin;