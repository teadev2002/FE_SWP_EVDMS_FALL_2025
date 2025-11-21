
//  import React, { useState, useEffect } from 'react';

// import {
//   DesktopOutlined,
//   FileOutlined,
//   PieChartOutlined,
//   TeamOutlined,
//   UserOutlined,
// } from '@ant-design/icons';
// import { Layout, Menu, theme } from 'antd';
// import { Link, Outlet, useParams, useNavigate } from 'react-router-dom';
// import DashboardHeader from '../DashboardHeader';
// import CompactChatbox from '../boxchatai/CompactChatbox';

// const { Header, Content, Footer, Sider } = Layout;

// function getItem(label, key, icon, children) {
//   return {
//     key,
//     icon,
//     children,
//     label: <Link to={key} style={{ color: '#fff', textDecoration: 'none' }}>{label}</Link>,
//   };
// }

// const Brands = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const { brandSlug } = useParams();
//   const navigate = useNavigate();

//   // Lấy thông tin từ localStorage
//   const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
//   const { brandName = 'Brand', brandSlug: savedSlug, brandId } = staffInfo;

//   const {
//     token: { colorBgContainer, borderRadiusLG },
//   } = theme.useToken();

//   // Kiểm tra slug có khớp không
//   useEffect(() => {
//     if (savedSlug && brandSlug && savedSlug !== brandSlug) {
//       navigate(`/brands/${savedSlug}/brand-vehicles`, { replace: true });
//     }
//   }, [brandSlug, savedSlug, navigate]);

//   const items = [
//     getItem('Brand Vehicles', 'brand-vehicles', <PieChartOutlined />),
//     getItem('Inventory & Allocation', 'inventory-allocation', <TeamOutlined />, [
//       getItem('Inventory Management', 'inventory-allocation/inventory', <FileOutlined />),
//       getItem('Vehicle Allocation', 'inventory-allocation/vehicle-allocation', <FileOutlined />),
//     ]),
// //    getItem('Price Promotion', 'price-promotion-manage', <UserOutlined />),
//     getItem('Sale Store', 'agency-management', <FileOutlined />, [
//       getItem('Agreements', 'agency-management/agreements-management', <FileOutlined />),
//       getItem('Sales', 'agency-management/sales-management', <FileOutlined />),
//     //  getItem('Debt', 'agency-management/debt-management', <FileOutlined />),
//     ]),
//     getItem('Store Management', 'store-management', <FileOutlined />),
//     getItem('Staff Account', 'staff-account', <DesktopOutlined />),
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
//             {brandName}
//           </h4>
//           <Menu theme="dark" defaultSelectedKeys={['brand-vehicles']} mode="inline" items={items} />
//         </Sider>
//         <Layout style={{ padding: '0 16px' }}>
//           <Content style={{ margin: '16px 0' }}>
//             <div style={{
//               padding: 0,
//               minHeight: 360,
//               background: colorBgContainer,
//               borderRadius: borderRadiusLG,
//             }}>
//               <Outlet context={{ brandId, brandName }} /> {/* Truyền xuống con */}
//             </div>
//           </Content>
//           <Footer style={{ textAlign: 'center' }}>
//             Project EVDMS ©{new Date().getFullYear()}
//           </Footer>
//         </Layout>
//       </Layout>
//       <CompactChatbox />
//     </Layout>
//   );
// };

// export default Brands;

// auto close / open
import React, { useState, useEffect } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { Link, Outlet, useParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '../DashboardHeader';
import CompactChatbox from '../boxchatai/CompactChatbox';

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={key} style={{ color: '#fff', textDecoration: 'none' }}>{label}</Link>,
  };
}

const Brands = () => {
  const [collapsed, setCollapsed] = useState(true); // Bắt đầu: thu gọn
  const { brandSlug } = useParams();
  const [pinned, setPinned] = useState(false);
  const navigate = useNavigate();

  const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
  const { brandName = 'Brand', brandSlug: savedSlug, brandId } = staffInfo;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (savedSlug && brandSlug && savedSlug !== brandSlug) {
      navigate(`/brands/${savedSlug}/brand-vehicles`, { replace: true });
    }
  }, [brandSlug, savedSlug, navigate]);

  const items = [
    getItem('Brand Vehicles', 'brand-vehicles', <PieChartOutlined />),
    getItem('Inventory & Allocation', 'inventory-allocation', <TeamOutlined />, [
      getItem('Inventory Management', 'inventory-allocation/inventory', <FileOutlined />),
      getItem('Vehicle Allocation', 'inventory-allocation/vehicle-allocation', <FileOutlined />),
    ]),
    getItem('Sale Store', 'agency-management', <FileOutlined />, [
      getItem('Agreements', 'agency-management/agreements-management', <FileOutlined />),
      getItem('Sales', 'agency-management/sales-management', <FileOutlined />),
    ]),
    getItem('Store Management', 'store-management', <FileOutlined />),
    getItem('Staff Account', 'staff-account', <UserOutlined />),
    getItem('Dashboard Overview', 'dashboard-overview', <DesktopOutlined />),
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: 0, background: '#001529', position: 'sticky', top: 0, zIndex: 1000 }}>
        <DashboardHeader />
      </Header>

      <Layout>
        {/* HOVER SIDEBAR – DÙNG collapsed CỦA ANTD */}
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
            {brandName} 
            <span  onClick={() => setPinned(!pinned)}> &nbsp;&nbsp;&nbsp;&nbsp;
          {pinned ? '📍' : '📌'}
          </span>
          </h4>

          <Menu
            theme="dark"
            defaultSelectedKeys={['brand-vehicles']}
            mode="inline"
            items={items}
            style={{ borderRight: 0 }}
          />
          
        </Sider>

        {/* Content dịch theo sidebar */}
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
              <Outlet context={{ brandId, brandName }} />
            </div>
          </Content>

          <Footer style={{ textAlign: 'center', padding: '12px 0' }}>
            Project EVDMS ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>

      {/* Chatbox vẫn ở dưới cùng */}
      <CompactChatbox />
    </Layout>
  );
};

export default Brands;