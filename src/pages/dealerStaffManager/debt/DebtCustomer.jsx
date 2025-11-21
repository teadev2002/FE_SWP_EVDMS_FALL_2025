// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   DollarOutlined,
//   UserOutlined,
//   PhoneOutlined,
//   MailOutlined,
//   CheckCircleOutlined,
//   ExclamationCircleOutlined,
//   SearchOutlined,
//   LoadingOutlined,
// } from '@ant-design/icons';
// import {
//   Card,
//   Col,
//   Row,
//   Input,
//   Select,
//   Table,
//   Tag,
//   Typography,
//   Space,
//   Avatar,
//   Statistic,
//   ConfigProvider,
//   Spin,
//   Alert,
//   Empty,
// } from 'antd';
// import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';

// const { Title, Text } = Typography;
// const { Option } = Select;

// const DebtCustomer = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all'); // all | hasDebt | cleared
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Get storeId from localStorage
//   const getDealerInfo = () => {
//     try {
//       const dealerInfo = localStorage.getItem('dealerInfo');
//       if (dealerInfo) {
//         return JSON.parse(dealerInfo);
//       }
//       return null;
//     } catch (err) {
//       console.error('Failed to parse dealerInfo from localStorage', err);
//       return null;
//     }
//   };

//   // Fetch orders by storeId on mount
//   useEffect(() => {
//     const fetchOrders = async () => {
//       const dealerInfo = getDealerInfo();
//       if (!dealerInfo || !dealerInfo.storeId) {
//         setError('Dealer information not found. Please login again.');
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
//         const response = await ManageOrdersService.getOrderByStoreId(dealerInfo.storeId);
        
//         // API may return { data: [...] } or direct array — normalize it
//         const orderList = Array.isArray(response) 
//           ? response 
//           : response?.data || response?.result || [];

//         setOrders(orderList);
//       } catch (err) {
//         console.error('Error fetching orders:', err);
//         setError('Failed to load orders. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   // Aggregate debt by customer
//   const customerDebts = useMemo(() => {
//     const map = {};

//     orders.forEach((order) => {
//       const cust = order.customer;
//       if (!cust) return;

//       const key = cust.customerId;
//       if (!map[key]) {
//         map[key] = {
//           customerId: cust.customerId,
//           fullName: cust.fullName || 'Unknown Customer',
//           email: cust.email || '-',
//           phone: cust.phone || '-',
//           totalOrders: 0,
//           pendingOrders: 0,
//           pendingAmount: 0,
//         };
//       }

//       map[key].totalOrders += 1;

//       const isPending = ['Pending', 'Processing', 'Confirmed', 'Delivering'].includes(order.status);
//       if (isPending) {
//         map[key].pendingOrders += 1;
//         map[key].pendingAmount += Number(order.totalPrice) || 0;
//       }
//     });

//     return Object.values(map).sort((a, b) => b.pendingAmount - a.pendingAmount);
//   }, [orders]);

//   // Filter customers
//   const filteredData = useMemo(() => {
//     return customerDebts.filter((cust) => {
//       const matchesSearch =
//         cust.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         cust.phone.includes(searchTerm) ||
//         cust.email.toLowerCase().includes(searchTerm);

//       const matchesFilter =
//         filterStatus === 'all' ||
//         (filterStatus === 'hasDebt' && cust.pendingAmount > 0) ||
//         (filterStatus === 'cleared' && cust.pendingAmount === 0);

//       return matchesSearch && matchesFilter;
//     });
//   }, [customerDebts, searchTerm, filterStatus]);

//   // Summary stats
//   const totalOutstanding = customerDebts.reduce((sum, c) => sum + c.pendingAmount, 0);
//   const customersWithDebt = customerDebts.filter((c) => c.pendingAmount > 0).length;
//   const customersCleared = customerDebts.filter((c) => c.pendingAmount === 0).length;

