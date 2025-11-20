
// import React, { useState, useEffect, useCallback, useRef } from 'react';
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
//   Popconfirm,
// } from 'antd';
// import ManageQuoteService from '../../../services/ManageQuotes/ManageQuoteService';
// import ManageDealerService from '../../../services/ManageDealer/ManageDealerService';
// import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
// import ManageStorageService from '../../../services/ManageStorage/ManageStorageService';
// import ManageServicePromotions from '../../../services/ManagePromotions/ManageServicePromotions';
// import ManageVehicleService from '../../../services/ManageVehicleService/ManageVehicleService';
// import { toast } from 'react-toastify';
// import dayjs from 'dayjs';
// import ListCusGetQuote from './ListCusGetQuote';

// const { Title, Text } = Typography;

// // Helper: Format currency VND
// const formatCurrency = (value) => {
//   if (value === null || value === undefined) return 'N/A';
//   return new Intl.NumberFormat('vi-VN', {
//     style: 'currency',
//     currency: 'VND',
//     minimumFractionDigits: 0,
//   }).format(value);
// };

// const Quotation = () => {
//   const [quotations, setQuotations] = useState([]);
//   const [filteredQuotations, setFilteredQuotations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isAddModalVisible, setIsAddModalVisible] = useState(false);
//   const [isEditModalVisible, setIsEditModalVisible] = useState(false);
//   const [editingQuote, setEditingQuote] = useState(null);
//   const [customers, setCustomers] = useState([]);
//   const [vehicles, setVehicles] = useState([]);
//   const [dealers, setDealers] = useState([]);
//   const [searchText, setSearchText] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [addForm] = Form.useForm();
//   const [editForm] = Form.useForm();
// const listCusGetQuoteRef = useRef();
// const [promotionMap, setPromotionMap] = useState({}); // { promotionId: discountPercent }
// const [promotions, setPromotions] = useState([]);
//   // Lưu giá xe theo vehicleId để tính priceWithTax
//   const [vehiclePriceMap, setVehiclePriceMap] = useState({});

//   // Force re-render khi priceWithTax thay đổi
//   const [priceWithTaxDisplay, setPriceWithTaxDisplay] = useState('Choose vehicle and tax rate');

//   // Get storeId from localStorage
//   const getDealerStoreId = () => {
//     try {
//       const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
//       return dealerInfo.storeId ? Number(dealerInfo.storeId) : null;
//     } catch {
//       return null;
//     }
//   };

//   // === TÁI SỬ DỤNG HÀM FETCH ===
//  const fetchData = useCallback(async () => {
//   setLoading(true);
//   const dealerStoreId = getDealerStoreId();

//   if (!dealerStoreId) {
//     toast.error('Store information not found. Please log in again.');
//     setLoading(false);
//     return;
//   }

//   try {
//     const quoteData = await ManageQuoteService.getAllQuotations();

//     const filteredByStore = [];
//     for (const quote of quoteData) {
//       try {
//         const dealer = await ManageDealerService.GetDealerById(quote.dealerId);
//         if (dealer?.storeId && Number(dealer.storeId) === dealerStoreId) {
//           filteredByStore.push({ ...quote, dealer });
//         }
//       } catch (error) {
//         console.warn(`Unable to get dealer ID ${quote.dealerId}:`, error);
//       }
//     }

//     // === FETCH PROMOTIONS ===
//     const promotionIds = [...new Set(filteredByStore.map(q => q.promotionId).filter(id => id != null))];
//     const promotionPromises = promotionIds.map(id => 
//       ManageServicePromotions.getPromotionById(id).catch(err => {
//         console.warn(`Failed to load promotion ${id}:`, err);
//         return null;
//       })
//     );
//     const promotions = await Promise.all(promotionPromises);

//     const promoMap = {};
//     promotions.forEach(promo => {
//       if (promo) {
//         promoMap[promo.promotionId] = promo.discountPercent;
//       }
//     });
//     setPromotionMap(promoMap);

//     // === FETCH CUSTOMERS + STORAGE VEHICLES (for price & dropdown) ===
//     const [customersByStore, storageVehicles] = await Promise.all([
//       ManageCustomersService.getCustomerByStoreId(dealerStoreId),
//       ManageStorageService.getStorageVehiclesByStoreId(dealerStoreId), // RE-ADDED
//     ]);
//     // === FETCH PROMOTIONS FOR CURRENT STORE ===
// const allPromotions = await ManageServicePromotions.getAllPromotions();
// const storePromotions = allPromotions.filter(p => p.storeId === dealerStoreId);
// setPromotions(storePromotions.map(p => ({
//   value: p.promotionId,
//   label: `${p.title} (${p.discountPercent}% off)`,
// })));

//     // === FETCH DEALERS ===
//     const dealersByStore = (await ManageDealerService.getAllDealers())
//       .filter(d => Number(d.storeId) === dealerStoreId);

//     // === FETCH VEHICLE MODEL NAMES (for display in table) ===
//     const vehicleIds = [...new Set(filteredByStore.map(q => q.vehicleId))];
//     const vehiclePromises = vehicleIds.map(id => 
//       ManageVehicleService.GetVehicleById(id).catch(err => {
//         console.warn(`Failed to load vehicle ${id}:`, err);
//         return null;
//       })
//     );
//     const vehiclesData = await Promise.all(vehiclePromises);

//     const vehicleDisplayMap = new Map(); // For table display
//     vehiclesData.forEach(v => {
//       if (v) {
//         vehicleDisplayMap.set(v.vehicleId, v.modelName);
//       }
//     });

//     // === MAPS ===
//     const customerMap = new Map(customersByStore.map(c => [c.customerId, c.fullName]));
//     const dealerMap = new Map(dealersByStore.map(d => [d.dealerId, d.fullName]));

//     // === PRICE MAP FROM STORAGE (for priceWithTax & Add Modal) ===
//     const priceMap = {};
//     storageVehicles.forEach(v => {
//       priceMap[v.vehicleId] = v.price || 0;
//     });
//     setVehiclePriceMap(priceMap);

//     // === FORMATTED DATA ===
//     const formattedData = filteredByStore.map(item => ({
//       key: item.quoteId,
//       quoteId: item.quoteId,
//       customerName: customerMap.get(item.customerId) || 'N/A',
//       vehicleName: vehicleDisplayMap.get(item.vehicleId) || 'Unknown Model', // From GetVehicleById
//       dealerName: dealerMap.get(item.dealerId) || 'N/A',
//       quoteDate: item.quoteDate || 'N/A',
//       status: item.status || 'N/A',
//       vehiclePrice: item.vehiclePrice ?? priceMap[item.vehicleId] ?? null,
//       priceWithTax: item.priceWithTax ?? null,
//       taxRate: item.taxRate ?? null,
//       promotionId: item.promotionId,
//     }));

//     setQuotations(formattedData);
//     setFilteredQuotations(formattedData);

//     // === SET DROPDOWNS ===
//     setCustomers(customersByStore.map(c => ({ value: c.customerId, label: c.fullName })));
//     setVehicles(storageVehicles.map(v => ({ value: v.vehicleId, label: v.modelName }))); // For Add Modal
//     setDealers(dealersByStore.map(d => ({ value: d.dealerId, label: d.fullName })));

//   } catch (error) {
//     console.error('Error loading data:', error);
//     toast.error('Unable to load quotation data');
//   } finally {
//     setLoading(false);
//   }
// }, []);
//   // === LOAD DATA ===
//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // === SEARCH ===
//   useEffect(() => {
//     const filtered = quotations.filter(quote =>
//       quote.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
//       quote.vehicleName.toLowerCase().includes(searchText.toLowerCase()) ||
//       quote.quoteId.toString().includes(searchText)
//     );
//     setFilteredQuotations(filtered);
//     setCurrentPage(1);
//   }, [searchText, quotations]);

