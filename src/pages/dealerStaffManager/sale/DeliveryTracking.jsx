// them button cap nhat don hang
// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   List,
//   Typography,
//   Tag,
//   Button,
//   Space,
//   Divider,
//   Row,
//   Col,
//   Timeline,
//   Modal,
//   Input,
//   Pagination,
//   Select,
//   Form,
// } from 'antd';
// import {
//   TruckOutlined,
//   CheckCircleOutlined,
//   ClockCircleOutlined,
//   EnvironmentOutlined,
//   CarOutlined,
//   SearchOutlined,
//   UpOutlined,
//   DownOutlined,
//   CloseCircleOutlined,
// } from '@ant-design/icons';
// import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
// import { toast } from 'react-toastify';

// const { Title, Text } = Typography;
// const { Option } = Select;

// const DeliveryTracking = () => {
//   const [processingOrders, setProcessingOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isAscending, setIsAscending] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
//   const [statusForm] = Form.useForm();

//   const PAGE_SIZE = 10;

//   // Lấy storeId từ localStorage
//   const getDealerStoreId = () => {
//     try {
//       const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
//       return dealerInfo.storeId ? Number(dealerInfo.storeId) : null;
//     } catch {
//       return null;
//     }
//   };

//   // === TẢI DANH SÁCH ORDER ===
//   const fetchOrders = async () => {
//     setLoading(true);
//     const dealerStoreId = getDealerStoreId();

//     if (!dealerStoreId) {
//       toast.error('Không tìm thấy thông tin cửa hàng. Vui lòng đăng nhập lại.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const orderData = await ManageOrdersService.getAllOrder();
//       const ordersInStore = orderData.filter(
//         (order) =>
//           order.dealer?.storeId != null &&
//           Number(order.dealer.storeId) === dealerStoreId &&
//           (order.status === 'Processing' || order.status === 'Completed' || order.status === 'Cancelled')
//       );

//       const formattedOrders = ordersInStore.map((order) => {
//         let vehicleModel = 'Chưa xác định';
//         if (order.quotes && order.quotes.length > 0) {
//           const quote = order.quotes[0];
//           vehicleModel = quote.vehicle?.modelName || 'Chưa xác định';
//         }

//         return {
//           key: order.orderId,
//           orderId: order.orderId,
//           customerId: order.customerId,
//           customerName: order.customer?.fullName || 'N/A',
//           vehicleModel,
//           totalPrice: Number(order.totalPrice) || 0,
//           orderDate: order.orderDate,
//           note: order.note || '',
//           storeName: order.store?.storeName || 'N/A',
//           status: order.status,
//         };
//       });

//       setProcessingOrders(formattedOrders);
//     } catch (error) {
//       console.error('Lỗi tải đơn hàng:', error);
//       toast.error('Không thể tải danh sách đơn hàng');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // === RESET PAGE ON FILTER/SORT CHANGE ===
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, isAscending]);

//   // === FILTER VÀ SORT ===
//   useEffect(() => {
//     let filtered = processingOrders;

//     // Filter theo search term
//     if (searchTerm.trim()) {
//       const lowerSearch = searchTerm.toLowerCase();
//       filtered = filtered.filter(
//         (order) =>
//           order.customerName.toLowerCase().includes(lowerSearch) ||
//           order.vehicleModel.toLowerCase().includes(lowerSearch)
//       );
//     }

//     // Sort theo tổng tiền tăng/giảm
//     filtered = filtered.sort((a, b) =>
//       isAscending ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice
//     );

//     setFilteredOrders(filtered);
//   }, [searchTerm, processingOrders, isAscending]);

//   const paginatedOrders = filteredOrders.slice(
//     (currentPage - 1) * PAGE_SIZE,
//     currentPage * PAGE_SIZE
//   );

//   // === XEM CHI TIẾT ĐƠN HÀNG ===
//   const handleViewDetails = (order) => {
//     setSelectedOrder(order);
//     setIsModalVisible(true);
//   };

//   const hideModal = () => {
//     setIsModalVisible(false);
//     setSelectedOrder(null);
//   };

//   // === MỞ MODAL CẬP NHẬT TRẠNG THÁI ===
//   const handleOpenStatusUpdate = (order) => {
//     setSelectedOrder(order);
//     statusForm.setFieldsValue({ status: undefined });
//     setIsStatusModalVisible(true);
//   };

//   const hideStatusModal = () => {
//     setIsStatusModalVisible(false);
//     setSelectedOrder(null);
//     statusForm.resetFields();
//   };

//   // === CẬP NHẬT TRẠNG THÁI ===
//   const handleUpdateStatus = async (values) => {
//     if (!selectedOrder || !values.status) return;

//     setLoading(true);
//     try {
//       const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
//       const dealerId = dealerInfo.dealerId;
//       if (!dealerId) {
//         throw new Error('Không tìm thấy dealerId');
//       }

//       // Lấy chi tiết order từ API
//       const orderDetails = await ManageOrdersService.getOrderById(selectedOrder.orderId);

//       // Xây dựng request body
//       const updateBody = {
//         ...orderDetails,
//         customerId: orderDetails.customerId || selectedOrder.customerId,
//         dealerId: dealerId,
//         orderDate: orderDetails.orderDate || new Date().toLocaleDateString('en-GB'),
//         totalPrice: orderDetails.totalPrice || selectedOrder.totalPrice,
//         status: values.status,
//         note: orderDetails.note || 'swagg 0944',
//       };

//       // Gọi API updateOrder
//       await ManageOrdersService.updateOrder(selectedOrder.orderId, updateBody);

//       toast.success(`Cập nhật trạng thái đơn hàng #${selectedOrder.orderId} thành ${values.status} thành công!`);
//       hideStatusModal();
//       // Refresh danh sách
//       await fetchOrders();
//     } catch (error) {
//       console.error('Lỗi cập nhật trạng thái:', error);
//       toast.error('Cập nhật trạng thái thất bại. Vui lòng thử lại.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
//         Theo dõi giao hàng
//       </Title>

//       <Card loading={loading}>
//         <Row gutter={16} style={{ marginBottom: 16 }}>
//           <Col span={20}>
//             <Input.Search
//               placeholder="Tìm theo tên khách hàng hoặc mẫu xe"
//               prefix={<SearchOutlined />}
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               allowClear
//             />
//           </Col>
//           <Col span={4}>
//             <Button
//               onClick={() => setIsAscending(!isAscending)}
//               icon={isAscending ? <DownOutlined /> : <UpOutlined />}
//               block
//             >
//               {isAscending ? 'Giảm dần' : 'Tăng dần'}
//             </Button>
//           </Col>
//         </Row>