//   const columns = [
//     {
//       title: 'Customer',
//       key: 'customer',
//       render: (_, record) => (
//         <Space>
//           <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
//           <div>
//             <div style={{ fontWeight: 500 }}>{record.fullName}</div>
//             <Text type="secondary">ID: {record.customerId}</Text>
//           </div>
//         </Space>
//       ),
//     },
//     {
//       title: 'Contact',
//       key: 'contact',
//       render: (_, record) => (
//         <Space direction="vertical" size={2}>
//           <Space>
//             <PhoneOutlined style={{ color: '#8c8c8c' }} />
//             {record.phone}
//           </Space>
//           <Space>
//             <MailOutlined style={{ color: '#8c8c8c' }} />
//             <Text type="secondary">{record.email}</Text>
//           </Space>
//         </Space>
//       ),
//     },
//     {
//       title: 'Total Orders',
//       dataIndex: 'totalOrders',
//       align: 'center',
//       render: (value) => <Text strong>{value}</Text>,
//     },
//     {
//       title: 'Pending Orders',
//       dataIndex: 'pendingOrders',
//       align: 'center',
//       render: (value) =>
//         value > 0 ? (
//           <Tag color="orange">{value} order{value > 1 ? 's' : ''}</Tag>
//         ) : (
//           <Text type="secondary">—</Text>
//         ),
//     },
//     {
//       title: 'Outstanding (VNĐ)',
//       dataIndex: 'pendingAmount',
//       align: 'right',
//       render: (value) => (
//         <Text
//           strong
//           style={{
//             fontSize: '18px',
//             color: value > 0 ? '#cf1322' : '#389e0d',
//           }}
//         >
//           {value.toFixed(1)}
//         </Text>
//       ),
//       sorter: (a, b) => b.pendingAmount - a.pendingAmount,
//       defaultSortOrder: 'descend',
//     },
//     {
//       title: 'Status',
//       key: 'status',
//       align: 'center',
//       render: (_, record) =>
//         record.pendingAmount > 0 ? (
//           <Tag icon={<ExclamationCircleOutlined />} color="error">
//             Has Debt
//           </Tag>
//         ) : (
//           <Tag icon={<CheckCircleOutlined />} color="success">
//             Cleared
//           </Tag>
//         ),
//     },
//   ];

//   // Loading state
//   if (loading) {
//     return (
//       <ConfigProvider>
//         <div style={{  textAlign: 'center' }}>
//           <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
//           <div style={{ marginTop: 16 }}>
//             <Text>Loading customer debt data...</Text>
//           </div>
//         </div>
//       </ConfigProvider>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <ConfigProvider>
//         <div  >
//           <Alert message="Error" description={error} type="error" showIcon />
//         </div>
//       </ConfigProvider>
//     );
//   }

//   return (
//     <ConfigProvider>
//       <div style={{minHeight: '100vh' }}>
//         <div style={{ maxWidth: 1400, margin: '0 auto' }}>
//           {/* Header */}
//           <div  >
//             <Title level={2}>
//               <DollarOutlined style={{ marginRight: 12 }} />
//               Customer Debt Management
//             </Title>
//             <Text type="secondary">Monitor and manage all customer outstanding balances</Text>
//           </div>

//           {/* Summary Cards */}
//           <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
//             <Col xs={24} sm={12} lg={8}>
//               <Card>
//                 <Statistic
//                   title="Total Outstanding Debt"
//                   value={totalOutstanding}
//                   precision={1}
                 
//                   prefix={<DollarOutlined />}
//                   valueStyle={{ color: '#cf1322', fontWeight: 'bold' }}
//                 />
//               </Card>
//             </Col>
//             <Col xs={24} sm={12} lg={8}>
//               <Card>
//                 <Statistic
//                   title="Customers with Debt"
//                   value={customersWithDebt}
                 
//                   valueStyle={{ color: '#fa8c16' }}
//                 />
//               </Card>
//             </Col>
//             <Col xs={24} sm={12} lg={8}>
//               <Card>
//                 <Statistic
//                   title="Cleared Customers"
//                   value={customersCleared}
//                   prefix={<CheckCircleOutlined />}
//                   valueStyle={{ color: '#52c41a' }}
//                 />
//               </Card>
//             </Col>
//           </Row>

