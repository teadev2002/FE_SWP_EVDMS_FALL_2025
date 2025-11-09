// import React, { useState, useEffect } from 'react';
// import {
//   Table,
//   Typography,
//   Form,
//   Button,
//   Input,
//   Select,
//   DatePicker,
//   Modal,
//   Tabs,
//   Row,
//   Col,
//   Tag,
// } from 'antd';
// import ManageServiceSaleAgreements from '../../../services/ManageAgreements/ManageServiceSaleAgreements';
// import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
// import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
// import Quotation from './Quotation';
// import Orders from './Orders';
// import { toast } from 'react-toastify';

// const { Title } = Typography;
// const { TabPane } = Tabs;

// const ManageSaleAgreements = () => {
//   const [agreements, setSaleAgreements] = useState([]);
//   const [filteredAgreements, setFilteredAgreements] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('agreements');
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [customers, setCustomers] = useState([]); // Chỉ khách có order
//   const [orderOptions, setOrderOptions] = useState([]);
//   const [customerOrdersMap, setCustomerOrdersMap] = useState(new Map());
//   const [searchText, setSearchText] = useState('');
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
//         // 1. LẤY TẤT CẢ HỢP ĐỒNG + LỌC THEO STORE
//         const agreementData = await ManageServiceSaleAgreements.getAllSaleAgreements();
//         const agreementsInStore = agreementData.filter(a => Number(a.storeId) === dealerStoreId);

//         const formattedAgreements = agreementsInStore.map(item => ({
//           key: item.agreementId,
//           customerName: item.customerName || 'N/A',
//           agreementDate: item.agreementDate || 'N/A',
//           termsAndConditions: item.termsAndConditions || 'N/A',
//           status: item.status || 'N/A',
//         }));

//         setSaleAgreements(formattedAgreements);
//         setFilteredAgreements(formattedAgreements);

//         // 2. LẤY KHÁCH HÀNG THEO STORE
//         let customerData = [];
//         try {
//           customerData = await ManageCustomersService.getCustomerByStoreId(dealerStoreId);
//         } catch (error) {
//           console.error('Lỗi tải khách hàng:', error);
//           toast.warn('Không tải được danh sách khách hàng.');
//         }

//         // 3. LẤY TẤT CẢ ĐƠN HÀNG + LỌC THEO STORE
//         let orderData = [];
//         try {
//           orderData = await ManageOrdersService.getAllOrder();
//         } catch (error) {
//           console.error('Lỗi tải đơn hàng:', error);
//           toast.warn('Không tải được danh sách đơn hàng.');
//         }

//         const ordersInStore = orderData.filter(order =>
//           order.dealer?.storeId != null && Number(order.dealer.storeId) === dealerStoreId
//         );

//         // 4. XÂY DỰNG MAP: customerId → danh sách order
//         const map = new Map();
//         const customerIdsInStore = new Set(customerData.map(c => c.customerId));

//         ordersInStore.forEach(order => {
//           if (customerIdsInStore.has(order.customerId)) {
//             if (!map.has(order.customerId)) {
//               map.set(order.customerId, []);
//             }
//             map.get(order.customerId).push({
//               value: order.orderId,
//               label: `Order #${order.orderId} - ${order.totalPrice?.toLocaleString('vi-VN') || 0}₫`
//             });
//           }
//         });

//         setCustomerOrdersMap(map);

//         // 5. CHỈ LẤY KHÁCH HÀNG CÓ ĐƠN HÀNG
//         const customersWithOrders = customerData
//           .filter(c => map.has(c.customerId))
//           .map(c => ({
//             value: c.customerId,
//             label: c.fullName
//           }));

//         setCustomers(customersWithOrders);

//       } catch (error) {
//         console.error('Lỗi tải dữ liệu:', error);
//         toast.error('Không thể tải dữ liệu. Vui lòng thử lại.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // === TÌM KIẾM ===
//   useEffect(() => {
//     const filtered = agreements.filter(
//       (agreement) =>
//         agreement.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
//         agreement.agreementDate.includes(searchText)
//     );
//     setFilteredAgreements(filtered);
//     setCurrentPage(1);
//   }, [searchText, agreements]);

