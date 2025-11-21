// update add order

//  import React, { useState, useEffect } from 'react';
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
//   Spin,
//   message,
// } from 'antd';
// import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
// import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
// import ManageDealerService from '../../../services/ManageDealer/ManageDealerService';
// import ManageQuoteService from '../../../services/ManageQuotes/ManageQuoteService';
// import ViewOrder from './ViewOrder';
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

//   // Quote states
//   const [quotes, setQuotes] = useState([]);
//   const [quoteLoading, setQuoteLoading] = useState(false);
//   const [selectedQuote, setSelectedQuote] = useState(null);

//   // Get current storeId from logged-in dealer
//   const getDealerStoreId = () => {
//     try {
//       const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
//       return dealerInfo.storeId ? Number(dealerInfo.storeId) : null;
//     } catch {
//       return null;
//     }
//   };

//   // Load initial data (orders, customers, employees)
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       const dealerStoreId = getDealerStoreId();

//       if (!dealerStoreId) {
//         toast.error('Store information not found. Please log in again.');
//         setLoading(false);
//         return;
//       }

//       try {
//         // Load orders
//         const orderData = await ManageOrdersService.getAllOrder();
//         const filteredByStore = orderData.filter(order =>
//           order.dealer?.storeId != null && Number(order.dealer.storeId) === dealerStoreId
//         );

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

//         // Load customers
//         const customerData = await ManageCustomersService.getCustomerByStoreId(dealerStoreId);
//         setCustomers(customerData || []);

//         // Load employees (dealers) in the same store
//         const allDealerData = await ManageDealerService.getAllDealers();
//         const filteredDealers = allDealerData.filter(d => Number(d.storeId) === dealerStoreId);
//         setDealers(filteredDealers);

//       } catch (error) {
//         toast.error('Error loading data');
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Search filter
//   useEffect(() => {
//     const filtered = orders.filter(order =>
//       order.customerName.toLowerCase().includes(searchCustomer.toLowerCase())
//     );
//     setFilteredOrders(filtered);
//     setCurrentPage(1);
//   }, [searchCustomer, orders]);

//   // When customer is selected → fetch their accepted quotes
//   const handleCustomerChange = async (customerId) => {
//     if (!customerId) {
//       setQuotes([]);
//       setSelectedQuote(null);
//       form.setFieldsValue({
//         dealerId: undefined,
//         totalPrice: undefined,
//         quoteId: undefined,
//         status: 'Pending',
//       });
//       return;
//     }

//     setQuoteLoading(true);
//     try {
//       const quoteList = await ManageQuoteService.getListQuoteByCustomerId(customerId);
//       const acceptedQuotes = quoteList.filter(q => q.status === 'Accepted');

//       setQuotes(acceptedQuotes);

//       if (acceptedQuotes.length === 0) {
//         message.info('This customer has no accepted quotes.');
//         form.setFieldsValue({
//           dealerId: undefined,
//           totalPrice: undefined,
//           status: 'Pending',
//         });
//         setSelectedQuote(null);
//       } else if (acceptedQuotes.length === 1) {
//         const quote = acceptedQuotes[0];
//         setSelectedQuote(quote);
//         form.setFieldsValue({
//           dealerId: quote.dealerId,
//           totalPrice: quote.finalPrice,
//           status: 'Pending',
//           quoteId: quote.quoteId,
//         });
//       } else {
//         // Multiple quotes → let user choose
//         form.setFieldsValue({
//           dealerId: undefined,
//           totalPrice: undefined,
//           status: 'Pending',
//           quoteId: undefined,
//         });
//         setSelectedQuote(null);
//       }
//     } catch (error) {
//       toast.error('Failed to load customer quotes');
//       console.error(error);
//       setQuotes([]);
//       setSelectedQuote(null);
//     } finally {
//       setQuoteLoading(false);
//     }
//   };

//   // When user selects a quote from dropdown
//   const handleQuoteChange = (quoteId) => {
//     const quote = quotes.find(q => q.quoteId === quoteId);
//     if (quote) {
//       setSelectedQuote(quote);
//       form.setFieldsValue({
//         dealerId: quote.dealerId,
//         totalPrice: quote.finalPrice,
//       });
//     }
//   };

