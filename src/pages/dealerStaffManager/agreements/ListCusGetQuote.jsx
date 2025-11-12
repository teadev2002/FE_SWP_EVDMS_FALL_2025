 
// import React, { useState, useEffect } from 'react';
// import { List, Avatar, Typography, Spin, Empty, Tag, Space } from 'antd';
// import { UserOutlined, MailOutlined } from '@ant-design/icons';
// import { toast } from 'react-toastify';
// import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
// import ManageQuoteService from '../../../services/ManageQuotes/ManageQuoteService';

// const { Title, Text } = Typography;

// const ListCusGetQuote = () => {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [storeId, setStoreId] = useState(null);

//   // Lấy storeId
//   useEffect(() => {
//     try {
//       const { storeId } = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
//       setStoreId(storeId ? Number(storeId) : null);
//     } catch {
//       toast.error('Invalid dealer information.');
//       setLoading(false);
//     }
//   }, []);

//   // Fetch customers + loại bỏ nếu đã có quote Accepted
//   useEffect(() => {
//     if (!storeId) return;

//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // 1. Lấy danh sách khách hàng có description = "Quote"
//         const customerData = await ManageCustomersService.getCustomerByStoreId(storeId);
//         const quoteRequestCustomers = customerData
//           .filter(c => c.description === 'Get Quote')
//           .map(c => ({ ...c, id: c.customerId }));

//         // 2. Lấy tất cả quotations
//         const allQuotes = await ManageQuoteService.getAllQuotations();

//         // 3. Tạo Set các customerId đã có quote Accepted
//         const acceptedCustomerIds = new Set(
//           allQuotes
//             .filter(q => q.status === 'Accepted')
//             .map(q => q.customerId)
//         );

//         // 4. Lọc bỏ những customer đã được duyệt
//         const filteredCustomers = quoteRequestCustomers.filter(
//           c => !acceptedCustomerIds.has(c.customerId)
//         );

//         setCustomers(filteredCustomers);
//       } catch (error) {
//         console.error('Failed to load data:', error);
//         toast.error('cannot load customer quote requests', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [storeId]);

//   // Loading
//   if (loading) {
//     return (
//       <div style={{ textAlign: 'center', padding: '32px 0' }}>
//         <Spin />
//         <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
//           Loading...
//         </Text>
//       </div>
//     );
//   }

//   // Empty
//   if (customers.length === 0) {
//     return (
//       <Empty
//         image={Empty.PRESENTED_IMAGE_SIMPLE}
//         description="There are no pending quote requests."
//         style={{ margin: '24px 0' }}
//       />
//     );
//   }

//   return (
//     <div style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)', borderRadius: 8 }}>
//       <Title level={3} style={{ margin: 0, padding: '12px 16px', textAlign: 'center', background: '#f5f5f5', borderRadius: '8px 8px 0 0' }}>
//         Request Quote
//       </Title>

//       <List
//         dataSource={customers}
//         renderItem={(c) => (
//           <List.Item
//             key={c.id}
//             style={{
//               background: '#fff',
//               borderRadius: 8,
//               padding: '10px 12px',
//               margin: '0 8px 8px',
//               boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
//             }}
//           >
//             <List.Item.Meta
//               avatar={
//                 <Avatar
//                   size={40}
//                   icon={<UserOutlined />}
//                   style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
//                 />
//               }
//               title={
//                 <Space size={4}>
//                   <Text strong style={{ fontSize: 15 }}>{c.fullName}</Text>
//                   {c.status === 'Pending' && <Tag color="gold" style={{ margin: 0, fontSize: 10 }}>Pending</Tag>}
//                 </Space>
//               }
//               description={
//                 <div style={{ marginTop: 2 }}>
//                   <MailOutlined style={{ color: '#1890ff', fontSize: 11, marginRight: 4 }} />
//                   <Text type="secondary" style={{ fontSize: 12 }}>{c.email || '—'}</Text>
//                 </div>
//               }
//             />
//           </List.Item>
//         )}
//       />
//     </div>
//   );
// };

// export default ListCusGetQuote;

// auto cap nhat sau khi add quote thanh cong

// ListCusGetQuote.js
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { List, Avatar, Typography, Spin, Empty, Tag, Space } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
import ManageQuoteService from '../../../services/ManageQuotes/ManageQuoteService';

const { Title, Text } = Typography;

const ListCusGetQuote = forwardRef((props, ref) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState(null);

  // === LẤY STORE ID ===
  useEffect(() => {
    try {
      const { storeId } = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
      setStoreId(storeId ? Number(storeId) : null);
    } catch {
      toast.error('Invalid dealer information.');
      setLoading(false);
    }
  }, []);

  // === HÀM LOAD DATA (CÓ THỂ GỌI LẠI) ===
  const loadData = async () => {
    if (!storeId) return;

    setLoading(true);
    try {
      const customerData = await ManageCustomersService.getCustomerByStoreId(storeId);
      const quoteRequestCustomers = customerData
        .filter(c => c.description === 'Get Quote')
        .map(c => ({ ...c, id: c.customerId }));

      const allQuotes = await ManageQuoteService.getAllQuotations();
      const acceptedCustomerIds = new Set(
        allQuotes.filter(q => q.status === 'Accepted').map(q => q.customerId)
      );

      const filtered = quoteRequestCustomers.filter(c => !acceptedCustomerIds.has(c.customerId));
      setCustomers(filtered);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Cannot load customer quote requests');
    } finally {
      setLoading(false);
    }
  };

  // === GỌI LẦN ĐẦU ===
  useEffect(() => {
    loadData();
  }, [storeId]);

  // === CHO PHÉP GỌI LẠI TỪ BÊN NGOÀI ===
  useImperativeHandle(ref, () => ({
    reload: loadData,
  }));

  // === UI ===
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <Spin />
        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
          Loading...
        </Text>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="There are no pending quote requests."
        style={{ margin: '24px 0' }}
      />
    );
  }

  return (
    <div style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)', borderRadius: 8 }}>
      <Title level={3} style={{ margin: 0, padding: '12px 16px', textAlign: 'center', background: '#f5f5f5', borderRadius: '8px 8px 0 0' }}>
        Request Quote
      </Title>

      <List
        dataSource={customers}
        renderItem={(c) => (
          <List.Item
            key={c.id}
            style={{
              background: '#fff',
              borderRadius: 8,
              padding: '10px 12px',
              margin: '0 8px 8px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
            }}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                />
              }
              title={
                <Space size={4}>
                  <Text strong style={{ fontSize: 15 }}>{c.fullName}</Text>
                  {c.status === 'Pending' && <Tag color="gold" style={{ margin: 0, fontSize: 10 }}>Pending</Tag>}
                </Space>
              }
              description={
                <div style={{ marginTop: 2 }}>
                  <MailOutlined style={{ color: '#1890ff', fontSize: 11, marginRight: 4 }} />
                  <Text type="secondary" style={{ fontSize: 12 }}>{c.email || '—'}</Text>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
});

export default ListCusGetQuote;