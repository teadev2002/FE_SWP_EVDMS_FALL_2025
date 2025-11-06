// import React, { useState, useEffect } from 'react';
// import {
//   Table,
//   Typography,
//   Form,
//   Button,
//   Input,
//   InputNumber,
//   Select,
//   Modal,
//   Row,
//   Col,
//   Tag,
//   Card,
//   Descriptions,
//   Empty,
// } from 'antd';
// import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
// import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
// import ManageDealerService from '../../../services/ManageDealer/ManageDealerService';
// import ViewOrder from './ViewOrder'; // Component chi tiết
// import { toast } from 'react-toastify';

// const { Title } = Typography;
// const { Option } = Select;

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isDetailVisible, setIsDetailVisible] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [customers, setCustomers] = useState([]);
//   const [dealers, setDealers] = useState([]);
//   const [searchCustomer, setSearchCustomer] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [form] = Form.useForm();

//   // Lấy storeId từ localStorage
//   const getDealerStoreId = () => {
//     try {
//       const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
//       return dealerInfo.storeId ? Number(dealerInfo.storeId) : null;
//     } catch {
//       return null;
//     }
//   };

//   // === TẢI DỮ LIỆU ===
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       const dealerStoreId = getDealerStoreId();

//       if (!dealerStoreId) {
//         toast.error('Không tìm thấy thông tin cửa hàng. Vui lòng đăng nhập lại.');
//         setLoading(false);
//         return;
//       }

//       try {
//         // 1. LẤY TẤT CẢ ORDERS
//         const orderData = await ManageOrdersService.getAllOrder();

//         // 2. LỌC THEO dealer.storeId
//         const filteredByStore = orderData.filter(order => {
//           const storeIdInOrder = order.dealer?.storeId;
//           return storeIdInOrder != null && Number(storeIdInOrder) === dealerStoreId;
//         });

//         // 3. FORMAT DỮ LIỆU CHO BẢNG
//         const formattedData = filteredByStore.map(item => ({
//           key: item.orderId,
//           orderId: item.orderId,
//           customerName: item.customer?.fullName || 'Unknown',
//           dealerName: item.dealer?.fullName || 'Unknown',
//           orderDate: item.orderDate || 'N/A',
//           quantity: item.quantity ?? 1,
//           totalAmount: item.totalPrice ? Number(item.totalPrice).toLocaleString('vi-VN') : 'N/A',
//           status: item.status || 'N/A',
//           note: item.note || 'None',
//         }));

//         setOrders(formattedData);
//         setFilteredOrders(formattedData);

//         // 4. TẢI KHÁCH HÀNG THEO STORE
//         try {
//           const customerData = await ManageCustomersService.getCustomerByStoreId(dealerStoreId);
//           setCustomers(customerData || []);
//         } catch (error) {
//           console.error('Lỗi tải khách hàng:', error);
//           setCustomers([]);
//         }

//         // 5. TẢI NHÂN VIÊN THEO STORE
//         try {
//           const allDealerData = await ManageDealerService.getAllDealers();
//           const filteredDealers = allDealerData.filter(d => Number(d.storeId) === dealerStoreId);
//           setDealers(filteredDealers);
//         } catch (error) {
//           console.error('Lỗi tải nhân viên:', error);
//           setDealers([]);
//         }

//       } catch (error) {
//         toast.error('Lỗi khi tải dữ liệu đơn hàng');
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // === TÌM KIẾM THEO TÊN KHÁCH HÀNG ===
//   useEffect(() => {
//     const filtered = orders.filter(order =>
//       order.customerName.toLowerCase().includes(searchCustomer.toLowerCase())
//     );
//     setFilteredOrders(filtered);
//     setCurrentPage(1);
//   }, [searchCustomer, orders]);

//   // === MỞ MODAL THÊM ĐƠN HÀNG ===
//   const showModal = () => {
//     setIsModalVisible(true);
//     form.resetFields();
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     form.resetFields();
//   };