//   // === KHI CHỌN KHÁCH HÀNG → HIỆN DANH SÁCH ĐƠN HÀNG ===
//   const handleCustomerChange = (value) => {
//     const orders = customerOrdersMap.get(value) || [];
//     setOrderOptions(orders);

//     if (orders.length === 1) {
//       form.setFieldsValue({ orderId: orders[0].value });
//     } else {
//       form.setFieldsValue({ orderId: undefined });
//     }
//   };

//   // === THÊM HỢP ĐỒNG ===
//   const handleAddAgreement = async (values) => {
//     setLoading(true);
//     try {
//       const dealerStoreId = getDealerStoreId();
//       if (!dealerStoreId) {
//         toast.error('Không xác định được cửa hàng.');
//         return;
//       }

//       const agreementData = {
//         customerId: values.customerId,
//         orderId: values.orderId,
//         agreementDate: values.agreementDate.format('DD/MM/YYYY'),
//         termsAndConditions: values.termsAndConditions,
//         status: values.status || 'Active',
//         fileUrl: values.fileUrl || '',
//         storeId: dealerStoreId,
//       };

//       await ManageServiceSaleAgreements.AddSaleAgreement(agreementData);
//       toast.success('Thêm hợp đồng thành công!');

//       // REFRESH
//       const agreementDataUpdated = await ManageServiceSaleAgreements.getAllSaleAgreements();
//       const agreementsInStore = agreementDataUpdated.filter(a => Number(a.storeId) === dealerStoreId);

//       const formattedData = agreementsInStore.map(item => ({
//         key: item.agreementId,
//         customerName: item.customerName || 'N/A',
//         agreementDate: item.agreementDate || 'N/A',
//         termsAndConditions: item.termsAndConditions || 'N/A',
//         status: item.status || 'N/A',
//       }));

//       setSaleAgreements(formattedData);
//       setFilteredAgreements(formattedData);
//       setIsModalVisible(false);
//       form.resetFields();
//       setOrderOptions([]);

//     } catch (error) {
//       console.error('Lỗi thêm hợp đồng:', error);
//       toast.error('Thêm hợp đồng thất bại.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // === MODAL ===
//   const showModal = () => {
//     setIsModalVisible(true);
//     form.resetFields();
//     setOrderOptions([]);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     form.resetFields();
//     setOrderOptions([]);
//   };

//   // === CỘT BẢNG ===
//   const columns = [
//     {
//       title: 'Khách hàng',
//       dataIndex: 'customerName',
//       key: 'customerName',
//       sorter: (a, b) => a.customerName.localeCompare(b.customerName),
//     },
//     {
//       title: 'Ngày hợp đồng',
//       dataIndex: 'agreementDate',
//       key: 'agreementDate',
//       sorter: (a, b) => {
//         const parse = d => {
//           if (!d || d === 'N/A') return 0;
//           const [day, month, year] = d.split('/').map(Number);
//           return new Date(year, month - 1, day).getTime();
//         };
//         return parse(a.agreementDate) - parse(b.agreementDate);
//       },
//     },
//     {
//       title: 'Điều khoản',
//       dataIndex: 'termsAndConditions',
//       key: 'termsAndConditions',
//       ellipsis: true,
//       sorter: (a, b) => a.termsAndConditions.localeCompare(b.termsAndConditions),
//     },
//     {
//       title: 'Trạng thái',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status) => (
//         <Tag color={status === 'Active' ? 'green' : status === 'Pending' ? 'orange' : 'red'}>
//           {status}
//         </Tag>
//       ),
//       sorter: (a, b) => a.status.localeCompare(b.status),
//     },
//   ];

//   const totalAgreements = filteredAgreements.length;
//   const startIndex = (currentPage - 1) * pageSize + 1;
//   const endIndex = Math.min(currentPage * pageSize, totalAgreements);

//   return (
//     <div>
//       <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
//         Sale Management
//       </Title>

//       <Tabs activeKey={activeTab} onChange={setActiveTab}>
//         <TabPane tab="Agreements" key="agreements">
//           <Title level={3} style={{ color: '#1F1F1F', marginBottom: 24 }}>
//             Quản lý hợp đồng bán hàng
//           </Title>

