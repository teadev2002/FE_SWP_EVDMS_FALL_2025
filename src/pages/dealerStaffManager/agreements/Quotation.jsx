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
//   Row,
//   Col,
//   Tag,
// } from 'antd';
// import ManageQuoteService from '../../../services/ManageQuotes/ManageQuoteService';
// import ManageDealerService from '../../../services/ManageDealer/ManageDealerService';
// import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
// import ManageStorageService from '../../../services/ManageStorage/ManageStorageService';
// import { toast } from 'react-toastify';

// const { Title } = Typography;

// const Quotation = () => {
//   const [quotations, setQuotations] = useState([]);
//   const [filteredQuotations, setFilteredQuotations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [customers, setCustomers] = useState([]);
//   const [vehicles, setVehicles] = useState([]); // Dùng chung cho form + bảng
//   const [dealers, setDealers] = useState([]);
//   const [searchText, setSearchText] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [form] = Form.useForm();

//   // Lấy storeId từ localStorage
//   const getDealerStoreId = () => {
//     try {
//       const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
//       return dealerInfo.storeId ? Number(dealerInfo.storeId) : null;
//     } catch (error) {
//       console.error('Lỗi parse dealerInfo:', error);
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
//         console.log('Bắt đầu tải dữ liệu báo giá...');

//         // 1. LẤY TẤT CẢ BÁO GIÁ
//         const quoteData = await ManageQuoteService.getAllQuotations();
//         console.log('getAllQuotations:', quoteData);

//         // 2. LỌC BÁO GIÁ THEO storeId (dùng dealerId)
//         const filteredByStore = [];
//         for (const quote of quoteData) {
//           try {
//             const dealer = await ManageDealerService.GetDealerById(quote.dealerId);
//             if (dealer?.storeId && Number(dealer.storeId) === dealerStoreId) {
//               filteredByStore.push({ ...quote, dealer });
//             }
//           } catch (error) {
//             console.warn(`Không thể lấy dealer ID ${quote.dealerId}:`, error);
//           }
//         }
//         console.log('filteredByStore:', filteredByStore);

//         // 3. LẤY DỮ LIỆU CHO FORM (chỉ theo store)
//         let customersByStore = [];
//         let vehiclesByStore = [];
//         let dealersByStore = [];

//         try {
//           [customersByStore, vehiclesByStore] = await Promise.all([
//             ManageCustomersService.getCustomerByStoreId(dealerStoreId),
//             ManageStorageService.getStorageVehiclesByStoreId(dealerStoreId),
//           ]);
//           console.log('customersByStore:', customersByStore);
//           console.log('vehiclesByStore:', vehiclesByStore);
//         } catch (error) {
//           console.error('Lỗi tải dữ liệu form:', error);
//           toast.warn('Không tải được khách hàng hoặc xe trong kho.');
//         }

//         // Lấy danh sách dealer theo store
//         try {
//           const allDealers = await ManageDealerService.getAllDealers();
//           dealersByStore = allDealers.filter(d => Number(d.storeId) === dealerStoreId);
//           console.log('dealersByStore:', dealersByStore);
//         } catch (error) {
//           console.error('Lỗi tải dealer:', error);
//         }

//         // 4. TẠO MAP CHO BẢNG (dùng vehiclesByStore để lấy tên xe)
//         const customerMap = new Map(customersByStore.map(c => [c.customerId, c.fullName]));
//         const vehicleMap = new Map(vehiclesByStore.map(v => [v.vehicleId, v.modelName]));
//         const dealerMap = new Map(dealersByStore.map(d => [d.dealerId, d.fullName]));

//         // 5. FORMAT DỮ LIỆU BẢNG
//         const formattedData = filteredByStore.map(item => ({
//           key: item.quoteId,
//           quoteId: item.quoteId,
//           customerName: customerMap.get(item.customerId) || 'N/A',
//           vehicleName: vehicleMap.get(item.vehicleId) || 'N/A',
//           dealerName: dealerMap.get(item.dealerId) || 'N/A',
//           quoteDate: item.quoteDate || 'N/A',
//           status: item.status || 'N/A',
//         }));