//         <List
//           dataSource={paginatedOrders}
//           locale={{ emptyText: 'Không có đơn hàng nào phù hợp.' }}
//           renderItem={(item) => (
//             <List.Item
//               key={item.key}
//               actions={[
//                 <Button
//                   type="primary"
//                   icon={<EnvironmentOutlined />}
//                   onClick={() => handleViewDetails(item)}
//                 >
//                   Xem chi tiết
//                 </Button>,
//                 item.status === 'Processing' && (
//                   <Button
//                     type="default"
//                     onClick={() => handleOpenStatusUpdate(item)}
//                   >
//                     Cập nhật trạng thái đơn
//                   </Button>
//                 ),
//               ]}
//             >
//               <List.Item.Meta
//                 avatar={<CarOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
//                 title={
//                   <Space>
//                     <Text strong>Đơn hàng #{item.orderId}</Text>
//                     <Tag 
//                       color={item.status === 'Completed' ? 'success' : item.status === 'Cancelled' ? 'error' : 'processing'} 
//                       icon={
//                         item.status === 'Completed' ? <CheckCircleOutlined /> : 
//                         item.status === 'Cancelled' ? <CloseCircleOutlined /> : 
//                         <TruckOutlined />
//                       }
//                     >
//                       {item.status}
//                     </Tag>
//                   </Space>
//                 }
//                 description={
//                   <>
//                     <Text>
//                       <strong>Khách hàng:</strong> {item.customerName}
//                     </Text>
//                     <br />
//                     <Text>
//                       <strong>Mẫu xe:</strong> {item.vehicleModel}
//                     </Text>
//                     <br />
//                     <Text>
//                       <strong>Tổng tiền:</strong>{' '}
//                       <Text strong type="danger">
//                         {item.totalPrice.toLocaleString()} VND
//                       </Text>
//                     </Text>
//                     <br />
//                     <Text type="secondary">
//                       <ClockCircleOutlined /> {item.orderDate}
//                     </Text>
//                   </>
//                 }
//               />
//             </List.Item>
//           )}
//         />

//         {filteredOrders.length > 0 && (
//           <Row justify="end" style={{ marginTop: 16 }}>
//             <Col>
//               <Pagination
//                 current={currentPage}
//                 total={filteredOrders.length}
//                 pageSize={PAGE_SIZE}
//                 onChange={setCurrentPage}
//                 showSizeChanger={false}
//                 showQuickJumper={false}
//                 showTotal={(total, range) => `${range[0]} đến ${range[1]} của ${total} đơn hàng`}
//               />
//             </Col>
//           </Row>
//         )}
//       </Card>

//       {/* MODAL CHI TIẾT */}
//       <Modal
//         title={`Chi tiết đơn hàng #${selectedOrder?.orderId}`}
//         open={isModalVisible}
//         onCancel={hideModal}
//         footer={null}
//         width={700}
//       >
//         {selectedOrder && (
//           <>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <Text strong>Khách hàng:</Text>
//                 <Text> {selectedOrder.customerName}</Text>
//               </Col>
//               <Col span={12}>
//                 <Text strong>Mẫu xe:</Text>
//                 <Text> {selectedOrder.vehicleModel}</Text>
//               </Col>
//             </Row>
//             <Row gutter={16} style={{ marginTop: 8 }}>
//               <Col span={12}>
//                 <Text strong>Tổng tiền:</Text>
//                 <Text strong type="danger">
//                   {' '}
//                   {selectedOrder.totalPrice.toLocaleString()} VND
//                 </Text>
//               </Col>
//               <Col span={12}>
//                 <Text strong>Ngày đặt:</Text>
//                 <Text> {selectedOrder.orderDate}</Text>
//               </Col>
//             </Row>
//             <Row gutter={16} style={{ marginTop: 8 }}>
//               <Col span={24}>
//                 <Text strong>Ghi chú:</Text>
//                 <Text> {selectedOrder.note || 'Không có'}</Text>
//               </Col>
//             </Row>

//             <Divider>Tiến trình giao hàng (mẫu)</Divider>
//             <Timeline>
//               <Timeline.Item dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}>
//                 Đã xác nhận thanh toán
//               </Timeline.Item>
//               <Timeline.Item dot={<TruckOutlined style={{ color: '#1890ff' }} />}>
//                 Đang chuẩn bị giao hàng
//               </Timeline.Item>
//               <Timeline.Item dot={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}>
//                 Dự kiến giao: 05/11/2025
//               </Timeline.Item>
//             </Timeline>

//             <Divider />

//           </>
//         )}
//       </Modal>

//       {/* MODAL CẬP NHẬT TRẠNG THÁI */}
//       <Modal
//         title={`Cập nhật trạng thái đơn hàng #${selectedOrder?.orderId}`}
//         open={isStatusModalVisible}
//         onCancel={hideStatusModal}
//         footer={null}
//         width={500}
//       >
//         {selectedOrder && (
//           <Form form={statusForm} layout="vertical" onFinish={handleUpdateStatus}>
//             <Form.Item
//               name="status"
//               label="Trạng thái mới"
//               rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
//             >
//               <Select placeholder="Chọn trạng thái">
//                 <Option value="Completed">Completed</Option>
//                 <Option value="Cancelled">Cancelled</Option>
//               </Select>
//             </Form.Item>

//             <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
//               <Space>
//                 <Button type="primary" htmlType="submit" loading={loading}>
//                   Cập nhật
//                 </Button>
//                 <Button onClick={hideStatusModal}>Hủy</Button>
//               </Space>
//             </Form.Item>
//           </Form>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default DeliveryTracking;

//----------------------------------------------------------------------------------//

// // status tracking
// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   List,
//   Typography,
//   Tag,
//   Button,
//   Space,
//   Divider,
//   Row,
//   Col,
//   Timeline,
//   Modal,
//   Input,
//   Pagination,
//   Select,
//   Form,
// } from 'antd';
// import {
//   TruckOutlined,
//   CheckCircleOutlined,
//   ClockCircleOutlined,
//   EnvironmentOutlined,
//   CarOutlined,
//   SearchOutlined,
//   UpOutlined,
//   DownOutlined,
//   CloseCircleOutlined,
// } from '@ant-design/icons';
// import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
// import { toast } from 'react-toastify';