//   // Open modal
//   const showModal = () => {
//     setIsModalVisible(true);
//     form.resetFields();
//     setQuotes([]);
//     setSelectedQuote(null);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     form.resetFields();
//     setQuotes([]);
//     setSelectedQuote(null);
//   };

//   // View order detail
//   const handleViewDetail = async (orderId) => {
//     try {
//       setLoading(true);
//       const detail = await ManageOrdersService.getOrderById(orderId);
//       setSelectedOrder(detail);
//       setIsDetailVisible(true);
//     } catch (error) {
//       toast.error('Unable to load order details', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const closeDetail = () => {
//     setIsDetailVisible(false);
//     setSelectedOrder(null);
//   };

//   // Submit new order
//   const handleAddOrder = async (values) => {
//     setLoading(true);
//     try {
//       const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
//       const newOrder = {
//         customerId: values.customerId,
//         dealerId: values.dealerId,
//         quantity: 1, // Always 1
//         totalPrice: values.totalPrice,
//         status: 'Pending',
//         note: values.note || null,
//         storeId: dealerInfo.storeId,
//       };

//       await ManageOrdersService.addOrder(newOrder);
//       toast.success('Order added successfully!');

//       // Refresh order list
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
//       setQuotes([]);
//       setSelectedQuote(null);

//     } catch (error) {
//       toast.error('Failed to add order');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Table columns
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
//     { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
//     { title: 'Employee', dataIndex: 'dealerName', key: 'dealerName' },
//     { title: 'Order Date', dataIndex: 'orderDate', key: 'orderDate' },
//     { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
//     { title: 'Total Amount', dataIndex: 'totalAmount', key: 'totalAmount' },
//     {
//       title: 'Status',
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
//     },
//     { title: 'Note', dataIndex: 'note', key: 'note', ellipsis: true },
//   ];

//   return (
//     <div  >
     

//       <Row gutter={16} style={{ marginBottom: 16 }}>
//         <Col span={20}>
//           <Input
//             placeholder="Search by customer name"
//             value={searchCustomer}
//             onChange={(e) => setSearchCustomer(e.target.value)}
//             allowClear
//           />
//         </Col>
//         <Col span={4}>
//           <Button type="primary" onClick={showModal} style={{ width: '100%' }}>
//             Add Order
//           </Button>
//         </Col>
//       </Row>

//       <Table
//         columns={columns}
//         dataSource={filteredOrders}
//         loading={loading}
//         rowKey="key"
//         pagination={{
//           current: currentPage,
//           pageSize,
//           total: filteredOrders.length,
//           onChange: setCurrentPage,
//           showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} orders`,
//         }}
//         onRow={(record) => ({
//           onClick: () => handleViewDetail(record.orderId),
//           style: { cursor: 'pointer' },
//         })}
//         bordered
//       />

//       {/* Add Order Modal */}
//       <Modal
//         title="Add New Order"
//         open={isModalVisible}
//         onCancel={handleCancel}
//         footer={null}
//         width={720}
//         destroyOnClose
//       >
//         <Form form={form} layout="vertical" onFinish={handleAddOrder}>
//           {/* Customer */}
//           <Form.Item
//             label="Customer"
//             name="customerId"
//             rules={[{ required: true, message: 'Please select a customer!' }]}
//           >
//             <Select
//               showSearch
//               placeholder="Select a customer"
//               onChange={handleCustomerChange}
//               filterOption={(input, option) =>
//                 option.children.toLowerCase().includes(input.toLowerCase())
//               }
//             >
//               {customers.map(c => (
//                 <Option key={c.customerId} value={c.customerId}>
//                   {c.fullName}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           {/* Quote Selection (only if multiple) */}
//           {quotes.length > 1 && (
//             <Form.Item
//               label="Select Quote"
//               name="quoteId"
//               rules={[{ required: true, message: 'Please select a quote!' }]}
//             >
//               <Select
//                 placeholder="Choose a quote"
//                 onChange={handleQuoteChange}
//                 loading={quoteLoading}
//               >
//                 {quotes.map(q => (
//                   <Option key={q.quoteId} value={q.quoteId}>
//                     Quote Date: {q.quoteDate} • Final Price: {q.finalPrice.toLocaleString('vi-VN')} VND
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           )}