//           <Row gutter={16} style={{ marginBottom: 16 }}>
//             <Col span={20}>
//               <Input
//                 placeholder="Tìm theo tên khách hàng hoặc ngày hợp đồng"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 allowClear
//               />
//             </Col>
//             <Col span={4}>
//               <Button type="primary" onClick={showModal} style={{ width: '100%' }}>
//                 Thêm hợp đồng
//               </Button>
//             </Col>
//           </Row>

//           <div style={{ marginBottom: 16, fontSize: 14, color: '#666' }}>
//             Hiển thị {startIndex} đến {endIndex} của {totalAgreements} hợp đồng
//           </div>

//           <Table
//             columns={columns}
//             dataSource={filteredAgreements}
//             loading={loading}
//             rowKey="key"
//             pagination={{
//               pageSize,
//               current: currentPage,
//               total: totalAgreements,
//               onChange: (page) => setCurrentPage(page),
//               showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} của ${total} hợp đồng`,
//             }}
//             bordered
//           />
//         </TabPane>

//         <TabPane tab="Quotations" key="quotations">
//           <Quotation />
//         </TabPane>

//         <TabPane tab="Orders" key="orders">
//           <Orders />
//         </TabPane>
//       </Tabs>

//       {/* MODAL THÊM HỢP ĐỒNG */}
//       <Modal
//         title="Thêm Hợp Đồng Bán Hàng Mới"
//         open={isModalVisible}
//         onCancel={handleCancel}
//         footer={null}
//         width={700}
//       >
//         <Form form={form} layout="vertical" onFinish={handleAddAgreement}>
//           {/* KHÁCH HÀNG - CHỈ CÓ ORDER TRONG STORE */}
//           <Form.Item
//             name="customerId"
//             label="Khách hàng"
//             rules={[{ required: true, message: 'Vui lòng chọn khách hàng!' }]}
//           >
//             <Select
//               showSearch
//               placeholder="Chọn khách hàng (phải có đơn hàng)"
//               optionFilterProp="label"
//               options={customers}
//               onChange={handleCustomerChange}
//               notFoundContent="Không có khách hàng nào có đơn hàng"
//             />
//           </Form.Item>

//           {/* ĐƠN HÀNG - TỰ ĐỘNG HIỆN KHI CHỌN KHÁCH */}
//           <Form.Item
//             name="orderId"
//             label="Đơn hàng"
//             rules={[{ required: true, message: 'Vui lòng chọn đơn hàng!' }]}
//           >
//             <Select
//               showSearch
//               placeholder="Chọn đơn hàng"
//               optionFilterProp="label"
//               options={orderOptions}
//               disabled={orderOptions.length === 0}
//               notFoundContent="Chọn khách hàng trước"
//             />
//           </Form.Item>

//           <Form.Item
//             name="agreementDate"
//             label="Ngày hợp đồng"
//             rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
//           >
//             <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
//           </Form.Item>

//           <Form.Item
//             name="termsAndConditions"
//             label="Điều khoản"
//             rules={[{ required: true, message: 'Vui lòng nhập điều khoản!' }]}
//           >
//             <Input.TextArea rows={4} placeholder="Nhập điều khoản hợp đồng..." />
//           </Form.Item>

//           <Form.Item name="status" label="Trạng thái" initialValue="Active">
//             <Select>
//               <Select.Option value="Active">Active</Select.Option>
//               <Select.Option value="Inactive">Inactive</Select.Option>
//               <Select.Option value="Pending">Pending</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item name="fileUrl" label="File URL (tùy chọn)">
//             <Input placeholder="Ví dụ: contract_001.pdf" />
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
//               Thêm Hợp Đồng
//             </Button>
//             <Button onClick={handleCancel}>Hủy</Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default ManageSaleAgreements;

//----------------------------------------------------------------------------------//

// import React, { useState, useEffect } from 'react';
// import {
//   Table,
//   Typography,
//   Form,
//   Button,
//   Input,
//   Select,
//   DatePicker,
//   Modal,
//   Tabs,
//   Row,
//   Col,
//   Tag,
// } from 'antd';
// import ManageServiceSaleAgreements from '../../../services/ManageAgreements/ManageServiceSaleAgreements';
// import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
// import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
// import Quotation from './Quotation';
// import Orders from './Orders';
// import { toast } from 'react-toastify';