// const { Title, Text } = Typography;
// const { Option } = Select;

// const DeliveryTracking = () => {
//   const [processingOrders, setProcessingOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isAscending, setIsAscending] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
//   const [statusForm] = Form.useForm();

//   const PAGE_SIZE = 10;

//   // Lấy storeId từ localStorage
//   const getDealerStoreId = () => {
//     try {
//       const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
//       return dealerInfo.storeId ? Number(dealerInfo.storeId) : null;
//     } catch {
//       return null;
//     }
//   };

//   // Hàm thêm ngày vào ngày đặt hàng
//   const addDaysToDate = (dateStr, days) => {
//     const [day, month, year] = dateStr.split('/').map(Number);
//     const date = new Date(year, month - 1, day + days);
//     return date.toLocaleDateString('vi-VN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//     });
//   };

//   // === TẢI DANH SÁCH ORDER ===
//   const fetchOrders = async () => {
//     setLoading(true);
//     const dealerStoreId = getDealerStoreId();

//     if (!dealerStoreId) {
//       toast.error('Không tìm thấy thông tin cửa hàng. Vui lòng đăng nhập lại.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const orderData = await ManageOrdersService.getAllOrder();
//       const ordersInStore = orderData.filter(
//         (order) =>
//           order.dealer?.storeId != null &&
//           Number(order.dealer.storeId) === dealerStoreId &&
//           (order.status === 'Processing' || order.status === 'Completed' || order.status === 'Cancelled')
//       );

//       const formattedOrders = ordersInStore.map((order) => {
//         let vehicleModel = 'Chưa xác định';
//         if (order.quotes && order.quotes.length > 0) {
//           const quote = order.quotes[0];
//           vehicleModel = quote.vehicle?.modelName || 'Chưa xác định';
//         }

//         return {
//           key: order.orderId,
//           orderId: order.orderId,
//           customerId: order.customerId,
//           customerName: order.customer?.fullName || 'N/A',
//           vehicleModel,
//           totalPrice: Number(order.totalPrice) || 0,
//           orderDate: order.orderDate,
//           note: order.note || '',
//           storeName: order.store?.storeName || 'N/A',
//           status: order.status,
//         };
//       });

//       setProcessingOrders(formattedOrders);
//     } catch (error) {
//       console.error('Lỗi tải đơn hàng:', error);
//       toast.error('Không thể tải danh sách đơn hàng');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // === RESET PAGE ON FILTER/SORT CHANGE ===
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, isAscending]);

//   // === FILTER VÀ SORT ===
//   useEffect(() => {
//     let filtered = processingOrders;

//     // Filter theo search term
//     if (searchTerm.trim()) {
//       const lowerSearch = searchTerm.toLowerCase();
//       filtered = filtered.filter(
//         (order) =>
//           order.customerName.toLowerCase().includes(lowerSearch) ||
//           order.vehicleModel.toLowerCase().includes(lowerSearch)
//       );
//     }

//     // Sort theo tổng tiền tăng/giảm
//     filtered = filtered.sort((a, b) =>
//       isAscending ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice
//     );

//     setFilteredOrders(filtered);
//   }, [searchTerm, processingOrders, isAscending]);

//   const paginatedOrders = filteredOrders.slice(
//     (currentPage - 1) * PAGE_SIZE,
//     currentPage * PAGE_SIZE
//   );

//   // === XEM CHI TIẾT ĐƠN HÀNG ===
//   const handleViewDetails = async (order) => {
//     try {
//       const fullOrder = await ManageOrdersService.getOrderById(order.orderId);
//       setSelectedOrder(fullOrder);
//     } catch (error) {
//       console.error('Lỗi tải chi tiết đơn hàng:', error);
//       toast.error('Không thể tải chi tiết đơn hàng');
//       setSelectedOrder(order); // Fallback to list data
//     }
//     setIsModalVisible(true);
//   };

//   const hideModal = () => {
//     setIsModalVisible(false);
//     setSelectedOrder(null);
//   };

//   // === MỞ MODAL CẬP NHẬT TRẠNG THÁI ===
//   const handleOpenStatusUpdate = (order) => {
//     setSelectedOrder(order);
//     statusForm.setFieldsValue({ status: undefined });
//     setIsStatusModalVisible(true);
//   };

//   const hideStatusModal = () => {
//     setIsStatusModalVisible(false);
//     setSelectedOrder(null);
//     statusForm.resetFields();
//   };

//   // === CẬP NHẬT TRẠNG THÁI ===
//   const handleUpdateStatus = async (values) => {
//     if (!selectedOrder || !values.status) return;

//     setLoading(true);
//     try {
//       const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
//       const dealerId = dealerInfo.dealerId;
//       if (!dealerId) {
//         throw new Error('Không tìm thấy dealerId');
//       }

//       // Lấy chi tiết order từ API
//       const orderDetails = await ManageOrdersService.getOrderById(selectedOrder.orderId);

//       // Xây dựng request body
//       const updateBody = {
//         ...orderDetails,
//         customerId: orderDetails.customerId || selectedOrder.customerId,
//         dealerId: dealerId,
//         orderDate: orderDetails.orderDate || new Date().toLocaleDateString('en-GB'),
//         totalPrice: orderDetails.totalPrice || selectedOrder.totalPrice,
//         status: values.status,
//         note: orderDetails.note || 'swagg 0944',
//       };

//       // Gọi API updateOrder
//       await ManageOrdersService.updateOrder(selectedOrder.orderId, updateBody);

//       toast.success(`Cập nhật trạng thái đơn hàng #${selectedOrder.orderId} thành ${values.status} thành công!`);
//       hideStatusModal();
//       // Refresh danh sách
//       await fetchOrders();
//     } catch (error) {
//       console.error('Lỗi cập nhật trạng thái:', error);
//       toast.error('Cập nhật trạng thái thất bại. Vui lòng thử lại.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
//         Theo dõi giao hàng
//       </Title>

//       <Card loading={loading}>
//         <Row gutter={16} style={{ marginBottom: 16 }}>
//           <Col span={20}>
//             <Input.Search
//               placeholder="Tìm theo tên khách hàng hoặc mẫu xe"
//               prefix={<SearchOutlined />}
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               allowClear
//             />
//           </Col>
//           <Col span={4}>
//             <Button
//               onClick={() => setIsAscending(!isAscending)}
//               icon={isAscending ? <DownOutlined /> : <UpOutlined />}
//               block
//             >
//               {isAscending ? 'Giảm dần' : 'Tăng dần'}
//             </Button>
//           </Col>
//         </Row>