//           {quoteLoading && (
//             <div style={{ textAlign: 'center', padding: '16px 0' }}>
//               <Spin tip="Loading customer quotes..." />
//             </div>
//           )}

//           {/* Employee (auto-filled) */}
//           <Form.Item
//             label="Employee"
//             name="dealerId"
//             rules={[{ required: true, message: 'Employee is required!' }]}
//           >
//             <Select disabled={!!selectedQuote} placeholder="Auto-filled from quote">
//               {dealers.map(d => (
//                 <Option key={d.dealerId} value={d.dealerId}>{d.fullName}</Option>
//               ))}
//             </Select>
//           </Form.Item>

//           {/* Quantity - Fixed to 1 */}
//           <Form.Item label="Quantity" name="quantity" initialValue={1}>
//             <InputNumber min={1} value={1} readOnly style={{ width: '100%' }} />
//           </Form.Item>

//           {/* Total Amount (auto-filled) */}
//           <Form.Item
//             label="Total Amount (VND)"
//             name="totalPrice"
//             rules={[{ required: true, message: 'Total amount is required!' }]}
//           >
//             <InputNumber
//               style={{ width: '100%' }}
//               formatter={(value) => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
//               parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
//               disabled={!!selectedQuote}
//               min={0}
//             />
//           </Form.Item>

//           {/* Status */}
//           <Form.Item label="Status" name="status" initialValue="Pending">
//             <Select>
//               <Option value="Pending">Pending</Option>
//               <Option value="Processing">Processing</Option>
//               <Option value="Completed">Completed</Option>
//               <Option value="Cancelled">Cancelled</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item label="Note" name="note">
//             <Input.TextArea rows={3} placeholder="Optional note" />
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
//               Add Order
//             </Button>
//             <Button onClick={handleCancel}>Cancel</Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Order Detail Modal */}
//       <Modal
        
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