//   // === XEM CHI TIẾT ĐƠN HÀNG ===
//   const handleViewDetail = async (orderId) => {
//     try {
//       setLoading(true);
//       const detail = await ManageOrdersService.getOrderById(orderId);
//       setSelectedOrder(detail);
//       setIsDetailVisible(true);
//     } catch (error) {
//       toast.error('Không thể tải chi tiết đơn hàng');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const closeDetail = () => {
//     setIsDetailVisible(false);
//     setSelectedOrder(null);
//   };

//   // === THÊM ĐƠN HÀNG ===
//   const handleAddOrder = async (values) => {
//     setLoading(true);
//     try {
//       const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
//       const newOrder = {
//         customerId: values.customerId,
//         dealerId: values.dealerId,
//         quantity: values.quantity,
//         totalPrice: values.totalPrice,
//         status: values.status,
//         note: values.note,
//         storeId: dealerInfo.storeId,
//       };

//       await ManageOrdersService.addOrder(newOrder);
//       toast.success('Thêm đơn hàng thành công!');

//       // REFRESH
//       const orderData = await ManageOrdersService.getAllOrder();
//       const filteredByStore = orderData.filter(order =>
//         order.dealer?.storeId != null && Number(order.dealer.storeId) === Number(dealerInfo.storeId)
//       );

//       const formattedData = filteredByStore.map(item => ({
//         key: item.orderId,
//         orderId: item.orderId,
//         customerName: item.customer?.fullName || 'Unknown',
//         dealerName: item.dealer?.fullName || 'Unknown',
//         orderDate: item.orderDate || 'N/A',
//         quantity: item.quantity ?? 1,
//         totalAmount: item.totalPrice ? Number(item.totalPrice).toLocaleString('vi-VN') : 'N/A',
//         status: item.status || 'N/A',
//         note: item.note || 'None',
//       }));

//       setOrders(formattedData);
//       setFilteredOrders(formattedData);
//       setIsModalVisible(false);
//       form.resetFields();

//     } catch (error) {
//       toast.error('Thêm đơn hàng thất bại');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // === CỘT BẢNG ===
//   const columns = [
//     {
//       title: 'Order ID',
//       dataIndex: 'orderId',
//       key: 'orderId',
//       render: (id) => (
//         <a onClick={() => handleViewDetail(id)} style={{ color: '#1890ff', fontWeight: 500 }}>
//           #{id}
//         </a>
//       ),
//       sorter: (a, b) => a.orderId - b.orderId,
//     },
//     {
//       title: 'Khách hàng',
//       dataIndex: 'customerName',
//       key: 'customerName',
//       sorter: (a, b) => a.customerName.localeCompare(b.customerName),
//     },
//     {
//       title: 'Nhân viên',
//       dataIndex: 'dealerName',
//       key: 'dealerName',
//       sorter: (a, b) => a.dealerName.localeCompare(b.dealerName),
//     },
//     {
//       title: 'Ngày đặt',
//       dataIndex: 'orderDate',
//       key: 'orderDate',
//       sorter: (a, b) => {
//         const parse = d => {
//           if (!d || d === 'N/A') return 0;
//           const [day, month, year] = d.split('/').map(Number);
//           return new Date(year, month - 1, day).getTime();
//         };
//         return parse(a.orderDate) - parse(b.orderDate);
//       },
//     },
//     {
//       title: 'Số lượng',
//       dataIndex: 'quantity',
//       key: 'quantity',
//       sorter: (a, b) => a.quantity - b.quantity,
//     },
//     {
//       title: 'Tổng tiền',
//       dataIndex: 'totalAmount',
//       key: 'totalAmount',
//       sorter: (a, b) => {
//         const parse = v => v === 'N/A' ? 0 : Number(v.replace(/,/g, ''));
//         return parse(a.totalAmount) - parse(b.totalAmount);
//       },
//     },
//     {
//       title: 'Trạng thái',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status) => (
//         <Tag color={
//           status === 'Completed' ? 'green' :
//           status === 'Pending' ? 'orange' :
//           status === 'Cancelled' ? 'red' : 'blue'
//         }>
//           {status}
//         </Tag>
//       ),
//       sorter: (a, b) => a.status.localeCompare(b.status),
//     },
//     {
//       title: 'Ghi chú',
//       dataIndex: 'note',
//       key: 'note',
//       ellipsis: true,
//       sorter: (a, b) => a.note.localeCompare(b.note),
//     },
//   ];