//         console.log('formattedData:', formattedData);

//         // 6. CẬP NHẬT STATE
//         setQuotations(formattedData);
//         setFilteredQuotations(formattedData);

//         setCustomers(customersByStore.map(c => ({ value: c.customerId, label: c.fullName })));
//         setVehicles(vehiclesByStore.map(v => ({ value: v.vehicleId, label: v.modelName })));
//         setDealers(dealersByStore.map(d => ({ value: d.dealerId, label: d.fullName })));

//         console.log('Tải dữ liệu thành công!');

//       } catch (error) {
//         console.error('Lỗi nghiêm trọng khi tải dữ liệu báo giá:', error);
//         toast.error('Không thể tải dữ liệu báo giá. Vui lòng thử lại.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // === TÌM KIẾM ===
//   useEffect(() => {
//     const filtered = quotations.filter(quote =>
//       quote.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
//       quote.vehicleName.toLowerCase().includes(searchText.toLowerCase())
//     );
//     setFilteredQuotations(filtered);
//     setCurrentPage(1);
//   }, [searchText, quotations]);

//   // === THÊM BÁO GIÁ ===
//   const handleAddQuote = async (values) => {
//     setLoading(true);
//     try {
//       const quoteData = {
//         customerId: values.customerId,
//         vehicleId: values.vehicleId,
//         dealerId: values.dealerId,
//         quoteDate: values.quoteDate.format('DD/MM/YYYY'),
//         status: values.status || 'Draft',
//       };

//       await ManageQuoteService.AddQuotation(quoteData);
//       toast.success('Thêm báo giá thành công!');

//       // REFRESH (gọi lại fetchData)
//       const fetchData = async () => {
//         const dealerStoreId = getDealerStoreId();
//         if (!dealerStoreId) return;

//         const quoteData = await ManageQuoteService.getAllQuotations();
//         const filteredByStore = [];
//         for (const quote of quoteData) {
//           try {
//             const dealer = await ManageDealerService.GetDealerById(quote.dealerId);
//             if (dealer?.storeId && Number(dealer.storeId) === dealerStoreId) {
//               filteredByStore.push({ ...quote, dealer });
//             }
//           } catch (error) {
//             console.warn(`Không thể lấy dealer ${quote.dealerId}:`, error);
//           }
//         }

//         const [customersByStore, vehiclesByStore] = await Promise.all([
//           ManageCustomersService.getCustomerByStoreId(dealerStoreId),
//           ManageStorageService.getStorageVehiclesByStoreId(dealerStoreId),
//         ]);

//         const dealersByStore = (await ManageDealerService.getAllDealers())
//           .filter(d => Number(d.storeId) === dealerStoreId);

//         const customerMap = new Map(customersByStore.map(c => [c.customerId, c.fullName]));
//         const vehicleMap = new Map(vehiclesByStore.map(v => [v.vehicleId, v.modelName]));
//         const dealerMap = new Map(dealersByStore.map(d => [d.dealerId, d.fullName]));

//         const formattedData = filteredByStore.map(item => ({
//           key: item.quoteId,
//           quoteId: item.quoteId,
//           customerName: customerMap.get(item.customerId) || 'N/A',
//           vehicleName: vehicleMap.get(item.vehicleId) || 'N/A',
//           dealerName: dealerMap.get(item.dealerId) || 'N/A',
//           quoteDate: item.quoteDate || 'N/A',
//           status: item.status || 'N/A',
//         }));

//         setQuotations(formattedData);
//         setFilteredQuotations(formattedData);
//         setCustomers(customersByStore.map(c => ({ value: c.customerId, label: c.fullName })));
//         setVehicles(vehiclesByStore.map(v => ({ value: v.vehicleId, label: v.modelName })));
//         setDealers(dealersByStore.map(d => ({ value: d.dealerId, label: d.fullName })));
//       };

