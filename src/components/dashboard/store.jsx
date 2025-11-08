// import React, { useState } from 'react';
// import {
//   DesktopOutlined,
//   FileOutlined,
//   PieChartOutlined,
//   TeamOutlined,
//   UserOutlined,
//   CarOutlined,
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
//     label: <Link to={key} style={{ color: '#fff', textDecoration: 'none' }}>{label}</Link>,
//   };
// }

// const items = [
//   getItem('E-Vehicles', 'vehicle', <PieChartOutlined />),

//   getItem('Test Appointment', 'testappointment', <CarOutlined />),

//   getItem('Sales', 'sales', <TeamOutlined />, [
//     getItem('Promotions', 'sales/promotions', <FileOutlined />),
//     getItem('Sale Agreements', 'sales/agreements', <UserOutlined />),
//     getItem('Factory Orders', 'sales/factory-order', <DesktopOutlined />),
//     getItem('Delivery Tracking', 'sales/delivery-tracking', <DesktopOutlined />),
//     getItem('Payment Management', 'sales/payment-management', <DesktopOutlined />),
//   ],

//   ),
//   getItem('Customer', 'customer', <UserOutlined />, [
//     getItem('Overview', 'customer-overview', <FileOutlined />),
//     getItem('Profile', 'customer-profile', <FileOutlined />),
//   ]

//   ),

//   getItem('Report', 'report', <FileOutlined />, [
//     getItem('Staff Sales Report', 'report/staff-sales-report', <FileOutlined />),
//     getItem('Customer Debt Report', 'report/customer-debt-report', <FileOutlined />),
//   ]),
// ];
// const Store = () => {
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
//           <h4 style={{ color: "white", textAlign: "center", marginTop: "10px", marginBottom: "10px", fontWeight: "bold" }}>Store</h4>
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
// export default Store;

//update 
import React, { useState, useEffect } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  CarOutlined,
  DashboardOutlined
  ,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { Link, Outlet, useParams, useNavigate } from 'react-router-dom';
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

const Store = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { storeSlug } = useParams();
  const navigate = useNavigate();

  // Lấy thông tin từ localStorage
  const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
  const { storeName = 'Store', storeSlug: savedSlug, storeId } = dealerInfo;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Kiểm tra slug có khớp không
  useEffect(() => {
    if (savedSlug && storeSlug && savedSlug !== storeSlug) {
      // Redirect về slug đúng
      navigate(`/store/${savedSlug}/vehicle`, { replace: true });
    }
  }, [storeSlug, savedSlug, navigate]);

  const items = [
    getItem('E-Vehicles', 'vehicle', <PieChartOutlined />),
    getItem('Test Appointment', 'testappointment', <CarOutlined />),
    getItem('Sales', 'sales', <TeamOutlined />, [
      getItem('Promotions', 'sales/promotions', <FileOutlined />),
      getItem('Sale Agreements', 'sales/agreements', <UserOutlined />),
      getItem('Factory Orders', 'sales/factory-order', <DesktopOutlined />),
      getItem('Delivery Tracking', 'sales/delivery-tracking', <DesktopOutlined />),
      getItem('Payment Management', 'sales/payment-management', <DesktopOutlined />),
    ]),
    getItem('Customer', 'customer', <UserOutlined />, [
      getItem('Overview', 'customer-overview', <FileOutlined />),
      getItem('Profile', 'customer-profile', <FileOutlined />),
    ]),
    getItem('Report', 'report', <FileOutlined />, [
      getItem('Staff Sales Report', 'report/staff-sales-report', <FileOutlined />),
      getItem('Customer Debt Report', 'report/customer-debt-report', <FileOutlined />),
    ]),
    getItem('Dashboard', 'dealer_dashboard', <DashboardOutlined />),

  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: 0, background: '#001529', position: 'sticky', top: 0, zIndex: 1000 }}>
        <DashboardHeader />
      </Header>
      <Layout>
        <Sider width={250} collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          <div className="demo-logo-vertical" />
          <h4 style={{
            color: "white",
            textAlign: "center",
            margin: "10px 0",
            fontWeight: "bold"
          }}>
            {storeName}
          </h4>
          <Menu theme="dark" defaultSelectedKeys={['vehicle']} mode="inline" items={items} />
        </Sider>
        <Layout style={{ padding: '0 16px' }}>
          <Content style={{ margin: '16px 0' }}>
            <div style={{
              padding: 0,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}>
              <Outlet context={{ storeId, storeName }} /> {/* Truyền xuống con */}
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

export default Store;