//   const totalOrders = filteredOrders.length;

//   return (
//     <div>
//       <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
//         Quản lý đơn hàng
//       </Title>

//       {/* TÌM KIẾM + NÚT THÊM */}
//       <Row gutter={16} style={{ marginBottom: 16 }}>
//         <Col span={20}>
//           <Input
//             placeholder="Tìm theo tên khách hàng"
//             value={searchCustomer}
//             onChange={(e) => setSearchCustomer(e.target.value)}
//             allowClear
//           />
//         </Col>
//         <Col span={4}>
//           <Button type="primary" onClick={showModal} style={{ width: '100%' }}>
//             Thêm đơn hàng
//           </Button>
//         </Col>
//       </Row>

//       {/* THÔNG TIN PHÂN TRANG */}


//       {/* BẢNG ĐƠN HÀNG */}
//       <Table
//         columns={columns}
//         dataSource={filteredOrders}
//         loading={loading}
//         rowKey="key"
//         onRow={(record) => ({
//           onClick: () => handleViewDetail(record.orderId),
//           style: { cursor: 'pointer' },
//         })}
//         pagination={{
//           pageSize,
//           current: currentPage,
//           total: totalOrders,
//           onChange: (page) => setCurrentPage(page),
//           showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} của ${total} đơn hàng`,
//         }}
//         bordered
//       />

//       {/* MODAL THÊM ĐƠN HÀNG */}
//       <Modal
//         title="Thêm đơn hàng mới"
//         open={isModalVisible}
//         onCancel={handleCancel}
//         footer={null}
//         width={600}
//       >
//         <Form form={form} layout="vertical" onFinish={handleAddOrder}>
//           <Form.Item label="Khách hàng" name="customerId" rules={[{ required: true, message: 'Vui lòng chọn khách hàng!' }]}>
//             <Select showSearch placeholder="Chọn khách hàng" loading={loading}>
//               {customers.map(c => (
//                 <Option key={c.customerId} value={c.customerId}>{c.fullName}</Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item label="Nhân viên" name="dealerId" rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}>
//             <Select showSearch placeholder="Chọn nhân viên" loading={loading}>
//               {dealers.map(d => (
//                 <Option key={d.dealerId} value={d.dealerId}>{d.fullName}</Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item label="Số lượng" name="quantity" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
//             <InputNumber min={1} style={{ width: '100%' }} />
//           </Form.Item>

//           <Form.Item label="Tổng tiền" name="totalPrice" rules={[{ required: true, message: 'Vui lòng nhập tổng tiền!' }]}>
//             <InputNumber min={0} style={{ width: '100%' }} />
//           </Form.Item>

//           <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
//             <Select>
//               <Option value="Pending">Pending</Option>
//               <Option value="Processing">Processing</Option>
//               <Option value="Completed">Completed</Option>
//               <Option value="Cancelled">Cancelled</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item label="Ghi chú" name="note">
//             <Input.TextArea rows={3} placeholder="Nhập ghi chú (tùy chọn)" />
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
//               Thêm đơn hàng
//             </Button>
//             <Button onClick={handleCancel}>Hủy</Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* MODAL CHI TIẾT ĐƠN HÀNG */}
//       <Modal
//         title="Chi tiết đơn hàng"
//         open={isDetailVisible}
//         onCancel={closeDetail}
//         footer={null}
//         width={900}
//         destroyOnClose
//       >
//         <ViewOrder order={selectedOrder} onClose={closeDetail} />
//       </Modal>
//     </div>
//   );
// };

// export default Orders;

//----------------------------------------------------------------------------------//