//       await fetchData();
//       setIsModalVisible(false);
//       form.resetFields();

//     } catch (error) {
//       console.error('Lỗi thêm báo giá:', error);
//       toast.error('Thêm báo giá thất bại');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // === MODAL ===
//   const showModal = () => setIsModalVisible(true);
//   const handleCancel = () => {
//     setIsModalVisible(false);
//     form.resetFields();
//   };

//   // === CỘT BẢNG ===
//   const columns = [
//     { title: 'Quote ID', dataIndex: 'quoteId', key: 'quoteId', sorter: (a, b) => a.quoteId - b.quoteId },
//     { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName', sorter: (a, b) => a.customerName.localeCompare(b.customerName) },
//     { title: 'Mẫu xe', dataIndex: 'vehicleName', key: 'vehicleName', sorter: (a, b) => a.vehicleName.localeCompare(b.vehicleName) },
//     { title: 'Nhân viên', dataIndex: 'dealerName', key: 'dealerName', sorter: (a, b) => a.dealerName.localeCompare(b.dealerName) },
//     {
//       title: 'Ngày báo giá',
//       dataIndex: 'quoteDate',
//       key: 'quoteDate',
//       sorter: (a, b) => {
//         const parse = d => {
//           if (!d || d === 'N/A') return 0;
//           const [day, month, year] = d.split('/').map(Number);
//           return new Date(year, month - 1, day).getTime();
//         };
//         return parse(a.quoteDate) - parse(b.quoteDate);
//       },
//     },
//     {
//       title: 'Trạng thái',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status) => (
//         <Tag color={
//           status === 'Accepted' ? 'green' :
//           status === 'Sent' ? 'blue' :
//           status === 'Rejected' ? 'red' :
//           status === 'Draft' ? 'orange' : 'default'
//         }>
//           {status}
//         </Tag>
//       ),
//       sorter: (a, b) => a.status.localeCompare(b.status),
//     },
//   ];

//   const totalQuotations = filteredQuotations.length;
//   const startIndex = (currentPage - 1) * pageSize + 1;
//   const endIndex = Math.min(currentPage * pageSize, totalQuotations);

//   return (
//     <div>
//       <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
//         Quản lý báo giá
//       </Title>

//       <Row gutter={16} style={{ marginBottom: 16 }}>
//         <Col span={20}>
//           <Input
//             placeholder="Tìm theo tên khách hàng hoặc mẫu xe"
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             allowClear
//           />
//         </Col>
//         <Col span={4}>
//           <Button type="primary" onClick={showModal} style={{ width: '100%' }}>
//             Thêm báo giá
//           </Button>
//         </Col>
//       </Row>

//       <div style={{ marginBottom: 16, fontSize: 14, color: '#666' }}>
//         Hiển thị {startIndex} đến {endIndex} của {totalQuotations} báo giá
//       </div>

//       <Table
//         columns={columns}
//         dataSource={filteredQuotations}
//         loading={loading}
//         rowKey="key"
//         pagination={{
//           pageSize,
//           current: currentPage,
//           total: totalQuotations,
//           onChange: (page) => setCurrentPage(page),
//           showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} của ${total} báo giá`,
//         }}
//         bordered
//       />

// <Modal
//   title="Thêm báo giá mới"
//   open={isModalVisible}
//   onCancel={handleCancel}
//   footer={null}
//   width={600}
// >
//   <Form form={form} layout="vertical" onFinish={handleAddQuote}>
//     <Form.Item name="customerId" label="Khách hàng" rules={[{ required: true, message: 'Vui lòng chọn khách hàng!' }]}>
//       <Select showSearch placeholder="Chọn khách hàng" options={customers} loading={loading} />
//     </Form.Item>

//     <Form.Item name="vehicleId" label="Mẫu xe" rules={[{ required: true, message: 'Vui lòng chọn mẫu xe!' }]}>
//       <Select showSearch placeholder="Chọn mẫu xe" options={vehicles} loading={loading} />
//     </Form.Item>