// const { Title } = Typography;
// const { TabPane } = Tabs;

// const ManageSaleAgreements = () => {
//   const [agreements, setSaleAgreements] = useState([]);
//   const [filteredAgreements, setFilteredAgreements] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('agreements');
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [customers, setCustomers] = useState([]); // Only customers with orders
//   const [orderOptions, setOrderOptions] = useState([]);
//   const [customerOrdersMap, setCustomerOrdersMap] = useState(new Map());
//   const [searchText, setSearchText] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [form] = Form.useForm();

//   // Get storeId from localStorage
//   const getDealerStoreId = () => {
//     try {
//       const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
//       return dealerInfo.storeId ? Number(dealerInfo.storeId) : null;
//     } catch {
//       return null;
//     }
//   };

//   // === LOAD DATA ===
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
//         // 1. GET ALL AGREEMENTS + FILTER BY STORE
//         const agreementData = await ManageServiceSaleAgreements.getAllSaleAgreements();
//         const agreementsInStore = agreementData.filter(a => Number(a.storeId) === dealerStoreId);

//         const formattedAgreements = agreementsInStore.map(item => ({
//           key: item.agreementId,
//           customerName: item.customerName || 'N/A',
//           agreementDate: item.agreementDate || 'N/A',
//           termsAndConditions: item.termsAndConditions || 'N/A',
//           status: item.status || 'N/A',
//         }));

//         setSaleAgreements(formattedAgreements);
//         setFilteredAgreements(formattedAgreements);

//         // 2. GET CUSTOMERS BY STORE
//         let customerData = [];
//         try {
//           customerData = await ManageCustomersService.getCustomerByStoreId(dealerStoreId);
//         } catch (error) {
//           console.error('Error loading customers:', error);
//           toast.warn('Failed to load customer list.');
//         }

//         // 3. GET ALL ORDERS + FILTER BY STORE
//         let orderData = [];
//         try {
//           orderData = await ManageOrdersService.getAllOrder();
//         } catch (error) {
//           console.error('Error loading orders:', error);
//           toast.warn('Failed to load order list.');
//         }

//         const ordersInStore = orderData.filter(order =>
//           order.dealer?.storeId != null && Number(order.dealer.storeId) === dealerStoreId
//         );

//         // 4. BUILD MAP: customerId → list of orders
//         const map = new Map();
//         const customerIdsInStore = new Set(customerData.map(c => c.customerId));

//         ordersInStore.forEach(order => {
//           if (customerIdsInStore.has(order.customerId)) {
//             if (!map.has(order.customerId)) {
//               map.set(order.customerId, []);
//             }
//             map.get(order.customerId).push({
//               value: order.orderId,
//               label: `Order #${order.orderId} - ${order.totalPrice?.toLocaleString('vi-VN') || 0}₫`
//             });
//           }
//         });

//         setCustomerOrdersMap(map);

//         // 5. ONLY GET CUSTOMERS WITH ORDERS
//         const customersWithOrders = customerData
//           .filter(c => map.has(c.customerId))
//           .map(c => ({
//             value: c.customerId,
//             label: c.fullName
//           }));

//         setCustomers(customersWithOrders);

//       } catch (error) {
//         console.error('Error loading data:', error);
//         toast.error('Unable to load data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // === SEARCH ===
//   useEffect(() => {
//     const filtered = agreements.filter(
//       (agreement) =>
//         agreement.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
//         agreement.agreementDate.includes(searchText)
//     );
//     setFilteredAgreements(filtered);
//     setCurrentPage(1);
//   }, [searchText, agreements]);

//   // === ON CUSTOMER SELECT → SHOW ORDER LIST ===
//   const handleCustomerChange = (value) => {
//     const orders = customerOrdersMap.get(value) || [];
//     setOrderOptions(orders);

//     if (orders.length === 1) {
//       form.setFieldsValue({ orderId: orders[0].value });
//     } else {
//       form.setFieldsValue({ orderId: undefined });
//     }
//   };

