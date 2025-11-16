//update 
// import React, { useState, useEffect } from 'react';
// import {
//   DesktopOutlined,
//   FileOutlined,
//   PieChartOutlined,
//   TeamOutlined,
//   UserOutlined,
//   CarOutlined,
//   DashboardOutlined
//   ,
// } from '@ant-design/icons';
// import { Layout, Menu, theme } from 'antd';
// import { Link, Outlet, useParams, useNavigate } from 'react-router-dom';
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

// const Store = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const { storeSlug } = useParams();
//   const navigate = useNavigate();

//   // Lấy thông tin từ localStorage
//   const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
//   const { storeName = 'Store', storeSlug: savedSlug, storeId } = dealerInfo;

//   const {
//     token: { colorBgContainer, borderRadiusLG },
//   } = theme.useToken();

//   // Kiểm tra slug có khớp không
//   useEffect(() => {
//     if (savedSlug && storeSlug && savedSlug !== storeSlug) {
//       // Redirect về slug đúng
//       navigate(`/store/${savedSlug}/vehicle`, { replace: true });
//     }
//   }, [storeSlug, savedSlug, navigate]);

//   const items = [
//     getItem('E-Vehicles', 'vehicle', <PieChartOutlined />),
//     getItem('Test Appointment', 'testappointment', <CarOutlined />),
//     getItem('Sales', 'sales', <TeamOutlined />, [
//     getItem('Sale Agreements', 'sales/agreements', <UserOutlined />),
//    //   getItem('Factory Orders', 'sales/factory-order', <DesktopOutlined />),
//     getItem('Payment Management', 'sales/payment-management', <DesktopOutlined />),
//     getItem('Delivery Tracking', 'sales/delivery-tracking', <DesktopOutlined />),
//     getItem('Promotions', 'sales/promotions', <FileOutlined />),
//     ]),
//     getItem('Customer', 'customer', <UserOutlined />, [
//  //     getItem('Overview', 'customer-overview', <FileOutlined />),
//       getItem('Profile', 'customer-profile', <FileOutlined />),
//       getItem('Feedback', 'customer-feedback', <FileOutlined />),
//     ]),
//     getItem('Report', 'report', <FileOutlined />, [
//       getItem('Staff Sales Report', 'report/staff-sales-report', <FileOutlined />),
//  //     getItem('Customer Debt Report', 'report/customer-debt-report', <FileOutlined />),
//     ]),
//     getItem('Dashboard', 'dealer_dashboard', <DashboardOutlined />),
//     getItem('Dealer Account', 'dealer-account', <DesktopOutlined />),

//   ];

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       <Header style={{ padding: 0, background: '#001529', position: 'sticky', top: 0, zIndex: 1000 }}>
//         <DashboardHeader />
//       </Header>
//       <Layout>
//         <Sider width={250} collapsible collapsed={collapsed} onCollapse={setCollapsed}>
//           <div className="demo-logo-vertical" />
//           <h4 style={{
//             color: "white",
//             textAlign: "center",
//             margin: "10px 0",
//             fontWeight: "bold"
//           }}>
//             {storeName}
//           </h4>
//           <Menu theme="dark" defaultSelectedKeys={['vehicle']} mode="inline" items={items} />
//         </Sider>
//         <Layout style={{ padding: '0 16px' }}>
//           <Content style={{ margin: '16px 0' }}>
//             <div style={{
//               padding: 0,
//               minHeight: 360,
//               background: colorBgContainer,
//               borderRadius: borderRadiusLG,
//             }}>
//               <Outlet context={{ storeId, storeName }} /> {/* Truyền xuống con */}
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

// auto close / open
import React, { useState, useEffect } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  CarOutlined,
  DashboardOutlined,
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
  const [collapsed, setCollapsed] = useState(true); // Bắt đầu: thu gọn
  const { storeSlug } = useParams();
  const [pinned, setPinned] = useState(false);
  const navigate = useNavigate();

  const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
  const { storeName = 'Store', storeSlug: savedSlug, storeId } = dealerInfo;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (savedSlug && storeSlug && savedSlug !== storeSlug) {
      navigate(`/store/${savedSlug}/vehicle`, { replace: true });
    }
  }, [storeSlug, savedSlug, navigate]);

  const items = [
    getItem('E-Vehicles', 'vehicle', <PieChartOutlined />),
    getItem('Test Appointment', 'testappointment', <CarOutlined />),
    getItem('Sales', 'sales', <TeamOutlined />, [
      getItem('Sale Agreements', 'sales/agreements', <UserOutlined />),
      getItem('Payment Management', 'sales/payment-management', <DesktopOutlined />),
      getItem('Delivery Tracking', 'sales/delivery-tracking', <DesktopOutlined />),
      getItem('Promotions', 'sales/promotions', <FileOutlined />),
    ]),
    getItem('Customer', 'customer', <UserOutlined />, [
      getItem('Profile', 'customer-profile', <FileOutlined />),
      getItem('Feedback', 'customer-feedback', <FileOutlined />),
    ]),
    getItem('Report', 'report', <FileOutlined />, [
      getItem('Staff Sales Report', 'report/staff-sales-report', <FileOutlined />),
    ]),
    getItem('Dashboard', 'dealer_dashboard', <DashboardOutlined />),
    getItem('Dealer Account', 'dealer-account', <DesktopOutlined />),
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: 0, background: '#001529', position: 'sticky', top: 0, zIndex: 1000 }}>
        <DashboardHeader />
      </Header>

      <Layout>
        {/* HOVER TO EXPAND – DÙNG CHÍNH collapsed CỦA ANTD */}
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
            top: 64, // chiều cao Header
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
            {storeName}
             <span  onClick={() => setPinned(!pinned)}> &nbsp;&nbsp;&nbsp;&nbsp;
          {pinned ? '📍' : '📌'}
          </span>
          </h4>

          <Menu
            theme="dark"
            defaultSelectedKeys={['vehicle']}
            mode="inline"
            items={items}
            style={{ borderRight: 0 }}
          />
        </Sider>

        {/* Điều chỉnh content để không bị che */}
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
              <Outlet context={{ storeId, storeName }} />
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

export default Store;