//     <Form.Item name="dealerId" label="Nhân viên" rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}>
//       <Select showSearch placeholder="Chọn nhân viên" options={dealers} loading={loading} />
//     </Form.Item>

//     <Form.Item name="quoteDate" label="Ngày báo giá" rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
//       <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
//     </Form.Item>

//     <Form.Item name="status" label="Trạng thái" initialValue="Draft">
//       <Select>
//         <Select.Option value="Draft">Draft</Select.Option>
//         <Select.Option value="Sent">Sent</Select.Option>
//         <Select.Option value="Accepted">Accepted</Select.Option>
//         <Select.Option value="Rejected">Rejected</Select.Option>
//       </Select>
//     </Form.Item>

//     <Form.Item>
//       <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
//         Thêm báo giá
//       </Button>
//       <Button onClick={handleCancel}>Hủy</Button>
//     </Form.Item>
//   </Form>
// </Modal>
//     </div>
//   );
// };

// export default Quotation;

// put quote
// src/components/quotation/Quotation.jsx
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
//   Row,
//   Col,
//   Tag,
//   Space,
// } from 'antd';
// import ManageQuoteService from '../../../services/ManageQuotes/ManageQuoteService';
// import ManageDealerService from '../../../services/ManageDealer/ManageDealerService';
// import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
// import ManageStorageService from '../../../services/ManageStorage/ManageStorageService';
// import { toast } from 'react-toastify';

// const { Title } = Typography;

// const Quotation = () => {
//   const [quotations, setQuotations] = useState([]);
//   const [filteredQuotations, setFilteredQuotations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isAddModalVisible, setIsAddModalVisible] = useState(false);
//   const [isEditModalVisible, setIsEditModalVisible] = useState(false);
//   const [editingQuote, setEditingQuote] = useState(null); // Dữ liệu đang edit
//   const [customers, setCustomers] = useState([]);
//   const [vehicles, setVehicles] = useState([]);
//   const [dealers, setDealers] = useState([]);
//   const [searchText, setSearchText] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [addForm] = Form.useForm();
//   const [editForm] = Form.useForm();

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
//         const quoteData = await ManageQuoteService.getAllQuotations();

//         const filteredByStore = [];
//         for (const quote of quoteData) {
//           try {
//             const dealer = await ManageDealerService.GetDealerById(quote.dealerId);
//             if (dealer?.storeId && Number(dealer.storeId) === dealerStoreId) {
//               filteredByStore.push({ ...quote, dealer });
//             }
//           } catch (error) {
//             console.warn(`Không thể lấy dealer ID ${quote.dealerId}:`, error);
//           }
//         }

//         const [customersByStore, vehiclesByStore] = await Promise.all([
//           ManageCustomersService.getCustomerByStoreId(dealerStoreId),
//           ManageStorageService.getStorageVehiclesByStoreId(dealerStoreId),
//         ]);

//         const dealersByStore = (await ManageDealerService.getAllDealers())
//           .filter(d => Number(d.storeId) === dealerStoreId);

//         const customerMap = new Map(customersByStore.map(c => [c.customerId, c.fullName]));
//         const vehicleMap = new Map(vehiclesByStore.map(v => [v.vehicleId, v.modelName]));
//         const dealerMap = new Map(dealersByStore.map(d => [d.dealerId, d.fullName]));

//         const formattedData = filteredByStore.map(item => ({
//           key: item.quoteId,
//           quoteId: item.quoteId,
//           customerName: customerMap.get(item.customerId) || 'N/A',
//           vehicleName: vehicleMap.get(item.vehicleId) || 'N/A',
//           dealerName: dealerMap.get(item.dealerId) || 'N/A',
//           quoteDate: item.quoteDate || 'N/A',
//           status: item.status || 'N/A',
//         }));