//   // === ADD AGREEMENT ===
//   const handleAddAgreement = async (values) => {
//     setLoading(true);
//     try {
//       const dealerStoreId = getDealerStoreId();
//       if (!dealerStoreId) {
//         toast.error('Store not identified.');
//         return;
//       }

//       const agreementData = {
//         customerId: values.customerId,
//         orderId: values.orderId,
//         agreementDate: values.agreementDate.format('DD/MM/YYYY'),
//         termsAndConditions: values.termsAndConditions,
//         status: values.status || 'Active',
//         fileUrl: values.fileUrl || '',
//         storeId: dealerStoreId,
//       };

//       await ManageServiceSaleAgreements.AddSaleAgreement(agreementData);
//       toast.success('Agreement added successfully!');

//       // REFRESH
//       const agreementDataUpdated = await ManageServiceSaleAgreements.getAllSaleAgreements();
//       const agreementsInStore = agreementDataUpdated.filter(a => Number(a.storeId) === dealerStoreId);

//       const formattedData = agreementsInStore.map(item => ({
//         key: item.agreementId,
//         customerName: item.customerName || 'N/A',
//         agreementDate: item.agreementDate || 'N/A',
//         termsAndConditions: item.termsAndConditions || 'N/A',
//         status: item.status || 'N/A',
//       }));

//       setSaleAgreements(formattedData);
//       setFilteredAgreements(formattedData);
//       setIsModalVisible(false);
//       form.resetFields();
//       setOrderOptions([]);

//     } catch (error) {
//       console.error('Error adding agreement:', error);
//       toast.error('Failed to add agreement.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // === MODAL ===
//   const showModal = () => {
//     setIsModalVisible(true);
//     form.resetFields();
//     setOrderOptions([]);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     form.resetFields();
//     setOrderOptions([]);
//   };