//         <List
//           dataSource={paginatedOrders}
//           locale={{ emptyText: 'Không có đơn hàng nào phù hợp.' }}
//           renderItem={(item) => (
//             <List.Item
//               key={item.key}
//               actions={[
//                 <Button
//                   type="primary"
//                   icon={<EnvironmentOutlined />}
//                   onClick={() => handleViewDetails(item)}
//                 >
//                   Xem chi tiết
//                 </Button>,
//                 item.status === 'Processing' && (
//                   <Button
//                     type="default"
//                     onClick={() => handleOpenStatusUpdate(item)}
//                   >
//                     Cập nhật trạng thái đơn
//                   </Button>
//                 ),
//               ]}
//             >
//               <List.Item.Meta
//                 avatar={<CarOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
//                 title={
//                   <Space>
//                     <Text strong>Đơn hàng #{item.orderId}</Text>
//                     <Tag 
//                       color={item.status === 'Completed' ? 'success' : item.status === 'Cancelled' ? 'error' : 'processing'} 
//                       icon={
//                         item.status === 'Completed' ? <CheckCircleOutlined /> : 
//                         item.status === 'Cancelled' ? <CloseCircleOutlined /> : 
//                         <TruckOutlined />
//                       }
//                     >
//                       {item.status}
//                     </Tag>
//                   </Space>
//                 }
//                 description={
//                   <>
//                     <Text>
//                       <strong>Khách hàng:</strong> {item.customerName}
//                     </Text>
//                     <br />
//                     <Text>
//                       <strong>Mẫu xe:</strong> {item.vehicleModel}
//                     </Text>
//                     <br />
//                     <Text>
//                       <strong>Tổng tiền:</strong>{' '}
//                       <Text strong type="danger">
//                         {item.totalPrice.toLocaleString()} VND
//                       </Text>
//                     </Text>
//                     <br />
//                     <Text type="secondary">
//                       <ClockCircleOutlined /> {item.orderDate}
//                     </Text>
//                   </>
//                 }
//               />
//             </List.Item>
//           )}
//         />

//         {filteredOrders.length > 0 && (
//           <Row justify="end" style={{ marginTop: 16 }}>
//             <Col>
//               <Pagination
//                 current={currentPage}
//                 total={filteredOrders.length}
//                 pageSize={PAGE_SIZE}
//                 onChange={setCurrentPage}
//                 showSizeChanger={false}
//                 showQuickJumper={false}
//                 showTotal={(total, range) => `${range[0]} đến ${range[1]} của ${total} đơn hàng`}
//               />
//             </Col>
//           </Row>
//         )}
//       </Card>

//       {/* MODAL CHI TIẾT */}
//       <Modal
//         title={`Chi tiết đơn hàng #${selectedOrder?.orderId}`}
//         open={isModalVisible}
//         onCancel={hideModal}
//         footer={null}
//         width={700}
//       >
//         {selectedOrder && (
//           <>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <Text strong>Khách hàng:</Text>
//                 <Text> {selectedOrder.customer?.fullName || selectedOrder.customerName}</Text>
//               </Col>
//               <Col span={12}>
//                 <Text strong>Mẫu xe:</Text>
//                 <Text> {selectedOrder.quotes?.[0]?.vehicle?.modelName || selectedOrder.vehicleModel}</Text>
//               </Col>
//             </Row>
//             <Row gutter={16} style={{ marginTop: 8 }}>
//               <Col span={12}>
//                 <Text strong>Tổng tiền:</Text>
//                 <Text strong type="danger">
//                   {' '}
//                   {selectedOrder.totalPrice?.toLocaleString()} VND
//                 </Text>
//               </Col>
//               <Col span={12}>
//                 <Text strong>Ngày đặt:</Text>
//                 <Text> {selectedOrder.orderDate}</Text>
//               </Col>
//             </Row>
//             <Row gutter={16} style={{ marginTop: 8 }}>
//               <Col span={24}>
//                 <Text strong>Ghi chú:</Text>
//                 <Text> {selectedOrder.note || 'Không có'}</Text>
//               </Col>
//             </Row>

//             <Divider>Tiến trình giao hàng</Divider>
//             <Timeline>
//               <Timeline.Item dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}>
//                 Pending: Khách hàng đặt hàng
//               </Timeline.Item>
//               <Timeline.Item
//                 dot={
//                   selectedOrder.status === 'Processing'
//                     ? <TruckOutlined style={{ color: '#1890ff' }} />
//                     : <CheckCircleOutlined style={{ color: '#52c41a' }} />
//                 }
//               >
//                 Processing: {selectedOrder.status === 'Processing' ? 'Đang xử lý' : 'Đã xử lý'}
//               </Timeline.Item>
//               {selectedOrder.status === 'Completed' ? (
//                 <Timeline.Item dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}>
//                   Completed: Giao hàng thành công - {addDaysToDate(selectedOrder.orderDate, 2)}
//                 </Timeline.Item>
//               ) : selectedOrder.status === 'Cancelled' ? (
//                 <Timeline.Item dot={<CloseCircleOutlined style={{ color: 'red' }} />}>
//                   Cancelled: Đã hủy đơn hàng
//                 </Timeline.Item>
//               ) : (
//                 <Timeline.Item dot={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}>
//                   Dự kiến Completed: {addDaysToDate(selectedOrder.orderDate, 2)}
//                 </Timeline.Item>
//               )}
//             </Timeline>

//             <Divider />
//             <Space>
//               <Button onClick={hideModal}>Đóng</Button>
//             </Space>
//           </>
//         )}
//       </Modal>

//       {/* MODAL CẬP NHẬT TRẠNG THÁI */}
//       <Modal
//         title={`Cập nhật trạng thái đơn hàng #${selectedOrder?.orderId}`}
//         open={isStatusModalVisible}
//         onCancel={hideStatusModal}
//         footer={null}
//         width={500}
//       >
//         {selectedOrder && (
//           <Form form={statusForm} layout="vertical" onFinish={handleUpdateStatus}>
//             <Form.Item
//               name="status"
//               label="Trạng thái mới"
//               rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
//             >
//               <Select placeholder="Chọn trạng thái">
//                 <Option value="Completed">Completed</Option>
//                 <Option value="Cancelled">Cancelled</Option>
//               </Select>
//             </Form.Item>