//         setQuotations(formattedData);
//         setFilteredQuotations(formattedData);
//         setCustomers(customersByStore.map(c => ({ value: c.customerId, label: c.fullName })));
//         setVehicles(vehiclesByStore.map(v => ({ value: v.vehicleId, label: v.modelName })));
//         setDealers(dealersByStore.map(d => ({ value: d.dealerId, label: d.fullName })));

//       } catch (error) {
//         console.error('Lỗi tải dữ liệu:', error);
//         toast.error('Không thể tải dữ liệu báo giá');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // === TÌM KIẾM ===
//   useEffect(() => {
//     const filtered = quotations.filter(quote =>
//       quote.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
//       quote.vehicleName.toLowerCase().includes(searchText.toLowerCase())
//     );
//     setFilteredQuotations(filtered);
//     setCurrentPage(1);
//   }, [searchText, quotations]);

//   // === MỞ MODAL THÊM ===
//   const showAddModal = () => setIsAddModalVisible(true);
//   const hideAddModal = () => {
//     setIsAddModalVisible(false);
//     addForm.resetFields();
//   };

//   // === MỞ MODAL EDIT ===
//   const handleEdit = async (quoteId) => {
//     try {
//       setLoading(true);
//       const quote = await ManageQuoteService.GetQuotationById(quoteId);
//       setEditingQuote(quote);
//       editForm.setFieldsValue({ status: quote.status });
//       setIsEditModalVisible(true);
//     } catch (error) {
//       toast.error('Không thể tải thông tin báo giá');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const hideEditModal = () => {
//     setIsEditModalVisible(false);
//     setEditingQuote(null);
//     editForm.resetFields();
//   };

//   // === THÊM BÁO GIÁ ===
//   const handleAddQuote = async (values) => {
//     setLoading(true);
//     try {
//       const quoteData = {
//         customerId: values.customerId,
//         vehicleId: values.vehicleId,
//         dealerId: values.dealerId,
//         quoteDate: values.quoteDate.format('DD/MM/YYYY'),
//         status: values.status || 'Draft',
//       };

//       await ManageQuoteService.AddQuotation(quoteData);
//       toast.success('Thêm báo giá thành công!');
//       hideAddModal();
//       // Refresh
//       window.location.reload(); // Đơn giản nhất
//     } catch (error) {
//       toast.error('Thêm báo giá thất bại');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // === CẬP NHẬT STATUS ===
//   const handleUpdateStatus = async (values) => {
//     if (!editingQuote) return;

//     setLoading(true);
//     try {
//       const updateData = {
//         customerId: editingQuote.customerId,
//         vehicleId: editingQuote.vehicleId,
//         dealerId: editingQuote.dealerId,
//         quoteDate: editingQuote.quoteDate,
//         status: values.status,
//       };

//       await ManageQuoteService.EditQuotation(editingQuote.quoteId, updateData);
//       toast.success('Cập nhật trạng thái thành công!');

//       // Refresh bảng
//       const updatedQuote = { ...editingQuote, status: values.status };
//       const updatedList = quotations.map(q =>
//         q.quoteId === updatedQuote.quoteId
//           ? { ...q, status: updatedQuote.status }
//           : q
//       );
//       setQuotations(updatedList);
//       setFilteredQuotations(updatedList);

//       hideEditModal();
//     } catch (error) {
//       toast.error('Cập nhật thất bại');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // === CỘT BẢNG ===
//   const columns = [
//     { title: 'Quote ID', dataIndex: 'quoteId', key: 'quoteId', sorter: (a, b) => a.quoteId - b.quoteId },
//     { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
//     { title: 'Mẫu xe', dataIndex: 'vehicleName', key: 'vehicleName' },
//     { title: 'Nhân viên', dataIndex: 'dealerName', key: 'dealerName' },
//     { title: 'Ngày báo giá', dataIndex: 'quoteDate', key: 'quoteDate' },
//     {
//       title: 'Trạng thái',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status) => (
//         <Tag color={
//           status === 'Accepted' ? 'green' :
//           status === 'Sent' ? 'blue' :
//           status === 'Rejected' ? 'red' :
//           status === 'Draft' ? 'orange' : 'default'
//         }>
//           {status}
//         </Tag>
//       ),
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (_, record) => (
//         <Space size="middle">
//           <Button className='btn btn-outline-primary' type="link" onClick={() => handleEdit(record.quoteId)} >
//             Edit
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   const totalQuotations = filteredQuotations.length;

//   return (
//     <div>
//       <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
//         Quản lý báo giá
//       </Title>

//       <Row gutter={16} style={{ marginBottom: 16 }}>
//         <Col span={20}>
//           <Input
//             placeholder="Tìm theo tên khách hàng hoặc mẫu xe"
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             allowClear
//           />
//         </Col>
//         <Col span={4}>
//           <Button type="primary" onClick={showAddModal} style={{ width: '100%' }}>
//             Thêm báo giá
//           </Button>
//         </Col>
//       </Row>


//       <Table
//         columns={columns}
//         dataSource={filteredQuotations}
//         loading={loading}
//         rowKey="key"
//         pagination={{
//           pageSize,
//           current: currentPage,
//           total: totalQuotations,
//           onChange: (page) => setCurrentPage(page),
//           showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} của ${total} báo giá`,
//         }}
//         bordered
//       />

//       {/* MODAL THÊM */}
//       <Modal
//         title="Thêm báo giá mới"
//         open={isAddModalVisible}
//         onCancel={hideAddModal}
//         footer={null}
//         width={600}
//       >
//         <Form form={addForm} layout="vertical" onFinish={handleAddQuote}>
//           <Form.Item name="customerId" label="Khách hàng" rules={[{ required: true }]}>
//             <Select showSearch placeholder="Chọn khách hàng" options={customers} loading={loading} />
//           </Form.Item>
//           <Form.Item name="vehicleId" label="Mẫu xe" rules={[{ required: true }]}>
//             <Select showSearch placeholder="Chọn mẫu xe" options={vehicles} loading={loading} />
//           </Form.Item>
//           <Form.Item name="dealerId" label="Nhân viên" rules={[{ required: true }]}>
//             <Select showSearch placeholder="Chọn nhân viên" options={dealers} loading={loading} />
//           </Form.Item>
//           <Form.Item name="quoteDate" label="Ngày báo giá" rules={[{ required: true }]}>
//             <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
//           </Form.Item>
//           <Form.Item name="status" label="Trạng thái" initialValue="Draft">
//             <Select>
//               <Select.Option value="Draft">Draft</Select.Option>
//               <Select.Option value="Sent">Sent</Select.Option>
//               <Select.Option value="Accepted">Accepted</Select.Option>
//               <Select.Option value="Rejected">Rejected</Select.Option>
//             </Select>
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
//               Thêm
//             </Button>
//             <Button onClick={hideAddModal}>Hủy</Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* MODAL EDIT STATUS */}
//       <Modal
//         title={`Cập nhật trạng thái - Quote #${editingQuote?.quoteId}`}
//         open={isEditModalVisible}
//         onCancel={hideEditModal}
//         footer={null}
//         width={500}
//       >
//         <Form form={editForm} layout="vertical" onFinish={handleUpdateStatus}>
//           <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
//             <Select>
//               <Select.Option value="Draft">Draft</Select.Option>
//               <Select.Option value="Sent">Sent</Select.Option>
//               <Select.Option value="Accepted">Accepted</Select.Option>
//               <Select.Option value="Rejected">Rejected</Select.Option>
//             </Select>
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
//               Cập nhật
//             </Button>
//             <Button onClick={hideEditModal}>Hủy</Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default Quotation;

//----------------------------------------------------------------------------------//

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
  Row,
  Col,
  Tag,
  Space,
} from 'antd';
import ManageQuoteService from '../../../services/ManageQuotes/ManageQuoteService';
import ManageDealerService from '../../../services/ManageDealer/ManageDealerService';
import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
import ManageStorageService from '../../../services/ManageStorage/ManageStorageService';
import { toast } from 'react-toastify';