//   // === TÍNH priceWithTax KHI THAY ĐỔI vehicleId HOẶC taxRate ===
// const updatePriceWithTax = () => {
//   const values = addForm.getFieldsValue();
//   const vehicleId = values.vehicleId;
//   const taxRate = values.taxRate;
//   const promotionId = values.promotionId;

//   let display = 'Choose vehicle and tax rate';
//   if (vehicleId && taxRate !== undefined) {
//     const basePrice = vehiclePriceMap[vehicleId] || 0;
//     let finalPrice = basePrice;

//     if (promotionId) {
//       const promo = promotions.find(p => p.value === promotionId);
//       if (promo) {
//         const discount = parseInt(promo.label.match(/\((\d+)%/)[1], 10);
//         finalPrice = basePrice * (1 - discount / 100);
//       }
//     }

//     const priceWithTax = Math.round(finalPrice * (1 + taxRate / 100));
//     addForm.setFieldsValue({ priceWithTax });
//     display = formatCurrency(priceWithTax);
//   } else {
//     addForm.setFieldsValue({ priceWithTax: undefined });
//   }

//   setPriceWithTaxDisplay(display);
// };

//   // === OPEN ADD MODAL ===
//   const showAddModal = () => {
//     addForm.setFieldsValue({
//       quoteDate: dayjs(),
//       status: 'Accepted',
//       priceWithTax: undefined,
//     });
//     setPriceWithTaxDisplay('Choose vehicle and tax rate');
//     setIsAddModalVisible(true);
//   };

//   const hideAddModal = () => {
//     setIsAddModalVisible(false);
//     addForm.resetFields();
//     setPriceWithTaxDisplay('N/A');
//   };

//   // === OPEN EDIT MODAL ===
//   const handleEdit = async (quoteId) => {
//     try {
//       setLoading(true);
//       const quote = await ManageQuoteService.GetQuotationById(quoteId);
//       setEditingQuote(quote);
//       editForm.setFieldsValue({ status: quote.status });
//       setIsEditModalVisible(true);
//     } catch (error) {
//       toast.error('Unable to load quotation information');
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

//   // === XÓA QUOTATION ===
//   const handleDelete = async (quoteId) => {
//     setLoading(true);
//     try {
//       await ManageQuoteService.DeleteQuotation(quoteId);
//       toast.success('Quotation deleted successfully!');

//       const updatedList = quotations.filter(q => q.quoteId !== quoteId);
//       setQuotations(updatedList);
//       setFilteredQuotations(updatedList);
//     } catch (error) {
//       toast.error('Failed to delete quotation');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // === CẬP NHẬT STATUS KHÁCH HÀNG SAU KHI TẠO QUOTE ===
//   const updateCustomerStatusToAccept = async (customerId) => {
//     try {
//       const currentCustomer = await ManageCustomersService.GetCustomerById(customerId);
//       if (!currentCustomer) return;

//       // Chỉ cập nhật nếu status hiện tại là Pending
//       if (currentCustomer.status === 'Pending') {
//         const updatePayload = {
//           ...currentCustomer,
//           customerId: customerId,
//           status: 'Accept',
//           storeId: currentCustomer.storeId,
//         };

//         await ManageCustomersService.editCustomer(customerId, updatePayload);
//         toast.success('Customer status updated to Accepted');
//       }
//     } catch (error) {
//       console.error('Failed to update customer status:', error);
//       toast.warn('Quote created but customer status not updated');
//     }
//   };

//   // === ADD QUOTATION (VỚI CẬP NHẬT STATUS) ===
//  const handleAddQuote = async (values) => {
//     setLoading(true);
//     try {
//       const quoteData = {
//           customerId: values.customerId,
//           vehicleId: values.vehicleId,
//           dealerId: values.dealerId,
//           promotionId: values.promotionId || null,
//           taxRate: values.taxRate,
//           quoteDate: values.quoteDate.format('DD/MM/YYYY'),
//           status: values.status || 'Draft',
//         };

//       const newQuote = await ManageQuoteService.AddQuotation(quoteData);

//       // CẬP NHẬT STATUS KHÁCH HÀNG
//       await updateCustomerStatusToAccept(values.customerId);

//       toast.success('Quotation added successfully!');

//       // ... format newQuoteFormatted như cũ
//       const basePrice = vehiclePriceMap[values.vehicleId] || 0;
//       const priceWithTax = Math.round(basePrice * (1 + values.taxRate / 100));
//       const customerName = customers.find(c => c.value === values.customerId)?.label || 'N/A';
//       const vehicleName = vehicles.find(v => v.value === values.vehicleId)?.label || 'N/A';
//       const dealerName = dealers.find(d => d.value === values.dealerId)?.label || 'N/A';

//       const newQuoteFormatted = {
//         key: newQuote.quoteId,
//         quoteId: newQuote.quoteId,
//         customerName,
//         vehicleName,
//         dealerName,
//         quoteDate: values.quoteDate.format('DD/MM/YYYY'),
//         status: values.status || 'Draft',
//         vehiclePrice: basePrice,
//         priceWithTax,
//         taxRate: values.taxRate,
//       };

//       const updatedList = [newQuoteFormatted, ...quotations];
//       setQuotations(updatedList);
//       setFilteredQuotations(updatedList);

//       hideAddModal();

//       // RELOAD LIST CUS GET QUOTE
//       listCusGetQuoteRef.current?.reload();

//     } catch (error) {
//       toast.error('Failed to add quotation');
//       console.error(error);
//     } finally {
//       setLoading(false);
//       fetchData();
//     }
//   };

//   // === UPDATE STATUS ===
//   const handleUpdateStatus = async (values) => {
//     if (!editingQuote) return;

//     setLoading(true);
//     try {
//       const updateData = {
//         customerId: editingQuote.customerId,
//         vehicleId: editingQuote.vehicleId,
//         dealerId: editingQuote.dealerId,
//         taxRate: editingQuote.taxRate,
//         quoteDate: editingQuote.quoteDate,
//         status: values.status,
//       };

//       await ManageQuoteService.EditQuotation(editingQuote.quoteId, updateData);
//       toast.success('Status updated successfully!');

//       const updatedList = quotations.map(q =>
//         q.quoteId === editingQuote.quoteId
//           ? { ...q, status: values.status }
//           : q
//       );
//       setQuotations(updatedList);
//       setFilteredQuotations(updatedList);

//       hideEditModal();
//     } catch (error) {
//       toast.error('Update failed');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // === TABLE COLUMNS ===
//   const columns = [
//     { title: 'Quote ID', dataIndex: 'quoteId', key: 'quoteId', sorter: (a, b) => a.quoteId - b.quoteId },
//     { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
//     { title: 'Vehicle Model', dataIndex: 'vehicleName', key: 'vehicleName' },
//     { title: 'Employee', dataIndex: 'dealerName', key: 'dealerName' },
//     { title: 'Quote Date', dataIndex: 'quoteDate', key: 'quoteDate' },
    
//     {
//       title: 'Vehicle Price (VND)',
//       dataIndex: 'vehiclePrice',
//       key: 'vehiclePrice',
//       render: formatCurrency,
//       sorter: (a, b) => (a.vehiclePrice || 0) - (b.vehiclePrice || 0),
//       align: 'right',
//     },
   