//             <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
//               <Space>
//                 <Button type="primary" htmlType="submit" loading={loading}>
//                   Cập nhật
//                 </Button>
//                 <Button onClick={hideStatusModal}>Hủy</Button>
//               </Space>
//             </Form.Item>
//           </Form>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default DeliveryTracking;

//----------------------------------------------------------------------------------//

// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   List,
//   Typography,
//   Tag,
//   Button,
//   Space,
//   Divider,
//   Row,
//   Col,
//   Timeline,
//   Modal,
//   Input,
//   Pagination,
//   Select,
//   Form,
// } from 'antd';
// import {
//   TruckOutlined,
//   CheckCircleOutlined,
//   ClockCircleOutlined,
//   EnvironmentOutlined,
//   CarOutlined,
//   SearchOutlined,
//   UpOutlined,
//   DownOutlined,
//   CloseCircleOutlined,
// } from '@ant-design/icons';
// import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
// import ManageStorageService from '../../../services/ManageStorage/ManageStorageService';
// import { toast } from 'react-toastify';

// const { Title, Text } = Typography;
// const { Option } = Select;

// const DeliveryTracking = () => {
//   const [processingOrders, setProcessingOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isAscending, setIsAscending] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
//   const [statusForm] = Form.useForm();

//   const PAGE_SIZE = 10;

//   // Get storeId from localStorage
//   const getDealerStoreId = () => {
//     try {
//       const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
//       return dealerInfo.storeId ? Number(dealerInfo.storeId) : null;
//     } catch {
//       return null;
//     }
//   };

//   // Function to add days to order date
//   const addDaysToDate = (dateStr, days) => {
//     const [day, month, year] = dateStr.split('/').map(Number);
//     const date = new Date(year, month - 1, day + days);
//     return date.toLocaleDateString('vi-VN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//     });
//   };

//   // === LOAD ORDER LIST ===
//   const fetchOrders = async () => {
//     setLoading(true);
//     const dealerStoreId = getDealerStoreId();

//     if (!dealerStoreId) {
//       toast.error('Store information not found. Please log in again.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const orderData = await ManageOrdersService.getAllOrder();
//       const ordersInStore = orderData.filter(
//         (order) =>
//           order.dealer?.storeId != null &&
//           Number(order.dealer.storeId) === dealerStoreId &&
//           (order.status === 'Processing' || order.status === 'Completed' || order.status === 'Cancelled')
//       );

//       const formattedOrders = ordersInStore.map((order) => {
//         let vehicleModel = 'Unknown';
//         if (order.quotes && order.quotes.length > 0) {
//           const quote = order.quotes[0];
//           vehicleModel = quote.vehicle?.modelName || 'Unknown';
//         }

//         return {
//           key: order.orderId,
//           orderId: order.orderId,
//           customerId: order.customerId,
//           customerName: order.customer?.fullName || 'N/A',
//           vehicleModel,
//           totalPrice: Number(order.totalPrice) || 0,
//           orderDate: order.orderDate,
//           note: order.note || '',
//           storeName: order.store?.storeName || 'N/A',
//           status: order.status,
//         };
//       });

//       setProcessingOrders(formattedOrders);
//     } catch (error) {
//       console.error('Error loading orders:', error);
//       toast.error('Unable to load order list');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // === RESET PAGE ON FILTER/SORT CHANGE ===
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, isAscending]);

//   // === FILTER AND SORT ===
//   useEffect(() => {
//     let filtered = processingOrders;

//     // Filter by search term
//     if (searchTerm.trim()) {
//       const lowerSearch = searchTerm.toLowerCase();
//       filtered = filtered.filter(
//         (order) =>
//           order.customerName.toLowerCase().includes(lowerSearch) ||
//           order.vehicleModel.toLowerCase().includes(lowerSearch)
//       );
//     }

//     // Sort by total price ascending/descending
//     filtered = filtered.sort((a, b) =>
//       isAscending ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice
//     );

//     setFilteredOrders(filtered);
//   }, [searchTerm, processingOrders, isAscending]);

//   const paginatedOrders = filteredOrders.slice(
//     (currentPage - 1) * PAGE_SIZE,
//     currentPage * PAGE_SIZE
//   );

//   // === VIEW ORDER DETAILS ===
//   const handleViewDetails = async (order) => {
//     try {
//       const fullOrder = await ManageOrdersService.getOrderById(order.orderId);
//       setSelectedOrder(fullOrder);
//     } catch (error) {
//       console.error('Error loading order details:', error);
//       toast.error('Unable to load order details');
//       setSelectedOrder(order); // Fallback to list data
//     }
//     setIsModalVisible(true);
//   };

//   const hideModal = () => {
//     setIsModalVisible(false);
//     setSelectedOrder(null);
//   };

//   // === OPEN STATUS UPDATE MODAL ===
//   const handleOpenStatusUpdate = (order) => {
//     setSelectedOrder(order);
//     statusForm.setFieldsValue({ status: undefined });
//     setIsStatusModalVisible(true);
//   };

//   const hideStatusModal = () => {
//     setIsStatusModalVisible(false);
//     setSelectedOrder(null);
//     statusForm.resetFields();
//   };

//   // === UPDATE STATUS ===
//   const handleUpdateStatus = async (values) => {
//     if (!selectedOrder || !values.status) return;

//     setLoading(true);
//     try {
//       const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
//       const dealerId = dealerInfo.dealerId;
//       if (!dealerId) {
//         throw new Error('Dealer ID not found');
//       }

//       // Get order details from API
//       const orderDetails = await ManageOrdersService.getOrderById(selectedOrder.orderId);

//       // Build request body
//       const updateBody = {
//         ...orderDetails,
//         customerId: orderDetails.customerId || selectedOrder.customerId,
//         dealerId: dealerId,
//         orderDate: orderDetails.orderDate || new Date().toLocaleDateString('en-GB'),
//         totalPrice: orderDetails.totalPrice || selectedOrder.totalPrice,
//         status: values.status,
//         note: orderDetails.note || ' ',
//       };

//       // Call updateOrder API
//       await ManageOrdersService.updateOrder(selectedOrder.orderId, updateBody);

//       toast.success(`Order #${selectedOrder.orderId} status updated to ${values.status} successfully!`);
//       hideStatusModal();
//       // Refresh list
//       await fetchOrders();
//     } catch (error) {
//       console.error('Error updating status:', error);
//       toast.error('Failed to update status. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
//         Delivery Tracking
//       </Title>