import React, { useState, useEffect } from 'react';
import {
  Table,
  Typography,
  Form,
  Button,
  Input,
  InputNumber,
  Select,
  Modal,
  Row,
  Col,
  Tag,
  Card,
  Descriptions,
  Empty,
} from 'antd';
import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
import ManageDealerService from '../../../services/ManageDealer/ManageDealerService';
import ViewOrder from './ViewOrder'; // Detail component
import { toast } from 'react-toastify';

const { Title } = Typography;
const { Option } = Select;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [form] = Form.useForm();

  // Get storeId from localStorage
  const getDealerStoreId = () => {
    try {
      const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
      return dealerInfo.storeId ? Number(dealerInfo.storeId) : null;
    } catch {
      return null;
    }
  };

  // === LOAD DATA ===
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const dealerStoreId = getDealerStoreId();

      if (!dealerStoreId) {
        toast.error('Store information not found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        // 1. GET ALL ORDERS
        const orderData = await ManageOrdersService.getAllOrder();

        // 2. FILTER BY dealer.storeId
        const filteredByStore = orderData.filter(order => {
          const storeIdInOrder = order.dealer?.storeId;
          return storeIdInOrder != null && Number(storeIdInOrder) === dealerStoreId;
        });

        // 3. FORMAT DATA FOR TABLE
        const formattedData = filteredByStore.map(item => ({
          key: item.orderId,
          orderId: item.orderId,
          customerName: item.customer?.fullName || 'Unknown',
          dealerName: item.dealer?.fullName || 'Unknown',
          orderDate: item.orderDate || 'N/A',
          quantity: item.quantity ?? 1,
          totalAmount: item.totalPrice ? Number(item.totalPrice).toLocaleString('vi-VN') : 'N/A',
          status: item.status || 'N/A',
          note: item.note || 'None',
        }));

        setOrders(formattedData);
        setFilteredOrders(formattedData);

        // 4. LOAD CUSTOMERS BY STORE
        try {
          const customerData = await ManageCustomersService.getCustomerByStoreId(dealerStoreId);
          setCustomers(customerData || []);
        } catch (error) {
          console.error('Error loading customers:', error);
          setCustomers([]);
        }

        // 5. LOAD EMPLOYEES BY STORE
        try {
          const allDealerData = await ManageDealerService.getAllDealers();
          const filteredDealers = allDealerData.filter(d => Number(d.storeId) === dealerStoreId);
          setDealers(filteredDealers);
        } catch (error) {
          console.error('Error loading employees:', error);
          setDealers([]);
        }

      } catch (error) {
        toast.error('Error loading order data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // === SEARCH BY CUSTOMER NAME ===
  useEffect(() => {
    const filtered = orders.filter(order =>
      order.customerName.toLowerCase().includes(searchCustomer.toLowerCase())
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchCustomer, orders]);

  // === OPEN ADD ORDER MODAL ===
  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // === VIEW ORDER DETAIL ===
  const handleViewDetail = async (orderId) => {
    try {
      setLoading(true);
      const detail = await ManageOrdersService.getOrderById(orderId);
      setSelectedOrder(detail);
      setIsDetailVisible(true);
    } catch (error) {
      toast.error('Unable to load order details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const closeDetail = () => {
    setIsDetailVisible(false);
    setSelectedOrder(null);
  };

  // === ADD ORDER ===
  const handleAddOrder = async (values) => {
    setLoading(true);
    try {
      const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
      const newOrder = {
        customerId: values.customerId,
        dealerId: values.dealerId,
        quantity: values.quantity,
        totalPrice: values.totalPrice,
        status: values.status,
        note: values.note,
        storeId: dealerInfo.storeId,
      };

      await ManageOrdersService.addOrder(newOrder);
      toast.success('Order added successfully!');

      // REFRESH
      const orderData = await ManageOrdersService.getAllOrder();
      const filteredByStore = orderData.filter(order =>
        order.dealer?.storeId != null && Number(order.dealer.storeId) === Number(dealerInfo.storeId)
      );

      const formattedData = filteredByStore.map(item => ({
        key: item.orderId,
        orderId: item.orderId,
        customerName: item.customer?.fullName || 'Unknown',
        dealerName: item.dealer?.fullName || 'Unknown',
        orderDate: item.orderDate || 'N/A',
        quantity: item.quantity ?? 1,
        totalAmount: item.totalPrice ? Number(item.totalPrice).toLocaleString('vi-VN') : 'N/A',
        status: item.status || 'N/A',
        note: item.note || 'None',
      }));

      setOrders(formattedData);
      setFilteredOrders(formattedData);
      setIsModalVisible(false);
      form.resetFields();

    } catch (error) {
      toast.error('Failed to add order');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // === TABLE COLUMNS ===
  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (id) => (
        <a onClick={() => handleViewDetail(id)} style={{ color: '#1890ff', fontWeight: 500 }}>
          #{id}
        </a>
      ),
      sorter: (a, b) => a.orderId - b.orderId,
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'Employee',
      dataIndex: 'dealerName',
      key: 'dealerName',
      sorter: (a, b) => a.dealerName.localeCompare(b.dealerName),
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      sorter: (a, b) => {
        const parse = d => {
          if (!d || d === 'N/A') return 0;
          const [day, month, year] = d.split('/').map(Number);
          return new Date(year, month - 1, day).getTime();
        };
        return parse(a.orderDate) - parse(b.orderDate);
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      sorter: (a, b) => {
        const parse = v => v === 'N/A' ? 0 : Number(v.replace(/,/g, ''));
        return parse(a.totalAmount) - parse(b.totalAmount);
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'Completed' ? 'green' :
            status === 'Pending' ? 'orange' :
              status === 'Cancelled' ? 'red' : 'blue'
        }>
          {status}
        </Tag>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
      sorter: (a, b) => a.note.localeCompare(b.note),
    },
  ];

  const totalOrders = filteredOrders.length;

  return (
    <div>
      <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
        Order Management
      </Title>

      {/* SEARCH + ADD BUTTON */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={20}>
          <Input
            placeholder="Search by customer name"
            value={searchCustomer}
            onChange={(e) => setSearchCustomer(e.target.value)}
            allowClear
          />
        </Col>
        <Col span={4}>
          <Button type="primary" onClick={showModal} style={{ width: '100%' }}>
            Add Order
          </Button>
        </Col>
      </Row>

      {/* ORDER TABLE */}
      <Table
        columns={columns}
        dataSource={filteredOrders}
        loading={loading}
        rowKey="key"
        onRow={(record) => ({
          onClick: () => handleViewDetail(record.orderId),
          style: { cursor: 'pointer' },
        })}
        pagination={{
          pageSize,
          current: currentPage,
          total: totalOrders,
          onChange: (page) => setCurrentPage(page),
          showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} orders`,
        }}
        bordered
      />

      {/* ADD ORDER MODAL */}
      <Modal
        title="Add New Order"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrder}>
          <Form.Item label="Customer" name="customerId" rules={[{ required: true, message: 'Please select a customer!' }]}>
            <Select showSearch placeholder="Select customer" loading={loading}>
              {customers.map(c => (
                <Option key={c.customerId} value={c.customerId}>{c.fullName}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Employee" name="dealerId" rules={[{ required: true, message: 'Please select an employee!' }]}>
            <Select showSearch placeholder="Select employee" loading={loading}>
              {dealers.map(d => (
                <Option key={d.dealerId} value={d.dealerId}>{d.fullName}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Quantity" name="quantity" rules={[{ required: true, message: 'Please enter quantity!' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Total Amount" name="totalPrice" rules={[{ required: true, message: 'Please enter total amount!' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select status!' }]}>
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Processing">Processing</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Note" name="note">
            <Input.TextArea rows={3} placeholder="Enter note (optional)" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
              Add Order
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* ORDER DETAIL MODAL */}
      <Modal
        title="Order Details"
        open={isDetailVisible}
        onCancel={closeDetail}
        footer={null}
        width={900}
        destroyOnClose
      >
        <ViewOrder order={selectedOrder} onClose={closeDetail} />
      </Modal>
    </div>
  );
};

export default Orders;