//     {
//       title: 'Tax Rate (%)',
//       dataIndex: 'taxRate',
//       key: 'taxRate',
//       render: (rate) => rate !== null ? `${rate}%` : 'N/A',
//       sorter: (a, b) => (a.taxRate || 0) - (b.taxRate || 0),
//       align: 'center',
//     },
//     // === ADD COLUMN ===
// {
//   title: 'Discount Promotion',
//   key: 'discountPromotion',
//   align: 'center',
//   render: (_, record) => {
//     if (!record.promotionId) {
//       return <Tag color="default">No Promotion</Tag>;
//     }
//     const discount = promotionMap[record.promotionId];
//     if (discount === undefined) {
//       return <Tag color="orange">Loading...</Tag>;
//     }
//     return <Tag color="green">{discount}%</Tag>;
//   },
// },
//  {
//       title: 'Price with Tax (VND)',
//       dataIndex: 'priceWithTax',
//       key: 'priceWithTax',
//       render: formatCurrency,
//       sorter: (a, b) => (a.priceWithTax || 0) - (b.priceWithTax || 0),
//       align: 'right',
//       defaultSortOrder: 'descend',
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status) => (
//         <Tag color={
//           status === 'Accepted' ? 'green' :
//             status === 'Sent' ? 'blue' :
//               status === 'Rejected' ? 'red' :
//                 status === 'Draft' ? 'orange' : 'default'
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
//           <Button
//             onClick={() => handleEdit(record.quoteId)}
//             style={{
//               background: 'linear-gradient(135deg, #ec6e07ff 0%, #ceb24fff 100%)',
//               border: 'none',
//               borderRadius: '8px',
//               color: 'white',
//               fontSize: '0.875rem',
//               boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//             }}
//             onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
//             onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
//           >
//             Edit
//           </Button>
//           <Popconfirm
//             title="Delete this quotation?"
//             description="This action cannot be undone."
//             onConfirm={() => handleDelete(record.quoteId)}
//             okText="Yes, Delete"
//             cancelText="Cancel"
//             okButtonProps={{ danger: true }}
//           >
//             <Button
//               danger
//               style={{
//                 background: 'linear-gradient(135deg, #ff1f01ff 0%, #df9292ff 100%)',
//                 border: 'none',
//                 borderRadius: '8px',
//                 color: 'white',
//                 fontSize: '0.875rem',
//                 boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//               }}
//             >
//               Delete
//             </Button>
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   const totalQuotations = filteredQuotations.length;

//   return (
//     <div>
//      <ListCusGetQuote ref={listCusGetQuoteRef} />

//       <Row gutter={16} style={{ marginBottom: 16 }}>
//         <Col span={20}>
//           <Input
//             placeholder="Search by customer name or vehicle model"
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             allowClear
//           />
//         </Col>
//         <Col span={4}>
//           <Button type="primary" onClick={showAddModal} style={{ width: '100%' }}>
//             Add Quotation
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
//           showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} quotations`,
//         }}
//         bordered
//         style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
//       />

//       {/* ADD MODAL */}
//       <Modal
//         title="Add New Quotation"
//         open={isAddModalVisible}
//         onCancel={hideAddModal}
//         footer={null}
//         width={600}
//       >
//         <Form form={addForm} layout="vertical" onFinish={handleAddQuote}>
//           <Form.Item name="customerId" label="Customer" rules={[{ required: true }]}>
//             <Select showSearch placeholder="Select customer" options={customers} loading={loading} />
//           </Form.Item>

//           <Form.Item name="vehicleId" label="Vehicle Model" rules={[{ required: true }]}>
//             <Select
//               showSearch
//               placeholder="Select vehicle model"
//               options={vehicles}
//               loading={loading}
//               onChange={updatePriceWithTax}
//             />
//           </Form.Item>

//           <Form.Item name="dealerId" label="Employee" rules={[{ required: true }]}>
//             <Select showSearch placeholder="Select employee" options={dealers} loading={loading} />
//           </Form.Item>

//           <Form.Item name="taxRate" label="Tax Rate (%)" rules={[{ required: true, message: 'Please select tax rate!' }]}>
//             <Select placeholder="Select tax rate" onChange={updatePriceWithTax}>
//               {Array.from({ length: 91 }, (_, i) => i + 10).map(rate => (
//                 <Select.Option key={rate} value={rate}>{rate}%</Select.Option>
//               ))}
//             </Select>
//           </Form.Item>
//           <Form.Item name="promotionId" label="Promotion (Optional)">
//           <Select
//             allowClear
//             placeholder="Select promotion"
//             options={promotions}
//             loading={loading}
//             onChange={updatePriceWithTax}
//           />
//           </Form.Item>

//           {/* PRICE WITH TAX (DYNAMIC) */}
//           <Form.Item label="Price with Tax (VND)">
//             <Text strong style={{ fontSize: '16px', color: '#6dd40dff' }}>
//               {priceWithTaxDisplay}
//             </Text>
//           </Form.Item>

//           <Form.Item name="quoteDate" label="Quote Date" rules={[{ required: true }]}>
//             <DatePicker
//               format="DD/MM/YYYY"
//               style={{ width: '100%' }}
//               defaultValue={dayjs()}
//               disabled
//             />
//           </Form.Item>

//           <Form.Item name="status" label="Status" initialValue="Draft">
//             <Select>
//               <Select.Option value="Draft">Draft</Select.Option>
//               <Select.Option value="Sent">Sent</Select.Option>
//               <Select.Option value="Accepted">Accepted</Select.Option>
//               <Select.Option value="Rejected">Rejected</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
//               Add
//             </Button>
//             <Button onClick={hideAddModal}>Cancel</Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* EDIT STATUS MODAL */}
//       <Modal
//         title={`Update Status - Quote #${editingQuote?.quoteId}`}
//         open={isEditModalVisible}
//         onCancel={hideEditModal}
//         footer={null}
//         width={500}
//       >
//         <Form form={editForm} layout="vertical" onFinish={handleUpdateStatus}>
//           <Form.Item name="status" label="Status" rules={[{ required: true }]}>
//             <Select>
//               <Select.Option value="Draft">Draft</Select.Option>
//               <Select.Option value="Sent">Sent</Select.Option>
//               <Select.Option value="Accepted">Accepted</Select.Option>
//               <Select.Option value="Rejected">Rejected</Select.Option>
//             </Select>
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
//               Update
//             </Button>
//             <Button onClick={hideEditModal}>Cancel</Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default Quotation;

// update add quote
 
// import React, { useState, useEffect, useCallback, useRef } from 'react';
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
//   Popconfirm,
// } from 'antd';
// import ManageQuoteService from '../../../services/ManageQuotes/ManageQuoteService';
// import ManageDealerService from '../../../services/ManageDealer/ManageDealerService';
// import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
// import ManageStorageService from '../../../services/ManageStorage/ManageStorageService';
// import ManageServicePromotions from '../../../services/ManagePromotions/ManageServicePromotions';
// import ManageVehicleService from '../../../services/ManageVehicleService/ManageVehicleService';
// import { toast } from 'react-toastify';
// import dayjs from 'dayjs';
// import ListCusGetQuote from './ListCusGetQuote';

// const { Title, Text } = Typography;

// // Helper: Format currency VND
// const formatCurrency = (value) => {
//   if (value === null || value === undefined) return 'N/A';
//   return new Intl.NumberFormat('vi-VN', {
//     style: 'currency',
//     currency: 'VND',
//     minimumFractionDigits: 0,
//   }).format(value);
// };

// const Quotation = () => {
//   const [quotations, setQuotations] = useState([]);
//   const [filteredQuotations, setFilteredQuotations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isAddModalVisible, setIsAddModalVisible] = useState(false);
//   const [isEditModalVisible, setIsEditModalVisible] = useState(false);
//   const [editingQuote, setEditingQuote] = useState(null);
//   const [customers, setCustomers] = useState([]);
//   const [vehicles, setVehicles] = useState([]);
//   const [dealers, setDealers] = useState([]);
//   const [searchText, setSearchText] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [addForm] = Form.useForm();
//   const [editForm] = Form.useForm();
// const listCusGetQuoteRef = useRef();
// const [promotionMap, setPromotionMap] = useState({}); // { promotionId: discountPercent }
// const [promotions, setPromotions] = useState([]);
//   // Lưu giá xe theo vehicleId để tính priceWithTax
//   const [vehiclePriceMap, setVehiclePriceMap] = useState({});
// const [allCustomers, setAllCustomers] = useState([]); // Full list loaded once
//   const [customerOptions, setCustomerOptions] = useState([]); // Shown in dropdown
//   const [customerSearchKeyword, setCustomerSearchKeyword] = useState('');
//   // Force re-render khi priceWithTax thay đổi
//   const [priceWithTaxDisplay, setPriceWithTaxDisplay] = useState('Choose vehicle and tax rate');

//   // Get storeId from localStorage
//   const getDealerStoreId = () => {
//     try {
//       const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
//       return dealerInfo.storeId ? Number(dealerInfo.storeId) : null;
//     } catch {
//       return null;
//     }
//   };

//   // === TÁI SỬ DỤNG HÀM FETCH ===
//  const fetchData = useCallback(async () => {
//     setLoading(true);
//     const dealerStoreId = getDealerStoreId();
//     if (!dealerStoreId) {
//       toast.error('Store information not found. Please log in again.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const quoteData = await ManageQuoteService.getAllQuotations();
//       const filteredByStore = [];
//       for (const quote of quoteData) {
//         try {
//           const dealer = await ManageDealerService.GetDealerById(quote.dealerId);
//           if (dealer?.storeId && Number(dealer.storeId) === dealerStoreId) {
//             filteredByStore.push({ ...quote, dealer });
//           }
//         } catch (error) {
//           console.warn(`Unable to get dealer ID ${quote.dealerId}:`, error);
//         }
//       }

//       const promotionIds = [...new Set(filteredByStore.map(q => q.promotionId).filter(id => id != null))];
//       const promotionPromises = promotionIds.map(id =>
//         ManageServicePromotions.getPromotionById(id).catch(() => null)
//       );
//       const loadedPromotions = await Promise.all(promotionPromises);
//       const promoMap = {};
//       loadedPromotions.forEach(promo => {
//         if (promo) promoMap[promo.promotionId] = promo.discountPercent;
//       });
//       setPromotionMap(promoMap);

//       const [customersByStore, storageVehicles] = await Promise.all([
//         ManageCustomersService.getCustomerByStoreId(dealerStoreId),
//         ManageStorageService.getStorageVehiclesByStoreId(dealerStoreId),
//       ]);

//       // Save full customer list for smart search in modal
//       setAllCustomers(customersByStore);

//       const allPromotions = await ManageServicePromotions.getAllPromotions();
//       const storePromotions = allPromotions.filter(p => p.storeId === dealerStoreId);
//       setPromotions(storePromotions.map(p => ({
//         value: p.promotionId,
//         label: `${p.title} (${p.discountPercent}% off)`,
//       })));

//       const dealersByStore = (await ManageDealerService.getAllDealers())
//         .filter(d => Number(d.storeId) === dealerStoreId);

//       const vehicleIds = [...new Set(filteredByStore.map(q => q.vehicleId))];
//       const vehiclePromises = vehicleIds.map(id =>
//         ManageVehicleService.GetVehicleById(id).catch(() => null)
//       );
//       const vehiclesData = await Promise.all(vehiclePromises);
//       const vehicleDisplayMap = new Map();
//       vehiclesData.forEach(v => v && vehicleDisplayMap.set(v.vehicleId, v.modelName));

//       const customerMap = new Map(customersByStore.map(c => [c.customerId, c.fullName]));
//       const dealerMap = new Map(dealersByStore.map(d => [d.dealerId, d.fullName]));

//       const priceMap = {};
//       storageVehicles.forEach(v => { priceMap[v.vehicleId] = v.price || 0; });
//       setVehiclePriceMap(priceMap);

//       const formattedData = filteredByStore.map(item => ({
//         key: item.quoteId,
//         quoteId: item.quoteId,
//         customerName: customerMap.get(item.customerId) || 'N/A',
//         vehicleName: vehicleDisplayMap.get(item.vehicleId) || 'Unknown Model',
//         dealerName: dealerMap.get(item.dealerId) || 'N/A',
//         quoteDate: item.quoteDate || 'N/A',
//         status: item.status || 'N/A',
//         vehiclePrice: item.vehiclePrice ?? priceMap[item.vehicleId] ?? null,
//         priceWithTax: item.priceWithTax ?? null,
//         taxRate: item.taxRate ?? null,
//         promotionId: item.promotionId,
//       }));

//       setQuotations(formattedData);
//       setFilteredQuotations(formattedData);

//       // Set dropdowns (giữ nguyên như cũ)
//       setCustomers(customersByStore.map(c => ({ value: c.customerId, label: c.fullName })));
//       setVehicles(storageVehicles.map(v => ({ value: v.vehicleId, label: v.modelName })));
//       setDealers(dealersByStore.map(d => ({ value: d.dealerId, label: d.fullName })));

//     } catch (error) {
//       console.error('Error loading data:', error);
//       toast.error('Unable to load quotation data');
//     } finally {
//       setLoading(false);
//     }
//   }, []);
//   // === LOAD DATA ===
//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // === SEARCH ===
//   useEffect(() => {
//     const filtered = quotations.filter(quote =>
//       quote.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
//       quote.vehicleName.toLowerCase().includes(searchText.toLowerCase()) ||
//       quote.quoteId.toString().includes(searchText)
//     );
//     setFilteredQuotations(filtered);
//     setCurrentPage(1);
//   }, [searchText, quotations]);

//   // === TÍNH priceWithTax KHI THAY ĐỔI vehicleId HOẶC taxRate ===
// const updatePriceWithTax = () => {
//   const values = addForm.getFieldsValue();
//   const vehicleId = values.vehicleId;
//   const taxRate = values.taxRate;
//   const promotionId = values.promotionId;

//   let display = 'Choose vehicle and tax rate';
//   if (vehicleId && taxRate !== undefined) {
//     const basePrice = vehiclePriceMap[vehicleId] || 0;
//     let finalPrice = basePrice;

//     if (promotionId) {
//       const promo = promotions.find(p => p.value === promotionId);
//       if (promo) {
//         const discount = parseInt(promo.label.match(/\((\d+)%/)[1], 10);
//         finalPrice = basePrice * (1 - discount / 100);
//       }
//     }

//     const priceWithTax = Math.round(finalPrice * (1 + taxRate / 100));
//     addForm.setFieldsValue({ priceWithTax });
//     display = formatCurrency(priceWithTax);
//   } else {
//     addForm.setFieldsValue({ priceWithTax: undefined });
//   }

//   setPriceWithTaxDisplay(display);
// };
// const handleCustomerSearch = (keyword) => {
//   setCustomerSearchKeyword(keyword);

//   // If keyword is empty, show an initial slice of customers (first 4)
//   if (!keyword || keyword.trim() === '') {
//     const initial = allCustomers.slice(0, 4).map(c => ({
//       value: c.customerId,
//       label: (
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <strong>{c.fullName}</strong>
//           <span style={{ color: '#888', fontSize: '12px' }}>
//             {c.phone} 
//           </span>
//         </div>
//       ),
//     }));
//     setCustomerOptions(initial);
//     return;
//   }

//   // Search by name or phone
//   const filtered = allCustomers
//     .filter(c =>
//       c.fullName.toLowerCase().includes(keyword.toLowerCase()) ||
//       (c.phone || '').includes(keyword)
//     )
//     .map(c => ({
//       value: c.customerId,
//       label: (
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <strong>{c.fullName}</strong>
//           <span style={{ color: '#888', fontSize: '12px' }}>
//             {c.phone}  
//           </span>
//         </div>
//       ),
//     }));

//   setCustomerOptions(filtered);
// };
//   // === OPEN ADD MODAL ===
// const showAddModal = () => {
//     addForm.setFieldsValue({
//       quoteDate: dayjs(),
//       status: 'Accepted',
//       priceWithTax: undefined,
//     });
//     setPriceWithTaxDisplay('Choose vehicle and tax rate');

//     setIsAddModalVisible(true);

//     // Load 4 khách đầu nếu chưa có
//     if (allCustomers.length > 0 && customerOptions.length === 0) {
//       handleCustomerSearch('');
//     }
//   };

//   const hideAddModal = () => {
//     setIsAddModalVisible(false);
//     addForm.resetFields();
//     setPriceWithTaxDisplay('N/A');
//   };

//   // === OPEN EDIT MODAL ===
//   const handleEdit = async (quoteId) => {
//     try {
//       setLoading(true);
//       const quote = await ManageQuoteService.GetQuotationById(quoteId);
//       setEditingQuote(quote);
//       editForm.setFieldsValue({ status: quote.status });
//       setIsEditModalVisible(true);
//     } catch (error) {
//       toast.error('Unable to load quotation information');
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

//   // === XÓA QUOTATION ===
//   const handleDelete = async (quoteId) => {
//     setLoading(true);
//     try {
//       await ManageQuoteService.DeleteQuotation(quoteId);
//       toast.success('Quotation deleted successfully!');

//       const updatedList = quotations.filter(q => q.quoteId !== quoteId);
//       setQuotations(updatedList);
//       setFilteredQuotations(updatedList);
//     } catch (error) {
//       toast.error('Failed to delete quotation');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // === CẬP NHẬT STATUS KHÁCH HÀNG SAU KHI TẠO QUOTE ===
//   const updateCustomerStatusToAccept = async (customerId) => {
//     try {
//       const currentCustomer = await ManageCustomersService.GetCustomerById(customerId);
//       if (!currentCustomer) return;

//       // Chỉ cập nhật nếu status hiện tại là Pending
//       if (currentCustomer.status === 'Pending') {
//         const updatePayload = {
//           ...currentCustomer,
//           customerId: customerId,
//           status: 'Accept',
//           storeId: currentCustomer.storeId,
//         };

//         await ManageCustomersService.editCustomer(customerId, updatePayload);
//         toast.success('Customer status updated to Accepted');
//       }
//     } catch (error) {
//       console.error('Failed to update customer status:', error);
//       toast.warn('Quote created but customer status not updated');
//     }
//   };

//   // === ADD QUOTATION (VỚI CẬP NHẬT STATUS) ===
//  const handleAddQuote = async (values) => {
//     setLoading(true);
//     try {
//       const quoteData = {
//           customerId: values.customerId,
//           vehicleId: values.vehicleId,
//           dealerId: values.dealerId,
//           promotionId: values.promotionId || null,
//           taxRate: values.taxRate,
//           quoteDate: values.quoteDate.format('DD/MM/YYYY'),
//           status: values.status || 'Draft',
//         };

//       const newQuote = await ManageQuoteService.AddQuotation(quoteData);

//       // CẬP NHẬT STATUS KHÁCH HÀNG
//       await updateCustomerStatusToAccept(values.customerId);

//       toast.success('Quotation added successfully!');

//       // ... format newQuoteFormatted như cũ
//       const basePrice = vehiclePriceMap[values.vehicleId] || 0;
//       const priceWithTax = Math.round(basePrice * (1 + values.taxRate / 100));
//       const customerName = customers.find(c => c.value === values.customerId)?.label || 'N/A';
//       const vehicleName = vehicles.find(v => v.value === values.vehicleId)?.label || 'N/A';
//       const dealerName = dealers.find(d => d.value === values.dealerId)?.label || 'N/A';

//       const newQuoteFormatted = {
//         key: newQuote.quoteId,
//         quoteId: newQuote.quoteId,
//         customerName,
//         vehicleName,
//         dealerName,
//         quoteDate: values.quoteDate.format('DD/MM/YYYY'),
//         status: values.status || 'Draft',
//         vehiclePrice: basePrice,
//         priceWithTax,
//         taxRate: values.taxRate,
//       };

//       const updatedList = [newQuoteFormatted, ...quotations];
//       setQuotations(updatedList);
//       setFilteredQuotations(updatedList);

//       hideAddModal();

//       // RELOAD LIST CUS GET QUOTE
//       listCusGetQuoteRef.current?.reload();

//     } catch (error) {
//       toast.error('Failed to add quotation');
//       console.error(error);
//     } finally {
//       setLoading(false);
//       fetchData();
//     }
//   };

//   // === UPDATE STATUS ===
//   const handleUpdateStatus = async (values) => {
//     if (!editingQuote) return;

//     setLoading(true);
//     try {
//       const updateData = {
//         customerId: editingQuote.customerId,
//         vehicleId: editingQuote.vehicleId,
//         dealerId: editingQuote.dealerId,
//         taxRate: editingQuote.taxRate,
//         quoteDate: editingQuote.quoteDate,
//         status: values.status,
//       };

//       await ManageQuoteService.EditQuotation(editingQuote.quoteId, updateData);
//       toast.success('Status updated successfully!');

//       const updatedList = quotations.map(q =>
//         q.quoteId === editingQuote.quoteId
//           ? { ...q, status: values.status }
//           : q
//       );
//       setQuotations(updatedList);
//       setFilteredQuotations(updatedList);

//       hideEditModal();
//     } catch (error) {
//       toast.error('Update failed');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // === TABLE COLUMNS ===
//   const columns = [
//     { title: 'Quote ID', dataIndex: 'quoteId', key: 'quoteId', sorter: (a, b) => a.quoteId - b.quoteId },
//     { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
//     { title: 'Vehicle Model', dataIndex: 'vehicleName', key: 'vehicleName' },
//     { title: 'Employee', dataIndex: 'dealerName', key: 'dealerName' },
//     { title: 'Quote Date', dataIndex: 'quoteDate', key: 'quoteDate' },
    
//     {
//       title: 'Vehicle Price (VND)',
//       dataIndex: 'vehiclePrice',
//       key: 'vehiclePrice',
//       render: formatCurrency,
//       sorter: (a, b) => (a.vehiclePrice || 0) - (b.vehiclePrice || 0),
//       align: 'right',
//     },
   
//     {
//       title: 'Tax Rate (%)',
//       dataIndex: 'taxRate',
//       key: 'taxRate',
//       render: (rate) => rate !== null ? `${rate}%` : 'N/A',
//       sorter: (a, b) => (a.taxRate || 0) - (b.taxRate || 0),
//       align: 'center',
//     },
//     // === ADD COLUMN ===
// {
//   title: 'Discount Promotion',
//   key: 'discountPromotion',
//   align: 'center',
//   render: (_, record) => {
//     if (!record.promotionId) {
//       return <Tag color="default">No Promotion</Tag>;
//     }
//     const discount = promotionMap[record.promotionId];
//     if (discount === undefined) {
//       return <Tag color="orange">Loading...</Tag>;
//     }
//     return <Tag color="green">{discount}%</Tag>;
//   },
// },
//  {
//       title: 'Price with Tax (VND)',
//       dataIndex: 'priceWithTax',
//       key: 'priceWithTax',
//       render: formatCurrency,
//       sorter: (a, b) => (a.priceWithTax || 0) - (b.priceWithTax || 0),
//       align: 'right',
//       defaultSortOrder: 'descend',
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status) => (
//         <Tag color={
//           status === 'Accepted' ? 'green' :
//             status === 'Sent' ? 'blue' :
//               status === 'Rejected' ? 'red' :
//                 status === 'Draft' ? 'orange' : 'default'
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
//           <Button
//             onClick={() => handleEdit(record.quoteId)}
//             style={{
//               background: 'linear-gradient(135deg, #ec6e07ff 0%, #ceb24fff 100%)',
//               border: 'none',
//               borderRadius: '8px',
//               color: 'white',
//               fontSize: '0.875rem',
//               boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//             }}
//             onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
//             onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
//           >
//             Edit
//           </Button>
//           <Popconfirm
//             title="Delete this quotation?"
//             description="This action cannot be undone."
//             onConfirm={() => handleDelete(record.quoteId)}
//             okText="Yes, Delete"
//             cancelText="Cancel"
//             okButtonProps={{ danger: true }}
//           >
//             <Button
//               danger
//               style={{
//                 background: 'linear-gradient(135deg, #ff1f01ff 0%, #df9292ff 100%)',
//                 border: 'none',
//                 borderRadius: '8px',
//                 color: 'white',
//                 fontSize: '0.875rem',
//                 boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//               }}
//             >
//               Delete
//             </Button>
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   const totalQuotations = filteredQuotations.length;

//   return (
//     <div>
//      <ListCusGetQuote ref={listCusGetQuoteRef} />

//       <Row gutter={16} style={{ marginBottom: 16 }}>
//         <Col span={20}>
//           <Input
//             placeholder="Search by customer name or vehicle model"
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             allowClear
//           />
//         </Col>
//         <Col span={4}>
//           <Button type="primary" onClick={showAddModal} style={{ width: '100%' }}>
//             Add Quotation
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
//           showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} quotations`,
//         }}
//         bordered
//         style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
//       />

//       {/* ADD MODAL */}
//       <Modal
//         title="Add New Quotation"
//         open={isAddModalVisible}
//         onCancel={hideAddModal}
//         footer={null}
//         width={600}
//       >
//         <Form form={addForm} layout="vertical" onFinish={handleAddQuote}>
//        {/* CUSTOMER SELECT ĐÃ ĐƯỢC NÂNG CẤP */}
//           <Form.Item
//             name="customerId"
//             label="Customer"
//             rules={[{ required: true, message: 'Please select customer' }]}
//           >
//             <Select
//               showSearch
//               placeholder="Search by name or phone number..."
//               options={customerOptions}
//               filterOption={false} // tắt filter mặc định để dùng custom
//               onSearch={handleCustomerSearch}
//               onDropdownVisibleChange={(open) => {
//                 if (open && allCustomers.length > 0 && customerOptions.length === 0) {
//                   handleCustomerSearch('');
//                 }
//               }}
//               notFoundContent="No customer found"
//             />
//           </Form.Item>

//           <Form.Item name="vehicleId" label="Vehicle Model" rules={[{ required: true }]}>
//             <Select
//               showSearch
//               placeholder="Select vehicle model"
//               options={vehicles}
//               loading={loading}
//               onChange={updatePriceWithTax}
//             />
//           </Form.Item>

//           <Form.Item name="dealerId" label="Employee" rules={[{ required: true }]}>
//             <Select showSearch placeholder="Select employee" options={dealers} loading={loading} />
//           </Form.Item>

//           <Form.Item name="taxRate" label="Tax Rate (%)" rules={[{ required: true, message: 'Please select tax rate!' }]}>
//             <Select placeholder="Select tax rate" onChange={updatePriceWithTax}>
//               {Array.from({ length: 91 }, (_, i) => i + 10).map(rate => (
//                 <Select.Option key={rate} value={rate}>{rate}%</Select.Option>
//               ))}
//             </Select>
//           </Form.Item>
//           <Form.Item name="promotionId" label="Promotion (Optional)">
//           <Select
//             allowClear
//             placeholder="Select promotion"
//             options={promotions}
//             loading={loading}
//             onChange={updatePriceWithTax}
//           />
//           </Form.Item>

//           {/* PRICE WITH TAX (DYNAMIC) */}
//           <Form.Item label="Price with Tax (VND)">
//             <Text strong style={{ fontSize: '16px', color: '#6dd40dff' }}>
//               {priceWithTaxDisplay}
//             </Text>
//           </Form.Item>

//           <Form.Item name="quoteDate" label="Quote Date" rules={[{ required: true }]}>
//             <DatePicker
//               format="DD/MM/YYYY"
//               style={{ width: '100%' }}
//               defaultValue={dayjs()}
//               disabled
//             />
//           </Form.Item>

//           <Form.Item name="status" label="Status" initialValue="Draft">
//             <Select>
//               <Select.Option value="Draft">Draft</Select.Option>
//               <Select.Option value="Sent">Sent</Select.Option>
//               <Select.Option value="Accepted">Accepted</Select.Option>
//               <Select.Option value="Rejected">Rejected</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
//               Add
//             </Button>
//             <Button onClick={hideAddModal}>Cancel</Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* EDIT STATUS MODAL */}
//       <Modal
//         title={`Update Status - Quote #${editingQuote?.quoteId}`}
//         open={isEditModalVisible}
//         onCancel={hideEditModal}
//         footer={null}
//         width={500}
//       >
//         <Form form={editForm} layout="vertical" onFinish={handleUpdateStatus}>
//           <Form.Item name="status" label="Status" rules={[{ required: true }]}>
//             <Select>
//               <Select.Option value="Draft">Draft</Select.Option>
//               <Select.Option value="Sent">Sent</Select.Option>
//               <Select.Option value="Accepted">Accepted</Select.Option>
//               <Select.Option value="Rejected">Rejected</Select.Option>
//             </Select>
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
//               Update
//             </Button>
//             <Button onClick={hideEditModal}>Cancel</Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default Quotation;

// sap xep customerId giam dan
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Popconfirm,
} from 'antd';
import ManageQuoteService from '../../../services/ManageQuotes/ManageQuoteService';
import ManageDealerService from '../../../services/ManageDealer/ManageDealerService';
import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
import ManageStorageService from '../../../services/ManageStorage/ManageStorageService';
import ManageServicePromotions from '../../../services/ManagePromotions/ManageServicePromotions';
import ManageVehicleService from '../../../services/ManageVehicleService/ManageVehicleService';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import ListCusGetQuote from './ListCusGetQuote';

const { Title, Text } = Typography;

// Helper: Format currency VND
const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(value);
};

const Quotation = () => {
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
const listCusGetQuoteRef = useRef();
const [promotionMap, setPromotionMap] = useState({}); // { promotionId: discountPercent }
const [promotions, setPromotions] = useState([]);
  // Lưu giá xe theo vehicleId để tính priceWithTax
  const [vehiclePriceMap, setVehiclePriceMap] = useState({});
const [allCustomers, setAllCustomers] = useState([]); // Full list loaded once
  const [customerOptions, setCustomerOptions] = useState([]); // Shown in dropdown
  const [customerSearchKeyword, setCustomerSearchKeyword] = useState('');
  // Force re-render khi priceWithTax thay đổi
  const [priceWithTaxDisplay, setPriceWithTaxDisplay] = useState('Choose vehicle and tax rate');

  // Get storeId from localStorage
  const getDealerStoreId = () => {
    try {
      const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
      return dealerInfo.storeId ? Number(dealerInfo.storeId) : null;
    } catch {
      return null;
    }
  };

  // === TÁI SỬ DỤNG HÀM FETCH ===
 const fetchData = useCallback(async () => {
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

      const promotionIds = [...new Set(filteredByStore.map(q => q.promotionId).filter(id => id != null))];
      const promotionPromises = promotionIds.map(id =>
        ManageServicePromotions.getPromotionById(id).catch(() => null)
      );
      const loadedPromotions = await Promise.all(promotionPromises);
      const promoMap = {};
      loadedPromotions.forEach(promo => {
        if (promo) promoMap[promo.promotionId] = promo.discountPercent;
      });
      setPromotionMap(promoMap);

      const [customersByStore, storageVehicles] = await Promise.all([
        ManageCustomersService.getCustomerByStoreId(dealerStoreId),
        ManageStorageService.getStorageVehiclesByStoreId(dealerStoreId),
      ]);

      // Save full customer list for smart search in modal
      // Save full customer list + sort by customerId DESC (mới nhất lên đầu)
setAllCustomers(
  [...customersByStore].sort((a, b) => b.customerId - a.customerId)
);

      const allPromotions = await ManageServicePromotions.getAllPromotions();
      const storePromotions = allPromotions.filter(p => p.storeId === dealerStoreId);
      setPromotions(storePromotions.map(p => ({
        value: p.promotionId,
        label: `${p.title} (${p.discountPercent}% off)`,
      })));

      const dealersByStore = (await ManageDealerService.getAllDealers())
        .filter(d => Number(d.storeId) === dealerStoreId);

      const vehicleIds = [...new Set(filteredByStore.map(q => q.vehicleId))];
      const vehiclePromises = vehicleIds.map(id =>
        ManageVehicleService.GetVehicleById(id).catch(() => null)
      );
      const vehiclesData = await Promise.all(vehiclePromises);
      const vehicleDisplayMap = new Map();
      vehiclesData.forEach(v => v && vehicleDisplayMap.set(v.vehicleId, v.modelName));

      const customerMap = new Map(customersByStore.map(c => [c.customerId, c.fullName]));
      const dealerMap = new Map(dealersByStore.map(d => [d.dealerId, d.fullName]));

      const priceMap = {};
      storageVehicles.forEach(v => { priceMap[v.vehicleId] = v.price || 0; });
      setVehiclePriceMap(priceMap);

      const formattedData = filteredByStore.map(item => ({
        key: item.quoteId,
        quoteId: item.quoteId,
        customerName: customerMap.get(item.customerId) || 'N/A',
        vehicleName: vehicleDisplayMap.get(item.vehicleId) || 'Unknown Model',
        dealerName: dealerMap.get(item.dealerId) || 'N/A',
        quoteDate: item.quoteDate || 'N/A',
        status: item.status || 'N/A',
        vehiclePrice: item.vehiclePrice ?? priceMap[item.vehicleId] ?? null,
        priceWithTax: item.priceWithTax ?? null,
        taxRate: item.taxRate ?? null,
        promotionId: item.promotionId,
      }));

      setQuotations(formattedData);
      setFilteredQuotations(formattedData);

      // Set dropdowns (giữ nguyên như cũ)
      setCustomers(customersByStore.map(c => ({ value: c.customerId, label: c.fullName })));
      setVehicles(storageVehicles.map(v => ({ value: v.vehicleId, label: v.modelName })));
      setDealers(dealersByStore.map(d => ({ value: d.dealerId, label: d.fullName })));

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Unable to load quotation data');
    } finally {
      setLoading(false);
    }
  }, []);
  // === LOAD DATA ===
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // === SEARCH ===
  useEffect(() => {
    const filtered = quotations.filter(quote =>
      quote.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      quote.vehicleName.toLowerCase().includes(searchText.toLowerCase()) ||
      quote.quoteId.toString().includes(searchText)
    );
    setFilteredQuotations(filtered);
    setCurrentPage(1);
  }, [searchText, quotations]);

  // === TÍNH priceWithTax KHI THAY ĐỔI vehicleId HOẶC taxRate ===
const updatePriceWithTax = () => {
  const values = addForm.getFieldsValue();
  const vehicleId = values.vehicleId;
  const taxRate = values.taxRate;
  const promotionId = values.promotionId;

  let display = 'Choose vehicle and tax rate';
  if (vehicleId && taxRate !== undefined) {
    const basePrice = vehiclePriceMap[vehicleId] || 0;
    let finalPrice = basePrice;

    if (promotionId) {
      const promo = promotions.find(p => p.value === promotionId);
      if (promo) {
        const discount = parseInt(promo.label.match(/\((\d+)%/)[1], 10);
        finalPrice = basePrice * (1 - discount / 100);
      }
    }

    const priceWithTax = Math.round(finalPrice * (1 + taxRate / 100));
    addForm.setFieldsValue({ priceWithTax });
    display = formatCurrency(priceWithTax);
  } else {
    addForm.setFieldsValue({ priceWithTax: undefined });
  }

  setPriceWithTaxDisplay(display);
};
 const handleCustomerSearch = (keyword) => {
  setCustomerSearchKeyword(keyword);
console.log(customerSearchKeyword)
  let result = [];

  if (!keyword || keyword.trim() === '') {
    // Hiển thị khách mới nhất trước (đã được sort ở trên)
    result = allCustomers.slice(0, 5);
  } else {
    // Tìm kiếm theo tên hoặc số điện thoại
    result = allCustomers.filter(c =>
      c.fullName.toLowerCase().includes(keyword.toLowerCase()) ||
       
      (c.phone || '').includes(keyword)
    );
  }

  // Đảm bảo kết quả luôn được sắp xếp theo customerId giảm dần
  const sorted = result.sort((a, b) => b.customerId - a.customerId);

  // Chuyển thành options cho Select
  const options = sorted.map(c => ({
    value: c.customerId,
    label: (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>{c.fullName}</strong>
        <span style={{ color: '#888', fontSize: '12px' }}>
          {c.phone} 
        </span>
      </div>
    ),
  }));

  setCustomerOptions(options);
};
  // === OPEN ADD MODAL ===
const showAddModal = () => {
    addForm.setFieldsValue({
      quoteDate: dayjs(),
      status: 'Accepted',
      priceWithTax: undefined,
    });
    setPriceWithTaxDisplay('Choose vehicle and tax rate');

    setIsAddModalVisible(true);

    // Load 4 khách đầu nếu chưa có
    if (allCustomers.length > 0 && customerOptions.length === 0) {
      handleCustomerSearch('');
    }
    // Hiển thị khách mới nhất khi mở dropdown lần đầu
  if (allCustomers.length > 0 && customerOptions.length === 0) {
    handleCustomerSearch(''); // sẽ tự động lấy top mới nhất
  }
  };

  const hideAddModal = () => {
    setIsAddModalVisible(false);
    addForm.resetFields();
    setPriceWithTaxDisplay('N/A');
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

  // === XÓA QUOTATION ===
  const handleDelete = async (quoteId) => {
    setLoading(true);
    try {
      await ManageQuoteService.DeleteQuotation(quoteId);
      toast.success('Quotation deleted successfully!');

      const updatedList = quotations.filter(q => q.quoteId !== quoteId);
      setQuotations(updatedList);
      setFilteredQuotations(updatedList);
    } catch (error) {
      toast.error('Failed to delete quotation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // === CẬP NHẬT STATUS KHÁCH HÀNG SAU KHI TẠO QUOTE ===
  const updateCustomerStatusToAccept = async (customerId) => {
    try {
      const currentCustomer = await ManageCustomersService.GetCustomerById(customerId);
      if (!currentCustomer) return;

      // Chỉ cập nhật nếu status hiện tại là Pending
      if (currentCustomer.status === 'Pending') {
        const updatePayload = {
          ...currentCustomer,
          customerId: customerId,
          status: 'Accept',
          storeId: currentCustomer.storeId,
        };

        await ManageCustomersService.editCustomer(customerId, updatePayload);
        toast.success('Customer status updated to Accepted');
      }
    } catch (error) {
      console.error('Failed to update customer status:', error);
      toast.warn('Quote created but customer status not updated');
    }
  };

  // === ADD QUOTATION (VỚI CẬP NHẬT STATUS) ===
 const handleAddQuote = async (values) => {
    setLoading(true);
    try {
      const quoteData = {
          customerId: values.customerId,
          vehicleId: values.vehicleId,
          dealerId: values.dealerId,
          promotionId: values.promotionId || null,
          taxRate: values.taxRate,
          quoteDate: values.quoteDate.format('DD/MM/YYYY'),
          status: values.status || 'Draft',
        };

      const newQuote = await ManageQuoteService.AddQuotation(quoteData);

      // CẬP NHẬT STATUS KHÁCH HÀNG
      await updateCustomerStatusToAccept(values.customerId);

      toast.success('Quotation added successfully!');

      // ... format newQuoteFormatted như cũ
      const basePrice = vehiclePriceMap[values.vehicleId] || 0;
      const priceWithTax = Math.round(basePrice * (1 + values.taxRate / 100));
      const customerName = customers.find(c => c.value === values.customerId)?.label || 'N/A';
      const vehicleName = vehicles.find(v => v.value === values.vehicleId)?.label || 'N/A';
      const dealerName = dealers.find(d => d.value === values.dealerId)?.label || 'N/A';

      const newQuoteFormatted = {
        key: newQuote.quoteId,
        quoteId: newQuote.quoteId,
        customerName,
        vehicleName,
        dealerName,
        quoteDate: values.quoteDate.format('DD/MM/YYYY'),
        status: values.status || 'Draft',
        vehiclePrice: basePrice,
        priceWithTax,
        taxRate: values.taxRate,
      };

      const updatedList = [newQuoteFormatted, ...quotations];
      setQuotations(updatedList);
      setFilteredQuotations(updatedList);

      hideAddModal();

      // RELOAD LIST CUS GET QUOTE
      listCusGetQuoteRef.current?.reload();

    } catch (error) {
      toast.error('Failed to add quotation');
      console.error(error);
    } finally {
      setLoading(false);
      fetchData();
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
        taxRate: editingQuote.taxRate,
        quoteDate: editingQuote.quoteDate,
        status: values.status,
      };

      await ManageQuoteService.EditQuotation(editingQuote.quoteId, updateData);
      toast.success('Status updated successfully!');

      const updatedList = quotations.map(q =>
        q.quoteId === editingQuote.quoteId
          ? { ...q, status: values.status }
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
      title: 'Vehicle Price (VND)',
      dataIndex: 'vehiclePrice',
      key: 'vehiclePrice',
      render: formatCurrency,
      sorter: (a, b) => (a.vehiclePrice || 0) - (b.vehiclePrice || 0),
      align: 'right',
    },
   
    {
      title: 'Tax Rate (%)',
      dataIndex: 'taxRate',
      key: 'taxRate',
      render: (rate) => rate !== null ? `${rate}%` : 'N/A',
      sorter: (a, b) => (a.taxRate || 0) - (b.taxRate || 0),
      align: 'center',
    },
    // === ADD COLUMN ===
{
  title: 'Discount Promotion',
  key: 'discountPromotion',
  align: 'center',
  render: (_, record) => {
    if (!record.promotionId) {
      return <Tag color="default">No Promotion</Tag>;
    }
    const discount = promotionMap[record.promotionId];
    if (discount === undefined) {
      return <Tag color="orange">Loading...</Tag>;
    }
    return <Tag color="green">{discount}%</Tag>;
  },
},
 {
      title: 'Price with Tax (VND)',
      dataIndex: 'priceWithTax',
      key: 'priceWithTax',
      render: formatCurrency,
      sorter: (a, b) => (a.priceWithTax || 0) - (b.priceWithTax || 0),
      align: 'right',
      defaultSortOrder: 'descend',
    },
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
          <Button
            onClick={() => handleEdit(record.quoteId)}
            style={{
              background: 'linear-gradient(135deg, #ec6e07ff 0%, #ceb24fff 100%)',
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
          <Popconfirm
            title="Delete this quotation?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.quoteId)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              style={{
                background: 'linear-gradient(135deg, #ff1f01ff 0%, #df9292ff 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.875rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const totalQuotations = filteredQuotations.length;

  return (
    <div>
     <ListCusGetQuote ref={listCusGetQuoteRef} />

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
        style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
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
       {/* CUSTOMER SELECT ĐÃ ĐƯỢC NÂNG CẤP */}
          <Form.Item
            name="customerId"
            label="Customer"
            rules={[{ required: true, message: 'Please select customer' }]}
          >
            <Select
              showSearch
              placeholder="Search by name or phone number..."
              options={customerOptions}
              filterOption={false} // tắt filter mặc định để dùng custom
              onSearch={handleCustomerSearch}
              onDropdownVisibleChange={(open) => {
                if (open && allCustomers.length > 0 && customerOptions.length === 0) {
                  handleCustomerSearch('');
                }
              }}
              notFoundContent="No customer found"
            />
          </Form.Item>

          <Form.Item name="vehicleId" label="Vehicle Model" rules={[{ required: true }]}>
            <Select
              showSearch
              placeholder="Select vehicle model"
              options={vehicles}
              loading={loading}
              onChange={updatePriceWithTax}
            />
          </Form.Item>

          <Form.Item name="dealerId" label="Employee" rules={[{ required: true }]}>
            <Select showSearch placeholder="Select employee" options={dealers} loading={loading} />
          </Form.Item>

          <Form.Item name="taxRate" label="Tax Rate (%)" rules={[{ required: true, message: 'Please select tax rate!' }]}>
            <Select placeholder="Select tax rate" onChange={updatePriceWithTax}>
              {Array.from({ length: 91 }, (_, i) => i + 10).map(rate => (
                <Select.Option key={rate} value={rate}>{rate}%</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="promotionId" label="Promotion (Optional)">
          <Select
            allowClear
            placeholder="Select promotion"
            options={promotions}
            loading={loading}
            onChange={updatePriceWithTax}
          />
          </Form.Item>

          {/* PRICE WITH TAX (DYNAMIC) */}
          <Form.Item label="Price with Tax (VND)">
            <Text strong style={{ fontSize: '16px', color: '#6dd40dff' }}>
              {priceWithTaxDisplay}
            </Text>
          </Form.Item>

          <Form.Item name="quoteDate" label="Quote Date" rules={[{ required: true }]}>
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
              defaultValue={dayjs()}
              disabled
            />
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