//       <Card loading={loading}>
//         <Row gutter={16} style={{ marginBottom: 16 }}>
//           <Col span={20}>
//             <Input.Search
//               placeholder="Search by customer name or vehicle model"
//               prefix={<SearchOutlined />}
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               allowClear
//             />
//           </Col>
//           <Col span={4}>
//             <Button
//               onClick={() => setIsAscending(!isAscending)}
//               icon={isAscending ? <DownOutlined /> : <UpOutlined />}
//               block
//             >
//               {isAscending ? 'Descending' : 'Ascending'}
//             </Button>
//           </Col>
//         </Row>

//         <List
//           dataSource={paginatedOrders}
//           locale={{ emptyText: 'No matching orders.' }}
//           renderItem={(item) => (
//             <List.Item
//               key={item.key}
//               actions={[
//                 <Button
//                   icon={<EnvironmentOutlined />}
//                   onClick={() => handleViewDetails(item)}
//                   style={{
//                     background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',  // Xanh dương cho View
//                     border: 'none',
//                     borderRadius: '8px',
//                     color: 'white',
//                     boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                   }}
//                   onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
//                   onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
//                 >
//                   Details
//                 </Button>,
//                 item.status === 'Processing' && (
//                   <Button
//                     onClick={() => handleOpenStatusUpdate(item)}
//                     style={{
//                       background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',  // Xanh lá cho Update
//                       border: 'none',
//                       borderRadius: '8px',
//                       color: 'white',
//                       boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                     }}
//                     onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
//                     onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
//                   >
//                     Update Status
//                   </Button>
//                 ),
//               ]}
//             >
//               <List.Item.Meta
//                 avatar={<CarOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
//                 title={
//                   <Space>
//                     <Text strong>Order #{item.orderId}</Text>
//                     <Tag
//                       color={item.status === 'Completed' ? 'success' : item.status === 'Cancelled' ? 'error' : 'processing'}
//                       icon={
//                         item.status === 'Completed' ? <CheckCircleOutlined /> :
//                           item.status === 'Cancelled' ? <CloseCircleOutlined /> :
//                             <TruckOutlined />
//                       }
//                     >
//                       {item.status}
//                     </Tag>
//                   </Space>
//                 }
//                 description={
//                   <>
//                     <Text>
//                       <strong>Customer:</strong> {item.customerName}
//                     </Text>
//                     <br />
//                     <Text>
//                       <strong>Vehicle Model:</strong> {item.vehicleModel}
//                     </Text>
//                     <br />
//                     <Text>
//                       <strong>Total Amount:</strong>{' '}
//                       <Text strong type="danger">
//                         {item.totalPrice.toLocaleString()} VND
//                       </Text>
//                     </Text>
//                     <br />
//                     <Text type="secondary">
//                       <ClockCircleOutlined /> {item.orderDate}
//                     </Text>
//                   </>
//                 }
//               />
//             </List.Item>
//           )}
//         />

//         {filteredOrders.length > 0 && (
//           <Row justify="end" style={{ marginTop: 16 }}>
//             <Col>
//               <Pagination
//                 current={currentPage}
//                 total={filteredOrders.length}
//                 pageSize={PAGE_SIZE}
//                 onChange={setCurrentPage}
//                 showSizeChanger={false}
//                 showQuickJumper={false}
//                 showTotal={(total, range) => `Showing ${range[0]} to ${range[1]} of ${total} orders`}
//               />
//             </Col>
//           </Row>
//         )}
//       </Card>

//       {/* DETAILS MODAL */}
//       <Modal
//         title={`Order Details #${selectedOrder?.orderId}`}
//         open={isModalVisible}
//         onCancel={hideModal}
//         footer={null}
//         width={700}
//       >
//         {selectedOrder && (
//           <>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <Text strong>Customer:</Text>
//                 <Text> {selectedOrder.customer?.fullName || selectedOrder.customerName}</Text>
//               </Col>
//               <Col span={12}>
//                 <Text strong>Vehicle Model:</Text>
//                 <Text> {selectedOrder.quotes?.[0]?.vehicle?.modelName || selectedOrder.vehicleModel}</Text>
//               </Col>
//             </Row>
//             <Row gutter={16} style={{ marginTop: 8 }}>
//               <Col span={12}>
//                 <Text strong>Total Amount:</Text>
//                 <Text strong type="danger">
//                   {' '}
//                   {selectedOrder.totalPrice?.toLocaleString()} VND
//                 </Text>
//               </Col>
//               <Col span={12}>
//                 <Text strong>Order Date:</Text>
//                 <Text> {selectedOrder.orderDate}</Text>
//               </Col>
//             </Row>
//             <Row gutter={16} style={{ marginTop: 8 }}>
//               <Col span={24}>
//                 <Text strong>Note:</Text>
//                 <Text> {selectedOrder.note || 'None'}</Text>
//               </Col>
//             </Row>

//             <Divider>Delivery Progress</Divider>
//             <Timeline>
//               <Timeline.Item dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}>
//                 Pending: Customer placed order
//               </Timeline.Item>
//               <Timeline.Item
//                 dot={
//                   selectedOrder.status === 'Processing'
//                     ? <TruckOutlined style={{ color: '#1890ff' }} />
//                     : <CheckCircleOutlined style={{ color: '#52c41a' }} />
//                 }
//               >
//                 Processing: {selectedOrder.status === 'Processing' ? 'In Progress' : 'Processed'}
//               </Timeline.Item>
//               {selectedOrder.status === 'Completed' ? (
//                 <Timeline.Item dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}>
//                   Completed: Delivery successful - {addDaysToDate(selectedOrder.orderDate, 2)}
//                 </Timeline.Item>
//               ) : selectedOrder.status === 'Cancelled' ? (
//                 <Timeline.Item dot={<CloseCircleOutlined style={{ color: 'red' }} />}>
//                   Cancelled: Order cancelled
//                 </Timeline.Item>
//               ) : (
//                 <Timeline.Item dot={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}>
//                   Expected Completed: {addDaysToDate(selectedOrder.orderDate, 2)}
//                 </Timeline.Item>
//               )}
//             </Timeline>

//             <Divider />
//             <Space>
//               <Button onClick={hideModal}>Close</Button>
//             </Space>
//           </>
//         )}
//       </Modal>