// thêm update order
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
  Spin,
  message,
  Popconfirm,
} from 'antd';
import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
import ManageDealerService from '../../../services/ManageDealer/ManageDealerService';
import ManageQuoteService from '../../../services/ManageQuotes/ManageQuoteService';
import ViewOrder from './ViewOrder';
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

  // Quote states
  const [quotes, setQuotes] = useState([]);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  // Get current storeId from logged-in dealer
  const getDealerStoreId = () => {
    try {
      const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
      return dealerInfo.storeId ? Number(dealerInfo.storeId) : null;
    } catch {
      return null;
    }
  };

  // Load initial data (orders, customers, employees)
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
        // Load orders
        const orderData = await ManageOrdersService.getAllOrder();
        const filteredByStore = orderData.filter(order =>
          order.dealer?.storeId != null && Number(order.dealer.storeId) === dealerStoreId
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

        // Load customers
        const customerData = await ManageCustomersService.getCustomerByStoreId(dealerStoreId);
        setCustomers(customerData || []);

        // Load employees (dealers) in the same store
        const allDealerData = await ManageDealerService.getAllDealers();
        const filteredDealers = allDealerData.filter(d => Number(d.storeId) === dealerStoreId);
        setDealers(filteredDealers);

      } catch (error) {
        toast.error('Error loading data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = orders.filter(order =>
      order.customerName.toLowerCase().includes(searchCustomer.toLowerCase())
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchCustomer, orders]);

  // When customer is selected → fetch their accepted quotes
  const handleCustomerChange = async (customerId) => {
    if (!customerId) {
      setQuotes([]);
      setSelectedQuote(null);
      form.setFieldsValue({
        dealerId: undefined,
        totalPrice: undefined,
        quoteId: undefined,
        status: 'Pending',
      });
      return;
    }

    setQuoteLoading(true);
    try {
      const quoteList = await ManageQuoteService.getListQuoteByCustomerId(customerId);
      const acceptedQuotes = quoteList.filter(q => q.status === 'Accepted');

      setQuotes(acceptedQuotes);

      if (acceptedQuotes.length === 0) {
        message.info('This customer has no accepted quotes.');
        form.setFieldsValue({
          dealerId: undefined,
          totalPrice: undefined,
          status: 'Pending',
        });
        setSelectedQuote(null);
      } else if (acceptedQuotes.length === 1) {
        const quote = acceptedQuotes[0];
        setSelectedQuote(quote);
        form.setFieldsValue({
          dealerId: quote.dealerId,
          totalPrice: quote.finalPrice,
          status: 'Pending',
          quoteId: quote.quoteId,
        });
      } else {
        // Multiple quotes → let user choose
        form.setFieldsValue({
          dealerId: undefined,
          totalPrice: undefined,
          status: 'Pending',
          quoteId: undefined,
        });
        setSelectedQuote(null);
      }
    } catch (error) {
      toast.error('Failed to load customer quotes');
      console.error(error);
      setQuotes([]);
      setSelectedQuote(null);
    } finally {
      setQuoteLoading(false);
    }
  };

  // When user selects a quote from dropdown
  const handleQuoteChange = (quoteId) => {
    const quote = quotes.find(q => q.quoteId === quoteId);
    if (quote) {
      setSelectedQuote(quote);
      form.setFieldsValue({
        dealerId: quote.dealerId,
        totalPrice: quote.finalPrice,
      });
    }
  };

  // Open modal
  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields();
    setQuotes([]);
    setSelectedQuote(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setQuotes([]);
    setSelectedQuote(null);
  };

  // View order detail
  const handleViewDetail = async (orderId) => {
    try {
      setLoading(true);
      const detail = await ManageOrdersService.getOrderById(orderId);
      setSelectedOrder(detail);
      setIsDetailVisible(true);
    } catch (error) {
      toast.error('Unable to load order details', error);
    } finally {
      setLoading(false);
    }
  };

  const closeDetail = () => {
    setIsDetailVisible(false);
    setSelectedOrder(null);
  };

  // Submit new order
  const handleAddOrder = async (values) => {
    setLoading(true);
    try {
      const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
      const newOrder = {
        customerId: values.customerId,
        dealerId: values.dealerId,
        quantity: 1, // Always 1
        totalPrice: values.totalPrice,
        status: 'Pending',
        note: values.note || null,
        storeId: dealerInfo.storeId,
      };

      await ManageOrdersService.addOrder(newOrder);
      toast.success('Order added successfully!');

      // Refresh order list
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
      setQuotes([]);
      setSelectedQuote(null);

    } catch (error) {
      toast.error('Failed to add order');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm đổi trạng thái đơn hàng sang Processing
const handleStartProcessing = async (orderId) => {
  setLoading(true);
  try {
    // Lấy thông tin đơn hàng mới nhất
    const latestOrder = await ManageOrdersService.getOrderById(orderId);

    // Payload update - giữ nguyên tất cả, chỉ đổi status
    const updatePayload = {
      ...latestOrder,
      status: 'Processing',
      // Các field bắt buộc nếu backend yêu cầu
      customerId: latestOrder.customerId,
      dealerId: latestOrder.dealerId,
      totalPrice: latestOrder.totalPrice,
      quantity: latestOrder.quantity || 1,
      note: latestOrder.note || null,
    };

    await ManageOrdersService.updateOrder(orderId, updatePayload);

    toast.success(`Order #${orderId} are now Processing`);

    // Refresh lại danh sách
    const orderData = await ManageOrdersService.getAllOrder();
    const dealerStoreId = getDealerStoreId();
    const filteredByStore = orderData.filter(order =>
      order.dealer?.storeId != null && Number(order.dealer.storeId) === dealerStoreId
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

  } catch (error) {
    console.error('Failed to start processing:', error);
     
  } finally {
    setLoading(false);
  }
};

  // Table columns
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
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Employee', dataIndex: 'dealerName', key: 'dealerName' },
    { title: 'Order Date', dataIndex: 'orderDate', key: 'orderDate' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Total Amount', dataIndex: 'totalAmount', key: 'totalAmount' },
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
    },
    { title: 'Note', dataIndex: 'note', key: 'note', ellipsis: true },
    {
    title: 'Actions',
    key: 'actions',
    width: 140,
    render: (_, record) => (
      <div onClick={(e) => e.stopPropagation()}>
        {record.status === 'Pending' && (
          <Popconfirm
            title="Do you want to start processing this order?"
             
            onConfirm={() => handleStartProcessing(record.orderId)}
            okText="Yes"
            cancelText="Cancel"
            okButtonProps={{ type: 'primary' }}
          >
            <Button
              size="small"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                border: 'none',
                color: 'white',
                fontSize: '12px',
                borderRadius: '6px',
              }}
              disabled={record.status !== 'Pending'}
            >
              Start Processing
            </Button>
          </Popconfirm>
        )}

        {record.status === 'Processing' && (
          <Tag color="blue">Processing</Tag>
        )}
        {record.status === 'Completed' && (
          <Tag color="green">Completed</Tag>
        )}
        {record.status === 'Cancelled' && (
          <Tag color="red">Cancelled</Tag>
        )}
      </div>
    ),
  },

  ];

  return (
    <div  >
     

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

      <Table
        columns={columns}
        dataSource={filteredOrders}
        loading={loading}
        rowKey="key"
        pagination={{
          current: currentPage,
          pageSize,
          total: filteredOrders.length,
          onChange: setCurrentPage,
          showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} orders`,
        }}
        onRow={(record) => ({
          onClick: () => handleViewDetail(record.orderId),
          style: { cursor: 'pointer' },
        })}
        bordered
      />

      {/* Add Order Modal */}
      <Modal
        title="Add New Order"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={720}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrder}>
          {/* Customer */}
          <Form.Item
            label="Customer"
            name="customerId"
            rules={[{ required: true, message: 'Please select a customer!' }]}
          >
            <Select
              showSearch
              placeholder="Select a customer"
              onChange={handleCustomerChange}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {customers.map(c => (
                <Option key={c.customerId} value={c.customerId}>
                  {c.fullName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Quote Selection (only if multiple) */}
          {quotes.length > 1 && (
            <Form.Item
              label="Select Quote"
              name="quoteId"
              rules={[{ required: true, message: 'Please select a quote!' }]}
            >
              <Select
                placeholder="Choose a quote"
                onChange={handleQuoteChange}
                loading={quoteLoading}
              >
                {quotes.map(q => (
                  <Option key={q.quoteId} value={q.quoteId}>
                    Quote Date: {q.quoteDate} • Final Price: {q.finalPrice.toLocaleString('vi-VN')} VND
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {quoteLoading && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <Spin tip="Loading customer quotes..." />
            </div>
          )}

          {/* Employee (auto-filled) */}
          <Form.Item
            label="Employee"
            name="dealerId"
            rules={[{ required: true, message: 'Employee is required!' }]}
          >
            <Select disabled={!!selectedQuote} placeholder="Auto-filled from quote">
              {dealers.map(d => (
                <Option key={d.dealerId} value={d.dealerId}>{d.fullName}</Option>
              ))}
            </Select>
          </Form.Item>

          {/* Quantity - Fixed to 1 */}
          <Form.Item label="Quantity" name="quantity" initialValue={1}>
            <InputNumber min={1} value={1} readOnly style={{ width: '100%' }} />
          </Form.Item>

          {/* Total Amount (auto-filled) */}
          <Form.Item
            label="Total Amount (VND)"
            name="totalPrice"
            rules={[{ required: true, message: 'Total amount is required!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              disabled={!!selectedQuote}
              min={0}
            />
          </Form.Item>

          {/* Status */}
          <Form.Item label="Status" name="status" initialValue="Pending">
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Processing">Processing</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Note" name="note">
            <Input.TextArea rows={3} placeholder="Optional note" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
              Add Order
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Order Detail Modal */}
      <Modal
        
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