//           {/* Search & Filter */}
//           <Card style={{ marginBottom: 24 }}>
//             <Row gutter={16}>
//               <Col xs={24} md={16}>
//                 <Input
//                   placeholder="Search by name, phone or email..."
//                   prefix={<SearchOutlined />}
//                   size="large"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   allowClear
//                 />
//               </Col>
//               <Col xs={24} md={8}>
//                 <Select
//                   size="large"
//                   style={{ width: '100%' }}
//                   value={filterStatus}
//                   onChange={setFilterStatus}
//                 >
//                   <Option value="all">All Customers</Option>
//                   <Option value="hasDebt">Has Outstanding Debt</Option>
//                   <Option value="cleared">Cleared Debt</Option>
//                 </Select>
//               </Col>
//             </Row>
//           </Card>

//           {/* Table */}
//           <Card>
//             {filteredData.length === 0 ? (
//               <Empty description="No customers found matching your criteria" />
//             ) : (
//               <Table
//                 columns={columns}
//                 dataSource={filteredData}
//                 rowKey="customerId"
//                 pagination={{
//                   pageSize: 10,
//                   showSizeChanger: true,
//                   showQuickJumper: true,
//                   showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} customers`,
//                 }}
//               />
//             )}
//           </Card>
//         </div>
//       </div>
//     </ConfigProvider>
//   );
// };

// export default DebtCustomer;