//       {/* STATUS UPDATE MODAL */}
//       <Modal
//         title={`Update Order Status #${selectedOrder?.orderId}`}
//         open={isStatusModalVisible}
//         onCancel={hideStatusModal}
//         footer={null}
//         width={500}
//       >
//         {selectedOrder && (
//           <Form form={statusForm} layout="vertical" onFinish={handleUpdateStatus}>
//             <Form.Item
//               name="status"
//               label="New Status"
//               rules={[{ required: true, message: 'Please select a status!' }]}
//             >
//               <Select placeholder="Select status">
//                 <Option value="Completed">Completed</Option>
//                 <Option value="Cancelled">Cancelled</Option>
//               </Select>
//             </Form.Item>

//             <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
//               <Space>
//                 <Button type="primary" htmlType="submit" loading={loading}>
//                   Update
//                 </Button>
//                 <Button onClick={hideStatusModal}>Cancel</Button>
//               </Space>
//             </Form.Item>
//           </Form>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default DeliveryTracking;

// update số lượng sau khi order status = Completed
 import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  Typography,
  Tag,
  Button,
  Space,
  Divider,
  Row,
  Col,
  Timeline,
  Modal,
  Input,
  Pagination,
  Select,
  Form,
} from 'antd';
import {
  TruckOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CarOutlined,
  SearchOutlined,
  UpOutlined,
  DownOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
import ManageStorageService from '../../../services/ManageStorage/ManageStorageService';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;
const { Option } = Select;

const DeliveryTracking = () => {
  const [processingOrders, setProcessingOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAscending, setIsAscending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [statusForm] = Form.useForm();

  const PAGE_SIZE = 10;

  // ---------- Helper: format date → DD/MM/YYYY ----------
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // ---------- Get storeId from localStorage ----------
  const getDealerStoreId = () => {
    try {
      const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
      return dealerInfo.storeId ? Number(dealerInfo.storeId) : null;
    } catch {
      return null;
    }
  };

  // ---------- Add days to order date ----------
  const addDaysToDate = (dateStr, days) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day + days);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // ---------- LOAD ORDER LIST ----------
  const fetchOrders = async () => {
    setLoading(true);
    const dealerStoreId = getDealerStoreId();

    if (!dealerStoreId) {
      toast.error('Store information not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const orderData = await ManageOrdersService.getAllOrder();
      const ordersInStore = orderData.filter(
        (order) =>
          order.dealer?.storeId != null &&
          Number(order.dealer.storeId) === dealerStoreId &&
          ['Processing', 'Completed', 'Cancelled'].includes(order.status)
      );

      const formattedOrders = ordersInStore.map((order) => {
        let vehicleModel = 'Unknown';
        if (order.quotes?.[0]?.vehicle?.modelName) {
          vehicleModel = order.quotes[0].vehicle.modelName;
        }

        return {
          key: order.orderId,
          orderId: order.orderId,
          customerId: order.customerId,
          customerName: order.customer?.fullName || 'N/A',
          vehicleModel,
          totalPrice: Number(order.totalPrice) || 0,
          orderDate: order.orderDate,
          note: order.note || '',
          storeName: order.store?.storeName || 'N/A',
          status: order.status,
        };
      });

      setProcessingOrders(formattedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Unable to load order list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ---------- FILTER & SORT ----------
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, isAscending]);

  useEffect(() => {
    let filtered = [...processingOrders];

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.customerName.toLowerCase().includes(lower) ||
          o.vehicleModel.toLowerCase().includes(lower)
      );
    }

    filtered.sort((a, b) =>
      isAscending ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice
    );

    setFilteredOrders(filtered);
  }, [searchTerm, processingOrders, isAscending]);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // ---------- VIEW DETAILS ----------
  const handleViewDetails = async (order) => {
    try {
      const fullOrder = await ManageOrdersService.getOrderById(order.orderId);
      setSelectedOrder(fullOrder);
    } catch (error) {
      console.error('Error loading order details:', error);
      toast.error('Unable to load order details');
      setSelectedOrder(order);
    }
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  // ---------- STATUS UPDATE MODAL ----------
  const handleOpenStatusUpdate = (order) => {
    setSelectedOrder(order);
    statusForm.setFieldsValue({ status: undefined });
    setIsStatusModalVisible(true);
  };

  const hideStatusModal = () => {
    setIsStatusModalVisible(false);
    setSelectedOrder(null);
    statusForm.resetFields();
  };

  // ---------- UPDATE STATUS + DEDUCT INVENTORY (only on Completed) ----------
  const handleUpdateStatus = async (values) => {
    if (!selectedOrder || !values.status) return;

    setLoading(true);
    let orderUpdated = false;

    try {
      const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
      const dealerId = dealerInfo.dealerId;
      if (!dealerId) throw new Error('Dealer ID not found');

      // 1. Get latest order details
      const orderDetails = await ManageOrdersService.getOrderById(selectedOrder.orderId);

      // 2. If moving to Completed → deduct inventory
      if (values.status === 'Completed') {
        const storeId = orderDetails.dealer?.storeId;
        const vehicleId = orderDetails.quotes?.[0]?.vehicle?.vehicleId;

        if (!storeId || !vehicleId) {
          throw new Error('Store ID or Vehicle ID not found in the order');
        }

        // Fetch all storages
        const storages = await ManageStorageService.getAllStorages();
        const targetStorage = storages.find(
          (s) => s.storeId === storeId && s.vehicleId === vehicleId
        );

        if (!targetStorage) {
          throw new Error('No inventory record found for this vehicle in the store');
        }

        if (targetStorage.quantityAvailable <= 0) {
          toast.error('Cannot complete order: vehicle is out of stock.');
          setLoading(false);
          return;
        }

        // Update storage
        const updatedStorage = {
          storageId: targetStorage.storageId,
          vehicleId,
          storeId,
          quantityAvailable: targetStorage.quantityAvailable - 1,
          lastUpdated: formatDate(new Date()),
        };

        await ManageStorageService.updateStorage(targetStorage.storageId, updatedStorage);
      }

      // 3. Update order status
      const updateBody = {
        ...orderDetails,
        customerId: orderDetails.customerId || selectedOrder.customerId,
        dealerId,
        orderDate: orderDetails.orderDate || new Date().toLocaleDateString('en-GB'),
        totalPrice: orderDetails.totalPrice || selectedOrder.totalPrice,
        status: values.status,
        note: orderDetails.note || ' ',
      };

      await ManageOrdersService.updateOrder(selectedOrder.orderId, updateBody);
      orderUpdated = true;

      toast.success(`Order #${selectedOrder.orderId} updated to ${values.status}`);
      hideStatusModal();
      await fetchOrders();
    } catch (error) {
      console.error('Error updating status / inventory:', error);

      // Rollback order if inventory update failed but order was already saved
      if (orderUpdated && values.status === 'Completed') {
        try {
          const rollbackBody = {
            ...selectedOrder,
            status: 'Processing',
          };
          await ManageOrdersService.updateOrder(selectedOrder.orderId, rollbackBody);
          toast.warn('Order status rolled back due to inventory update failure.');
        } catch (rollbackErr) {
          console.error('Rollback failed:', rollbackErr);
        }
      }

      toast.error(error.message || 'Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ---------- RENDER ----------
  return (
    <div>
      <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
        Delivery Tracking
      </Title>

      <Card loading={loading}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={20}>
            <Input.Search
              placeholder="Search by customer name or vehicle model"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Button
              onClick={() => setIsAscending(!isAscending)}
              icon={isAscending ? <DownOutlined /> : <UpOutlined />}
              block
            >
              {isAscending ? 'Descending' : 'Ascending'}
            </Button>
          </Col>
        </Row>

        <List
          dataSource={paginatedOrders}
          locale={{ emptyText: 'No matching orders.' }}
          renderItem={(item) => (
            <List.Item
              key={item.key}
              actions={[
                <Button
                  icon={<EnvironmentOutlined />}
                  onClick={() => handleViewDetails(item)}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  Details
                </Button>,
                item.status === 'Processing' && (
                  <Button
                    onClick={() => handleOpenStatusUpdate(item)}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    Update Status
                  </Button>
                ),
              ]}
            >
              <List.Item.Meta
                avatar={<CarOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                title={
                  <Space>
                    <Text strong>Order #{item.orderId}</Text>
                    <Tag
                      color={
                        item.status === 'Completed'
                          ? 'success'
                          : item.status === 'Cancelled'
                          ? 'error'
                          : 'processing'
                      }
                      icon={
                        item.status === 'Completed' ? (
                          <CheckCircleOutlined />
                        ) : item.status === 'Cancelled' ? (
                          <CloseCircleOutlined />
                        ) : (
                          <TruckOutlined />
                        )
                      }
                    >
                      {item.status}
                    </Tag>
                  </Space>
                }
                description={
                  <>
                    <Text>
                      <strong>Customer:</strong> {item.customerName}
                    </Text>
                    <br />
                    <Text>
                      <strong>Vehicle Model:</strong> {item.vehicleModel}
                    </Text>
                    <br />
                    <Text>
                      <strong>Total Amount:</strong>{' '}
                      <Text strong type="danger">
                        {item.totalPrice.toLocaleString()} VND
                      </Text>
                    </Text>
                    <br />
                    <Text type="secondary">
                      <ClockCircleOutlined /> {item.orderDate}
                    </Text>
                  </>
                }
              />
            </List.Item>
          )}
        />

        {filteredOrders.length > 0 && (
          <Row justify="end" style={{ marginTop: 16 }}>
            <Col>
              <Pagination
                current={currentPage}
                total={filteredOrders.length}
                pageSize={PAGE_SIZE}
                onChange={setCurrentPage}
                showSizeChanger={false}
                showQuickJumper={false}
                showTotal={(total, range) => `Showing ${range[0]} to ${range[1]} of ${total} orders`}
              />
            </Col>
          </Row>
        )}
      </Card>

      {/* DETAILS MODAL */}
      <Modal
        title={`Order Details #${selectedOrder?.orderId}`}
        open={isModalVisible}
        onCancel={hideModal}
        footer={null}
        width={700}
      >
        {selectedOrder && (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Customer:</Text>
                <Text> {selectedOrder.customer?.fullName || selectedOrder.customerName}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Vehicle Model:</Text>
                <Text> {selectedOrder.quotes?.[0]?.vehicle?.modelName || selectedOrder.vehicleModel}</Text>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 8 }}>
              <Col span={12}>
                <Text strong>Total Amount:</Text>
                <Text strong type="danger">
                  {' '}
                  {selectedOrder.totalPrice?.toLocaleString()} VND
                </Text>
              </Col>
              <Col span={12}>
                <Text strong>Order Date:</Text>
                <Text> {selectedOrder.orderDate}</Text>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 8 }}>
              <Col span={24}>
                <Text strong>Note:</Text>
                <Text> {selectedOrder.note || 'None'}</Text>
              </Col>
            </Row>

            <Divider>Delivery Progress</Divider>
            <Timeline>
              <Timeline.Item dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}>
                Pending: Customer placed order
              </Timeline.Item>
              <Timeline.Item
                dot={
                  selectedOrder.status === 'Processing' ? (
                    <TruckOutlined style={{ color: '#1890ff' }} />
                  ) : (
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  )
                }
              >
                Processing:{' '}
                {selectedOrder.status === 'Processing' ? 'In Progress' : 'Processed'}
              </Timeline.Item>
              {selectedOrder.status === 'Completed' ? (
                <Timeline.Item dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}>
                  Completed: Delivery successful -{' '}
                  {addDaysToDate(selectedOrder.orderDate, 2)}
                </Timeline.Item>
              ) : selectedOrder.status === 'Cancelled' ? (
                <Timeline.Item dot={<CloseCircleOutlined style={{ color: 'red' }} />}>
                  Cancelled: Order cancelled
                </Timeline.Item>
              ) : (
                <Timeline.Item dot={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}>
                  Expected Completed: {addDaysToDate(selectedOrder.orderDate, 2)}
                </Timeline.Item>
              )}
            </Timeline>

            <Divider />
            <Space>
              <Button onClick={hideModal}>Close</Button>
            </Space>
          </>
        )}
      </Modal>

      {/* STATUS UPDATE MODAL */}
      <Modal
        title={`Update Order Status #${selectedOrder?.orderId}`}
        open={isStatusModalVisible}
        onCancel={hideStatusModal}
        footer={null}
        width={500}
      >
        {selectedOrder && (
          <Form form={statusForm} layout="vertical" onFinish={handleUpdateStatus}>
            <Form.Item
              name="status"
              label="New Status"
              rules={[{ required: true, message: 'Please select a status!' }]}
            >
              <Select placeholder="Select status">
                <Option value="Completed">Completed</Option>
                <Option value="Cancelled">Cancelled</Option>
              </Select>
            </Form.Item>

            <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update
                </Button>
                <Button onClick={hideStatusModal}>Cancel</Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default DeliveryTracking;