//   // === TABLE COLUMNS ===
//   const columns = [
//     {
//       title: 'Customer',
//       dataIndex: 'customerName',
//       key: 'customerName',
//       sorter: (a, b) => a.customerName.localeCompare(b.customerName),
//     },
//     {
//       title: 'Agreement Date',
//       dataIndex: 'agreementDate',
//       key: 'agreementDate',
//       sorter: (a, b) => {
//         const parse = d => {
//           if (!d || d === 'N/A') return 0;
//           const [day, month, year] = d.split('/').map(Number);
//           return new Date(year, month - 1, day).getTime();
//         };
//         return parse(a.agreementDate) - parse(b.agreementDate);
//       },
//     },
//     {
//       title: 'Terms & Conditions',
//       dataIndex: 'termsAndConditions',
//       key: 'termsAndConditions',
//       ellipsis: true,
//       sorter: (a, b) => a.termsAndConditions.localeCompare(b.termsAndConditions),
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status) => (
//         <Tag color={status === 'Active' ? 'green' : status === 'Pending' ? 'orange' : 'red'}>
//           {status}
//         </Tag>
//       ),
//       sorter: (a, b) => a.status.localeCompare(b.status),
//     },
//   ];

//   const totalAgreements = filteredAgreements.length;
//   const startIndex = (currentPage - 1) * pageSize + 1;
//   const endIndex = Math.min(currentPage * pageSize, totalAgreements);

//   return (
//     <div>
//       <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
//         Sale Management
//       </Title>

//       <Tabs activeKey={activeTab} onChange={setActiveTab}>
//         <TabPane tab="Agreements" key="agreements">
//           <Title level={3} style={{ color: '#1F1F1F', marginBottom: 24 }}>
//             Sales Agreement Management
//           </Title>

//           <Row gutter={16} style={{ marginBottom: 16 }}>
//             <Col span={20}>
//               <Input
//                 placeholder="Search by customer name or agreement date"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 allowClear
//               />
//             </Col>
//             <Col span={4}>
//               <Button type="primary" onClick={showModal} style={{ width: '100%' }}>
//                 Add Agreement
//               </Button>
//             </Col>
//           </Row>

//           <div style={{ marginBottom: 16, fontSize: 14, color: '#666' }}>
//             Showing {startIndex} to {endIndex} of {totalAgreements} agreements
//           </div>

//           <Table
//             columns={columns}
//             dataSource={filteredAgreements}
//             loading={loading}
//             rowKey="key"
//             pagination={{
//               pageSize,
//               current: currentPage,
//               total: totalAgreements,
//               onChange: (page) => setCurrentPage(page),
//               showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} agreements`,
//             }}
//             bordered
//           />
//         </TabPane>

//         <TabPane tab="Quotations" key="quotations">
//           <Quotation />
//         </TabPane>

//         <TabPane tab="Orders" key="orders">
//           <Orders />
//         </TabPane>
//       </Tabs>

//       {/* ADD AGREEMENT MODAL */}
//       <Modal
//         title="Add New Sales Agreement"
//         open={isModalVisible}
//         onCancel={handleCancel}
//         footer={null}
//         width={700}
//       >
//         <Form form={form} layout="vertical" onFinish={handleAddAgreement}>
//           {/* CUSTOMER - ONLY WITH ORDERS IN STORE */}
//           <Form.Item
//             name="customerId"
//             label="Customer"
//             rules={[{ required: true, message: 'Please select a customer!' }]}
//           >
//             <Select
//               showSearch
//               placeholder="Select customer (must have orders)"
//               optionFilterProp="label"
//               options={customers}
//               onChange={handleCustomerChange}
//               notFoundContent="No customers with orders"
//             />
//           </Form.Item>

//           {/* ORDER - AUTO SHOW ON CUSTOMER SELECT */}
//           <Form.Item
//             name="orderId"
//             label="Order"
//             rules={[{ required: true, message: 'Please select an order!' }]}
//           >
//             <Select
//               showSearch
//               placeholder="Select order"
//               optionFilterProp="label"
//               options={orderOptions}
//               disabled={orderOptions.length === 0}
//               notFoundContent="Select customer first"
//             />
//           </Form.Item>

//           <Form.Item
//             name="agreementDate"
//             label="Agreement Date"
//             rules={[{ required: true, message: 'Please select a date!' }]}
//           >
//             <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
//           </Form.Item>

//           <Form.Item
//             name="termsAndConditions"
//             label="Terms & Conditions"
//             rules={[{ required: true, message: 'Please enter terms!' }]}
//           >
//             <Input.TextArea rows={4} placeholder="Enter contract terms..." />
//           </Form.Item>

//           <Form.Item name="status" label="Status" initialValue="Active">
//             <Select>
//               <Select.Option value="Active">Active</Select.Option>
//               <Select.Option value="Inactive">Inactive</Select.Option>
//               <Select.Option value="Pending">Pending</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item name="fileUrl" label="File URL (optional)">
//             <Input placeholder="e.g., contract_001.pdf" />
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
//               Add Agreement
//             </Button>
//             <Button onClick={handleCancel}>Cancel</Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default ManageSaleAgreements;

// edit and delete
import React, { useState, useEffect } from 'react';
import {
  Table,
  Typography,
  Form,
  Button,
  Input,
  Select,
  DatePicker,
  Modal,
  Tabs,
  Row,
  Col,
  Tag,
  Space,
  Popconfirm,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import ManageServiceSaleAgreements from '../../../services/ManageAgreements/ManageServiceSaleAgreements';
import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
import Quotation from './Quotation';
import Orders from './Orders';
import { toast } from 'react-toastify';

const { Title } = Typography;
const { TabPane } = Tabs;

const ManageSaleAgreements = () => {
  const [agreements, setSaleAgreements] = useState([]);
  const [filteredAgreements, setFilteredAgreements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('agreements');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAgreement, setEditingAgreement] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [orderOptions, setOrderOptions] = useState([]);
  const [customerOrdersMap, setCustomerOrdersMap] = useState(new Map());
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [form] = Form.useForm();

  const getDealerStoreId = () => {
    try {
      const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
      return dealerInfo.storeId ? Number(dealerInfo.storeId) : null;
    } catch {
      return null;
    }
  };

  // Reusable filter function
  const applyFilter = (data) => {
    if (!searchText.trim()) return data;
    const query = searchText.toLowerCase();
    return data.filter(item =>
      item.customerName.toLowerCase().includes(query) ||
      item.agreementDate.includes(searchText)
    );
  };

  // Load all data
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
        const [agreementData, customerData, orderData] = await Promise.all([
          ManageServiceSaleAgreements.getAllSaleAgreements(),
          ManageCustomersService.getCustomerByStoreId(dealerStoreId).catch(() => []),
          ManageOrdersService.getAllOrder().catch(() => []),
        ]);

        const agreementsInStore = agreementData.filter(a => Number(a.storeId) === dealerStoreId);
        const ordersInStore = orderData.filter(order =>
          order.dealer?.storeId != null && Number(order.dealer.storeId) === dealerStoreId
        );

        // Format agreements
        const formattedAgreements = agreementsInStore.map(item => ({
          key: item.agreementId,
          agreementId: item.agreementId,
          customerId: item.customerId,
          orderId: item.orderId,
          customerName: item.customerName || 'N/A',
          agreementDate: item.agreementDate || 'N/A',
          termsAndConditions: item.termsAndConditions || 'N/A',
          status: item.status || 'Active',
          fileUrl: item.fileUrl || '',
        }));

        setSaleAgreements(formattedAgreements);
        setFilteredAgreements(applyFilter(formattedAgreements));

        // Build customer → orders map
        const map = new Map();
        const customerIdsInStore = new Set(customerData.map(c => c.customerId));

        ordersInStore.forEach(order => {
          if (customerIdsInStore.has(order.customerId)) {
            if (!map.has(order.customerId)) map.set(order.customerId, []);
            map.get(order.customerId).push({
              value: order.orderId,
              label: `Order #${order.orderId} - ${order.totalPrice?.toLocaleString('vi-VN') || 0}₫`
            });
          }
        });

        setCustomerOrdersMap(map);

        const customersWithOrders = customerData
          .filter(c => map.has(c.customerId))
          .map(c => ({ value: c.customerId, label: c.fullName }));

        setCustomers(customersWithOrders);

      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Unable to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search effect
  useEffect(() => {
    setFilteredAgreements(applyFilter(agreements));
    setCurrentPage(1);
  }, [searchText, agreements]);

  // Customer change → load orders
  const handleCustomerChange = (value) => {
    const orders = customerOrdersMap.get(value) || [];
    setOrderOptions(orders);
    form.setFieldsValue({ orderId: orders.length === 1 ? orders[0].value : undefined });
  };

  // Open modal: Add or Edit
  const showModal = (record = null) => {
    setIsEditMode(!!record);
    setEditingAgreement(record);
    setIsModalVisible(true);

    if (record) {
      form.setFieldsValue({
        customerId: record.customerId,
        orderId: record.orderId,
        agreementDate: record.agreementDate !== 'N/A' ? dayjs(record.agreementDate, 'DD/MM/YYYY') : null,
        termsAndConditions: record.termsAndConditions,
        status: record.status,
        fileUrl: record.fileUrl,
      });
      handleCustomerChange(record.customerId);
    } else {
      form.resetFields();
      setOrderOptions([]);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditMode(false);
    setEditingAgreement(null);
    form.resetFields();
    setOrderOptions([]);
  };

  // Add or Update Agreement
  const handleSubmit = async (values) => {
    setLoading(true);
    const dealerStoreId = getDealerStoreId();
    if (!dealerStoreId) {
      toast.error('Store not identified.');
      setLoading(false);
      return;
    }

    const payload = {
      customerId: values.customerId,
      orderId: values.orderId,
      agreementDate: values.agreementDate.format('DD/MM/YYYY'),
      termsAndConditions: values.termsAndConditions,
      status: values.status,
      fileUrl: values.fileUrl || '',
      storeId: dealerStoreId,
    };

    try {
      if (isEditMode) {
        await ManageServiceSaleAgreements.editSaleAgreement(editingAgreement.agreementId, payload);
        toast.success('Agreement updated successfully!');
      } else {
        await ManageServiceSaleAgreements.AddSaleAgreement(payload);
        toast.success('Agreement added successfully!');
      }

      // Refresh agreements
      const data = await ManageServiceSaleAgreements.getAllSaleAgreements();
      const filtered = data.filter(a => Number(a.storeId) === dealerStoreId);
      const formatted = filtered.map(item => ({
        key: item.agreementId,
        agreementId: item.agreementId,
        customerId: item.customerId,
        orderId: item.orderId,
        customerName: item.customerName || 'N/A',
        agreementDate: item.agreementDate || 'N/A',
        termsAndConditions: item.termsAndConditions || 'N/A',
        status: item.status || 'Active',
        fileUrl: item.fileUrl || '',
      }));

      setSaleAgreements(formatted);
      setFilteredAgreements(applyFilter(formatted));
      handleCancel();

    } catch (error) {
      toast.error(`Failed to ${isEditMode ? 'update' : 'add'} agreement.`, error);
    } finally {
      setLoading(false);
    }
  };

  // Delete Agreement
  const handleDelete = async (agreementId) => {
    try {
      await ManageServiceSaleAgreements.deleteSaleAgreement(agreementId);
      const updated = agreements.filter(a => a.agreementId !== agreementId);
      setSaleAgreements(updated);
      setFilteredAgreements(applyFilter(updated));
      toast.success('Agreement deleted successfully');
    } catch (error) {
      toast.error('Failed to delete agreement.', error);
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'Agreement Date',
      dataIndex: 'agreementDate',
      key: 'agreementDate',
      sorter: (a, b) => {
        const parse = d => d === 'N/A' ? 0 : dayjs(d, 'DD/MM/YYYY').unix();
        return parse(a.agreementDate) - parse(b.agreementDate);
      },
    },
    {
      title: 'Terms & Conditions',
      dataIndex: 'termsAndConditions',
      key: 'termsAndConditions',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : status === 'Pending' ? 'orange' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this agreement?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.agreementId)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const totalAgreements = filteredAgreements.length;
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalAgreements);

  return (
    <div>
      <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
        Sale Management
      </Title>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Agreements" key="agreements">
          <Title level={3} style={{ color: '#1F1F1F', marginBottom: 24 }}>
            Sales Agreement Management
          </Title>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={20}>
              <Input
                placeholder="Search by customer name or agreement date"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={() => showModal()} style={{ width: '100%' }}>
                Add Agreement
              </Button>
            </Col>
          </Row>

          <div style={{ marginBottom: 16, fontSize: 14, color: '#666' }}>
            Showing {startIndex} to {endIndex} of {totalAgreements} agreements
          </div>

          <Table
            columns={columns}
            dataSource={filteredAgreements}
            loading={loading}
            rowKey="key"
            pagination={{
              pageSize,
              current: currentPage,
              total: totalAgreements,
              onChange: (page) => setCurrentPage(page),
              showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} agreements`,
            }}
            bordered
          />
        </TabPane>

        <TabPane tab="Quotations" key="quotations">
          <Quotation />
        </TabPane>
        <TabPane tab="Orders" key="orders">
          <Orders />
        </TabPane>
      </Tabs>

      {/* ADD / EDIT MODAL */}
      <Modal
        title={isEditMode ? 'Edit Sales Agreement' : 'Add New Sales Agreement'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="customerId"
            label="Customer"
            rules={[{ required: true, message: 'Please select a customer!' }]}
          >
            <Select
              showSearch
              placeholder="Select customer"
              optionFilterProp="label"
              options={customers}
              onChange={handleCustomerChange}
              notFoundContent="No customers with orders"
            />
          </Form.Item>

          <Form.Item
            name="orderId"
            label="Order"
            rules={[{ required: true, message: 'Please select an order!' }]}
          >
            <Select
              showSearch
              placeholder="Select order"
              optionFilterProp="label"
              options={orderOptions}
              disabled={orderOptions.length === 0}
              notFoundContent="Select customer first"
            />
          </Form.Item>

          <Form.Item
            name="agreementDate"
            label="Agreement Date"
            rules={[{ required: true, message: 'Please select a date!' }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="termsAndConditions"
            label="Terms & Conditions"
            rules={[{ required: true, message: 'Please enter terms!' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter contract terms..." />
          </Form.Item>

          <Form.Item name="status" label="Status" initialValue="Active">
            <Select>
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="fileUrl" label="File URL (optional)">
            <Input placeholder="e.g., contract_001.pdf" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditMode ? 'Update' : 'Add'} Agreement
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageSaleAgreements;