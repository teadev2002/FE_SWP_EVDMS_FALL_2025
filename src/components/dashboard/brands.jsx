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
//   getItem('Brand Vehicles', 'brand-vehicles', <PieChartOutlined />), // ('TÊN HIỂN THỊ RA', 'ĐƯỜNG DẪN KHI CLICK VÀO', <ICON>)
//   getItem('Inventory & Allocation', 'inventory-allocation', <TeamOutlined />, [
//     getItem('Inventory Management', 'inventory-allocation/inventory', <FileOutlined />),
//     getItem('Vehicle Allocation', 'inventory-allocation/vehicle-allocation', <FileOutlined />),
//   ],
  
// ),
//   getItem('Price Promotion', 'price-promotion-manage', <UserOutlined />),
  
//   getItem('Agency Management', 'agency-management',  <FileOutlined />,[
//     getItem('Agreements', 'agency-management/agreements-management', <FileOutlined />),
//     getItem('Sales', 'agency-management/sales-management', <FileOutlined />),
//     getItem('Debt', 'agency-management/debt-management', <FileOutlined />),
//   ]),
//     getItem('Store Management', 'store-management',  <FileOutlined />),
     
//   // getItem('Account Management', 'account-management', <DesktopOutlined />),
//   // getItem('Reports & Analysis', 'reports-analysis', <PieChartOutlined /> ),
//   // getItem('Inventory & Consumtion', 'inventory-&-consumtion-report', <DesktopOutlined />),
//   ] 

// const Brands = () => {
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
//           <h4 style={{color:"white",textAlign:"center", marginTop:"10px", marginBottom:"10px", fontWeight:"bold"}}>EVM brands</h4>
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
// export default Brands;

// update
 import React, { useState, useEffect } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
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
  const [collapsed, setCollapsed] = useState(false);
  const { brandSlug } = useParams();
  const navigate = useNavigate();

  // Lấy thông tin từ localStorage
  const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
  const { brandName = 'Brand', brandSlug: savedSlug, brandId } = staffInfo;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Kiểm tra slug có khớp không
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
//    getItem('Price Promotion', 'price-promotion-manage', <UserOutlined />),
    getItem('Sale Store', 'agency-management', <FileOutlined />, [
      getItem('Agreements', 'agency-management/agreements-management', <FileOutlined />),
      getItem('Sales', 'agency-management/sales-management', <FileOutlined />),
    //  getItem('Debt', 'agency-management/debt-management', <FileOutlined />),
    ]),
    getItem('Store Management', 'store-management', <FileOutlined />),
    getItem('Staff Account', 'staff-account', <DesktopOutlined />),
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
            {brandName}
          </h4>
          <Menu theme="dark" defaultSelectedKeys={['brand-vehicles']} mode="inline" items={items} />
        </Sider>
        <Layout style={{ padding: '0 16px' }}>
          <Content style={{ margin: '16px 0' }}>
            <div style={{
              padding: 0,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}>
              <Outlet context={{ brandId, brandName }} /> {/* Truyền xuống con */}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Project EVDMS ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
      <CompactChatbox />
    </Layout>
  );
};

export default Brands;