import React, { useState, useEffect, useMemo } from 'react';
import {
  DollarOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import {
  Card,
  Col,
  Row,
  Input,
  Select,
  Table,
  Tag,
  Typography,
  Space,
  Avatar,
  Statistic,
  ConfigProvider,
  Spin,
  Alert,
  Empty,
} from 'antd';
import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';

const { Title, Text } = Typography;
const { Option } = Select;

const DebtCustomer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get storeId from localStorage
  const dealerInfo = useMemo(() => {
    try {
      const info = localStorage.getItem('dealerInfo');
      return info ? JSON.parse(info) : null;
    } catch {
      return null;
    }
  }, []);

  // Fetch orders
  useEffect(() => {
    if (!dealerInfo?.storeId) {
      setError('Dealer information not found. Please login again.');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const res = await ManageOrdersService.getOrderByStoreId(dealerInfo.storeId);
        const list = Array.isArray(res) ? res : res?.data || res?.result || [];
        setOrders(list);
      } catch (err) {
        setError('Failed to load orders.', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [dealerInfo]);

  // Aggregate debt by customer
  const customerDebts = useMemo(() => {
    const map = {};
    orders.forEach((order) => {
      const c = order.customer;
      if (!c) return;
      const key = c.customerId;

      if (!map[key]) {
        map[key] = {
          customerId: c.customerId,
          fullName: c.fullName || 'Unknown',
          email: c.email || '-',
          phone: c.phone || '-',
          totalOrders: 0,
          pendingOrders: 0,
          pendingAmount: 0,
        };
      }

      map[key].totalOrders += 1;
      if (['Pending', 'Processing', 'Confirmed', 'Delivering'].includes(order.status)) {
        map[key].pendingOrders += 1;
        map[key].pendingAmount += Number(order.totalPrice) || 0;
      }
    });
    return Object.values(map).sort((a, b) => b.pendingAmount - a.pendingAmount);
  }, [orders]);

  const filteredData = useMemo(() => {
    return customerDebts.filter((c) => {
      const matchSearch =
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm) ||
        c.email.toLowerCase().includes(searchTerm);

      const matchFilter =
        filterStatus === 'all' ||
        (filterStatus === 'hasDebt' && c.pendingAmount > 0) ||
        (filterStatus === 'cleared' && c.pendingAmount === 0);

      return matchSearch && matchFilter;
    });
  }, [customerDebts, searchTerm, filterStatus]);

  const totalOutstanding = customerDebts.reduce((s, c) => s + c.pendingAmount, 0);
  const withDebt = customerDebts.filter((c) => c.pendingAmount > 0).length;
  const cleared = customerDebts.filter((c) => c.pendingAmount === 0).length;

  const columns = [
    {
      title: 'Customer',
      render: (_, r) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{r.fullName}</div>
            <Text type="secondary">ID: {r.customerId}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Contact',
      render: (_, r) => (
        <Space direction="vertical" size={2}>
          <Space><PhoneOutlined style={{ color: '#8c8c8c' }} /> {r.phone}</Space>
          <Space><MailOutlined style={{ color: '#8c8c8c' }} /> <Text type="secondary">{r.email}</Text></Space>
        </Space>
      ),
    },
    { title: 'Total Orders', dataIndex: 'totalOrders', align: 'center', render: (v) => <Text strong>{v}</Text> },
    {
      title: 'Pending Orders',
      dataIndex: 'pendingOrders',
      align: 'center',
      render: (v) => (v ? <Tag color="orange">{v} order{v > 1 ? 's' : ''}</Tag> : '—'),
    },
    {
      title: 'Outstanding (Million)',
      dataIndex: 'pendingAmount',
      align: 'right',
      sorter: (a, b) => b.pendingAmount - a.pendingAmount,
      defaultSortOrder: 'descend',
      render: (v) => (
        <Text strong style={{ fontSize: 18, color: v > 0 ? '#cf1322' : '#389e0d' }}>
          {v.toFixed(1)}
        </Text>
      ),
    },
    {
      title: 'Status',
      align: 'center',
      render: (_, r) =>
        r.pendingAmount > 0 ? (
          <Tag icon={<ExclamationCircleOutlined />} color="error">Has Debt</Tag>
        ) : (
          <Tag icon={<CheckCircleOutlined />} color="success">Cleared</Tag>
        ),
    },
  ];

  // Loading
  if (loading) {
    return (
      <ConfigProvider>
        <div style={{ padding: '60px 0', textAlign: 'center' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <div style={{ marginTop: 16 }}>
            <Text>Loading customer debt data...</Text>
          </div>
        </div>
      </ConfigProvider>
    );
  }

  // Error
  if (error) {
    return (
      <ConfigProvider>
        <div style={{ padding: 24 }}>
          <Alert message="Error" description={error} type="error" showIcon />
        </div>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider>
      <div style={{ padding: '16px 24px', minHeight: '100vh', background: '#f0f2f5' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>

          {/* Header */}
          <Title level={2} style={{ margin: '0 0 24px' }}>
            <DollarOutlined style={{ marginRight: 12 }} />
            Customer Debt Management
          </Title>

          {/* Summary Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Total Outstanding Debt"
                  value={totalOutstanding}
                  precision={1}
                  suffix=" Million"
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#cf1322', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic title="Customers with Debt" value={withDebt}   valueStyle={{ color: '#fa8c16' }} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic title="Cleared Customers" value={cleared} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
              </Card>
            </Col>
          </Row>

          {/* Search & Filter */}
          <Card style={{ marginBottom: 24 }}>
            <Row gutter={16}>
              <Col xs={24} md={16}>
                <Input
                  placeholder="Search by name, phone or email..."
                  prefix={<SearchOutlined />}
                  size="large"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} md={8}>
                <Select size="large" style={{ width: '100%' }} value={filterStatus} onChange={setFilterStatus}>
                  <Option value="all">All Customers</Option>
                  <Option value="hasDebt">Has Outstanding Debt</Option>
                  <Option value="cleared">Cleared Debt</Option>
                </Select>
              </Col>
            </Row>
          </Card>

          {/* Table */}
          <Card>
            {filteredData.length === 0 ? (
              <Empty description="No customers found" />
            ) : (
              <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="customerId"
              pagination={{
              pageSize: 10,
              showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} Debt${total !== 1 ? 's' : ''}`,
        }}
              />
            )}
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default DebtCustomer;