const { Title } = Typography;

const Quotation = () => {
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null); // Editing data
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

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
        const quoteData = await ManageQuoteService.getAllQuotations();

        const filteredByStore = [];
        for (const quote of quoteData) {
          try {
            const dealer = await ManageDealerService.GetDealerById(quote.dealerId);
            if (dealer?.storeId && Number(dealer.storeId) === dealerStoreId) {
              filteredByStore.push({ ...quote, dealer });
            }
          } catch (error) {
            console.warn(`Unable to get dealer ID ${quote.dealerId}:`, error);
          }
        }

        const [customersByStore, vehiclesByStore] = await Promise.all([
          ManageCustomersService.getCustomerByStoreId(dealerStoreId),
          ManageStorageService.getStorageVehiclesByStoreId(dealerStoreId),
        ]);

        const dealersByStore = (await ManageDealerService.getAllDealers())
          .filter(d => Number(d.storeId) === dealerStoreId);

        const customerMap = new Map(customersByStore.map(c => [c.customerId, c.fullName]));
        const vehicleMap = new Map(vehiclesByStore.map(v => [v.vehicleId, v.modelName]));
        const dealerMap = new Map(dealersByStore.map(d => [d.dealerId, d.fullName]));

        const formattedData = filteredByStore.map(item => ({
          key: item.quoteId,
          quoteId: item.quoteId,
          customerName: customerMap.get(item.customerId) || 'N/A',
          vehicleName: vehicleMap.get(item.vehicleId) || 'N/A',
          dealerName: dealerMap.get(item.dealerId) || 'N/A',
          quoteDate: item.quoteDate || 'N/A',
          status: item.status || 'N/A',
        }));

        setQuotations(formattedData);
        setFilteredQuotations(formattedData);
        setCustomers(customersByStore.map(c => ({ value: c.customerId, label: c.fullName })));
        setVehicles(vehiclesByStore.map(v => ({ value: v.vehicleId, label: v.modelName })));
        setDealers(dealersByStore.map(d => ({ value: d.dealerId, label: d.fullName })));

      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Unable to load quotation data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // === SEARCH ===
  useEffect(() => {
    const filtered = quotations.filter(quote =>
      quote.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      quote.vehicleName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredQuotations(filtered);
    setCurrentPage(1);
  }, [searchText, quotations]);

  // === OPEN ADD MODAL ===
  const showAddModal = () => setIsAddModalVisible(true);
  const hideAddModal = () => {
    setIsAddModalVisible(false);
    addForm.resetFields();
  };

  // === OPEN EDIT MODAL ===
  const handleEdit = async (quoteId) => {
    try {
      setLoading(true);
      const quote = await ManageQuoteService.GetQuotationById(quoteId);
      setEditingQuote(quote);
      editForm.setFieldsValue({ status: quote.status });
      setIsEditModalVisible(true);
    } catch (error) {
      toast.error('Unable to load quotation information');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const hideEditModal = () => {
    setIsEditModalVisible(false);
    setEditingQuote(null);
    editForm.resetFields();
  };

  // === ADD QUOTATION ===
  const handleAddQuote = async (values) => {
    setLoading(true);
    try {
      const quoteData = {
        customerId: values.customerId,
        vehicleId: values.vehicleId,
        dealerId: values.dealerId,
        quoteDate: values.quoteDate.format('DD/MM/YYYY'),
        status: values.status || 'Draft',
      };

      await ManageQuoteService.AddQuotation(quoteData);
      toast.success('Quotation added successfully!');
      hideAddModal();
      // Refresh
      window.location.reload(); // Simplest way
    } catch (error) {
      toast.error('Failed to add quotation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // === UPDATE STATUS ===
  const handleUpdateStatus = async (values) => {
    if (!editingQuote) return;

    setLoading(true);
    try {
      const updateData = {
        customerId: editingQuote.customerId,
        vehicleId: editingQuote.vehicleId,
        dealerId: editingQuote.dealerId,
        quoteDate: editingQuote.quoteDate,
        status: values.status,
      };

      await ManageQuoteService.EditQuotation(editingQuote.quoteId, updateData);
      toast.success('Status updated successfully!');

      // Refresh table
      const updatedQuote = { ...editingQuote, status: values.status };
      const updatedList = quotations.map(q =>
        q.quoteId === updatedQuote.quoteId
          ? { ...q, status: updatedQuote.status }
          : q
      );
      setQuotations(updatedList);
      setFilteredQuotations(updatedList);

      hideEditModal();
    } catch (error) {
      toast.error('Update failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // === TABLE COLUMNS ===
  const columns = [
    { title: 'Quote ID', dataIndex: 'quoteId', key: 'quoteId', sorter: (a, b) => a.quoteId - b.quoteId },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Vehicle Model', dataIndex: 'vehicleName', key: 'vehicleName' },
    { title: 'Employee', dataIndex: 'dealerName', key: 'dealerName' },
    { title: 'Quote Date', dataIndex: 'quoteDate', key: 'quoteDate' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'Accepted' ? 'green' :
            status === 'Sent' ? 'blue' :
              status === 'Rejected' ? 'red' :
                status === 'Draft' ? 'orange' : 'default'
        }>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              onClick={() => handleEdit(record.quoteId)}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',  // Tím cho Edit
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.875rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Edit
            </Button>
          </div>
        </Space>
      ),
    },
  ];

  const totalQuotations = filteredQuotations.length;

  return (
    <div>
      <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
        Quotation Management
      </Title>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={20}>
          <Input
            placeholder="Search by customer name or vehicle model"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
        <Col span={4}>
          <Button type="primary" onClick={showAddModal} style={{ width: '100%' }}>
            Add Quotation
          </Button>
        </Col>
      </Row>


      <Table
        columns={columns}
        dataSource={filteredQuotations}
        loading={loading}
        rowKey="key"
        pagination={{
          pageSize,
          current: currentPage,
          total: totalQuotations,
          onChange: (page) => setCurrentPage(page),
          showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} quotations`,
        }}
        bordered
      />

      {/* ADD MODAL */}
      <Modal
        title="Add New Quotation"
        open={isAddModalVisible}
        onCancel={hideAddModal}
        footer={null}
        width={600}
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddQuote}>
          <Form.Item name="customerId" label="Customer" rules={[{ required: true }]}>
            <Select showSearch placeholder="Select customer" options={customers} loading={loading} />
          </Form.Item>
          <Form.Item name="vehicleId" label="Vehicle Model" rules={[{ required: true }]}>
            <Select showSearch placeholder="Select vehicle model" options={vehicles} loading={loading} />
          </Form.Item>
          <Form.Item name="dealerId" label="Employee" rules={[{ required: true }]}>
            <Select showSearch placeholder="Select employee" options={dealers} loading={loading} />
          </Form.Item>
          <Form.Item name="quoteDate" label="Quote Date" rules={[{ required: true }]}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="Draft">
            <Select>
              <Select.Option value="Draft">Draft</Select.Option>
              <Select.Option value="Sent">Sent</Select.Option>
              <Select.Option value="Accepted">Accepted</Select.Option>
              <Select.Option value="Rejected">Rejected</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
              Add
            </Button>
            <Button onClick={hideAddModal}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* EDIT STATUS MODAL */}
      <Modal
        title={`Update Status - Quote #${editingQuote?.quoteId}`}
        open={isEditModalVisible}
        onCancel={hideEditModal}
        footer={null}
        width={500}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdateStatus}>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Draft">Draft</Select.Option>
              <Select.Option value="Sent">Sent</Select.Option>
              <Select.Option value="Accepted">Accepted</Select.Option>
              <Select.Option value="Rejected">Rejected</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
              Update
            </Button>
            <Button onClick={hideEditModal}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Quotation;