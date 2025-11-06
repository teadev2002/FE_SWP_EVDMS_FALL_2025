// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Table, Dropdown, Button, Form, Input, Select, Space, Popconfirm, Typography, Row, Col, Modal, InputNumber,
// } from 'antd';
// import {
//   PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, StockOutlined,EllipsisOutlined
// } from '@ant-design/icons';
// import { toast } from 'react-toastify';
// import ViewDetailBrandVehicle from './ViewDetailBrandVehicle';
// import ModalVehicle from './ModalVehicle';
// import ManageVehicleService from '../../../../services/ManageVehicleService/ManageVehicleService.jsx';
// import ManageStoreService from '../../../../services/ManageStore/ManageStoreService.jsx';
// import ManageStorageService from '../../../../services/ManageStorage/ManageStorageService.jsx';

// const { Title } = Typography;
// const { Option } = Select;

// const BrandVehicleManage = () => {
//   const [vehicles, setVehicles] = useState([]);
//   const [filteredVehicles, setFilteredVehicles] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
//   const [isStockModalVisible, setIsStockModalVisible] = useState(false);
//   const [isAllocateModalVisible, setIsAllocateModalVisible] = useState(false);  
//   const [editingVehicle, setEditingVehicle] = useState(null);
//   const [selectedVehicleId, setSelectedVehicleId] = useState(null);
//   const [selectedStockVehicle, setSelectedStockVehicle] = useState(null);
//   const [selectedAllocateVehicle, setSelectedAllocateVehicle] = useState(null);  
//   const [form] = Form.useForm();
//   const [stockForm] = Form.useForm();
//   const [allocateForm] = Form.useForm();  
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [brands, setBrands] = useState([]);
//   const [stores, setStores] = useState([]);   

//   // Cache lưu trữ dữ liệu storage theo vehicleId
//   const [storageCache, setStorageCache] = useState({});

//   // Styles
//   const buttonStyle = { borderRadius: 8, transition: 'all 0.3s ease' };
//   const inputStyle = { borderRadius: 8 };

//   // Lấy brandId từ localStorage
//   const getBrandIdFromStorage = () => {
//     try {
//       const staffInfo = localStorage.getItem('staffInfo');
//       if (staffInfo) {
//         const parsed = JSON.parse(staffInfo);
//         return parsed.brandId;
//       }
//     } catch (error) {
//       console.error('Failed to parse staffInfo from localStorage:', error);
//     }
//     return null;
//   };

//   // 🔁 Fetch all stores (assumed scoped to current brand by backend)
// useEffect(() => {
//   const fetchStores = async () => {
//     try {
//       const response = await ManageStoreService.getAllStores();
//       // Ensure response is an array
//       setStores(Array.isArray(response) ? response : []);
//     } catch (error) {
//       console.error('Failed to fetch stores:', error);
//       toast.error('Failed to load stores for allocation.');
//     }
//   };
//   fetchStores();
// }, []);
//   // Fetch brands
//   useEffect(() => {
//     const fetchBrands = async () => {
//       try {
//         const response = await ManageVehicleService.getAllBrands();
//         setBrands(response);
//       } catch (error) {
//         toast.error('Failed to fetch brands: ' + error.message);
//       }
//     };
//     fetchBrands();
//   }, []);

//   // Fetch vehicles by brandId
//   useEffect(() => {
//     const fetchVehicles = async () => {
//       const brandId = getBrandIdFromStorage();
//       if (!brandId) {
//         toast.error('Không tìm thấy brandId trong thông tin nhân viên.');
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       try {
//         const response = await ManageVehicleService.getAllVehicleByBrandId(brandId);
//         const fetchedVehicles = response.map((vehicle) => ({
//           ...vehicle,
//           key: vehicle.vehicleId.toString(),
//           status: vehicle.status || 'Active',
//           imageUrls: Array.isArray(vehicle.imageUrls) ? vehicle.imageUrls.join(', ') : vehicle.imageUrls || '',
//         }));
//         setVehicles(fetchedVehicles);
//         setFilteredVehicles(fetchedVehicles);
//         toast.success('Vehicles loaded successfully');
//       } catch (error) {
//         toast.error('Failed to fetch vehicles: ' + error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchVehicles();
//   }, []);

//   // Preload storage
//   useEffect(() => {
//     if (vehicles.length > 0) {
//       vehicles.forEach(vehicle => {
//         if (!storageCache[vehicle.vehicleId] && vehicle.brandId) {
//           fetchStorageInfo(vehicle.vehicleId, vehicle.brandId);
//         }
//       });
//     }
//   }, [vehicles]);

//   // Search effect
//   useEffect(() => {
//     const filtered = vehicles
//       .filter((vehicle) => vehicle.status !== 'Deleted')
//       .filter(
//         (vehicle) =>
//           vehicle.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           vehicle.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           vehicle.color.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     setFilteredVehicles(filtered);
//   }, [searchTerm, vehicles]);

//    const fetchStorageInfo = useCallback(async (vehicleId, brandId) => {
//   if (storageCache[vehicleId]) return storageCache[vehicleId];

//   try {
//     const data = await ManageStorageService.filterStorageByBrandIdAndVehicleId(brandId, vehicleId);

//     let storageInfo = { quantityAvailable: 0, storeId: 'N/A', lastUpdated: 'N/A' };

//     if (data && Array.isArray(data) && data.length > 0) {
//       // Tìm bản ghi có storeId === null
//       const centralRecord = data.find(record => record.storeId === null);

//       if (centralRecord) {
//         storageInfo = {
//           quantityAvailable: centralRecord.quantityAvailable ?? 0,
//           storeId: 'Central', // hoặc 'N/A' nếu muốn
//           lastUpdated: centralRecord.lastUpdated ?? 'N/A',
//         };
//       }
//       // Nếu không có storeId null → vẫn giữ mặc định '0'
//     }

//     setStorageCache(prev => ({ ...prev, [vehicleId]: storageInfo }));
//     return storageInfo;
//   } catch (error) {
//     console.error(`Error fetching storage for vehicle ${vehicleId}:`, error);
//     const fallback = { quantityAvailable: 'Error', storeId: 'N/A', lastUpdated: 'N/A' };
//     setStorageCache(prev => ({ ...prev, [vehicleId]: fallback }));
//     return fallback;
//   }
// }, [storageCache]);

//   const getStorageInfo = useCallback((vehicleId) => {
//     return storageCache[vehicleId] || { quantityAvailable: 'Loading...', storeId: 'N/A', lastUpdated: 'N/A' };
//   }, [storageCache]);

//   const preloadStorageOnHover = useCallback((vehicle) => {
//     if (!storageCache[vehicle.vehicleId]) {
//       fetchStorageInfo(vehicle.vehicleId, vehicle.brandId);
//     }
//   }, [fetchStorageInfo, storageCache]);

//   // Handle Add to Stock
//   const handleAddToStock = (e, vehicle) => {
//     e.stopPropagation();
//     setSelectedStockVehicle(vehicle);
//     stockForm.setFieldsValue({ quantityAvailable: 1 });
//     setIsStockModalVisible(true);
//   };

//   const handleStockSave = async () => {
//   try {
//     const values = await stockForm.validateFields();
//     setLoading(true);

//     const today = new Date().toLocaleDateString('en-GB');

//     // Luôn gửi storeId = null (theo yêu cầu)
//     const payload = {
//       vehicleId: selectedStockVehicle.vehicleId,
//       storeId: null, // CỐ ĐỊNH NULL
//       brandId: selectedStockVehicle.brandId,
//       quantityAvailable: values.quantityAvailable,
//       lastUpdated: today,
//     };

//     const result = await ManageStorageService.addToStock(payload);

//     // Cập nhật cache với thông tin mới nhất (storeId có thể vẫn là null)
//     setStorageCache(prev => ({
//       ...prev,
//       [selectedStockVehicle.vehicleId]: {
//         quantityAvailable: result.quantityAvailable ?? values.quantityAvailable,
//         storeId: result.storeId ?? 'N/A',
//         lastUpdated: result.lastUpdated ?? today,
//       },
//     }));

//     toast.success(`Đã thêm ${values.quantityAvailable} xe vào kho trung tâm!`);
//     setIsStockModalVisible(false);
//     setSelectedStockVehicle(null);
//     stockForm.resetFields();

//     // Tùy chọn: reload lại thông tin mới nhất từ server
//      await fetchStorageInfo(selectedStockVehicle.vehicleId, selectedStockVehicle.brandId);

//   } catch (error) {
//     console.error('Add to stock failed:', error);
//     toast.error('Thêm vào kho thất bại: ' + (error.message || 'Lỗi không xác định'));
//   } finally {
//     setLoading(false);
//   }
// };
//   const handleStockCancel = () => {
//     setIsStockModalVisible(false);
//     setSelectedStockVehicle(null);
//     stockForm.resetFields();
//   };

//   // 🔑 NEW: Open Allocate Modal
// const handleAllocate = (e, vehicle) => {
//   e.stopPropagation();

//   setSelectedAllocateVehicle(vehicle);
//   allocateForm.resetFields();
//   allocateForm.setFieldsValue({ quantity: 1 }); // Mặc định 1 xe
//   setIsAllocateModalVisible(true);
// };


//   // ko reload
//   const handleAllocateSubmit = async () => {
//   try {
//     const values = await allocateForm.validateFields();
//     const { storeId, quantity } = values;
//     const vehicleId = selectedAllocateVehicle.vehicleId;

//     if (quantity <= 0) {
//       toast.error('Số lượng phải lớn hơn 0!');
//       return;
//     }

//     // Lấy quantityAvailable từ cache
//     const storageInfo = storageCache[vehicleId];
//     if (!storageInfo || storageInfo.quantityAvailable === 'Loading...') {
//       toast.warn('Đang tải dữ liệu kho, vui lòng thử lại...');
//       return;
//     }

//     const available = parseInt(storageInfo.quantityAvailable, 10);
//     if (isNaN(available) || available < quantity) {
//       toast.error(`Chỉ còn ${available} xe trong kho trung tâm!`);
//       return;
//     }

//     setLoading(true);

//     const payload = {
//       vehicleId,
//       stores: [{ storeId, quantity }],
//     };

//     await ManageStorageService.vehicleAllocate(payload);

//     // Cập nhật cache: giảm số lượng kho trung tâm
//     setStorageCache(prev => ({
//       ...prev,
//       [vehicleId]: {
//         ...prev[vehicleId],
//         quantityAvailable: available - quantity,
//       },
//     }));

//     toast.success(`Đã phân bổ ${quantity} xe tới cửa hàng!`);
//     setIsAllocateModalVisible(false);
//     setSelectedAllocateVehicle(null);
//     allocateForm.resetFields();

//     // Không reload trang → UX mượt
//   } catch (error) {
//     toast.error('Phân bổ thất bại: ' + (error.message || 'Lỗi'));
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleAllocateCancel = () => {
//     setIsAllocateModalVisible(false);
//     setSelectedAllocateVehicle(null);
//     allocateForm.resetFields();
//   };

//   // Các hàm CRUD
//   const handleSave = async () => {
//   try {
//     const values = await form.validateFields();
//     setLoading(true);

//     // ✅ Chuẩn hóa imageUrls thành mảng
//     let imageUrlsArray = [];
//     if (values.imageUrls) {
//       // Tách chuỗi theo dấu phẩy, xuống dòng, khoảng trắng thừa
//       imageUrlsArray = values.imageUrls
//         .split(/[\n,]+/)
//         .map(url => url.trim())
//         .filter(url => url.length > 0);
//     }

//     const vehicleData = {
//       ...values,
//       imageUrls: imageUrlsArray, // Luôn là mảng
//     };

//     if (editingVehicle) {
//       const updatedVehicle = await ManageVehicleService.updateVehicle(editingVehicle.vehicleId, vehicleData);
//       const newVehicleData = {
//         ...updatedVehicle,
//         key: updatedVehicle.vehicleId.toString(),
//         status: updatedVehicle.status || 'Active',
//         imageUrls: Array.isArray(updatedVehicle.imageUrls)
//           ? updatedVehicle.imageUrls.join(', ')
//           : updatedVehicle.imageUrls || '',
//       };
//       setVehicles(vehicles.map(v => v.vehicleId === editingVehicle.vehicleId ? newVehicleData : v));
//       setFilteredVehicles(filteredVehicles.map(v => v.vehicleId === editingVehicle.vehicleId ? newVehicleData : v));
//       toast.success('Vehicle updated successfully');
//     } else {
//       const newVehicle = await ManageVehicleService.AddVehicle(vehicleData);
//       const newVehicleData = {
//         ...newVehicle,
//         key: newVehicle.vehicleId.toString(),
//         status: newVehicle.status || 'Active',
//         createDate: new Date().toLocaleDateString('en-GB'),
//         imageUrls: Array.isArray(newVehicle.imageUrls)
//           ? newVehicle.imageUrls.join(', ')
//           : newVehicle.imageUrls || '',
//       };
//       setVehicles([...vehicles, newVehicleData]);
//       setFilteredVehicles([...filteredVehicles, newVehicleData]);
//       toast.success('Vehicle added successfully');
//     }
//     setIsModalVisible(false);
//     setEditingVehicle(null);
//     form.resetFields();
//   } catch (error) {
//     toast.error('Failed to save vehicle: ' + error.message);
//   } finally {
//     setLoading(false);
//   }
// };

//    const handleEdit = (e, vehicle) => {
//   e.stopPropagation();
//   if (!vehicle.vehicleId) return toast.error('Invalid vehicle ID');
//   setEditingVehicle(vehicle);

//   // ✅ Chuyển mảng URL thành chuỗi để hiển thị trong input
//   const imageUrlsString = Array.isArray(vehicle.imageUrls)
//     ? vehicle.imageUrls.join('\n')  // Mỗi URL 1 dòng cho dễ đọc
//     : vehicle.imageUrls || '';

//   form.setFieldsValue({
//     ...vehicle,
//     imageUrls: imageUrlsString,
//   });
//   setIsModalVisible(true);
// };

//   const handleDelete = async (e, id) => {
//     e.stopPropagation();
//     if (!id) return toast.error('Invalid vehicle ID');
//     setLoading(true);
//     try {
//       await ManageVehicleService.deleteVehicle(id);
//       setVehicles(vehicles.filter(v => v.vehicleId !== id));
//       setFilteredVehicles(filteredVehicles.filter(v => v.vehicleId !== id));
//       setStorageCache(prev => {
//         const { [id]: _, ...rest } = prev;
//         return rest;
//       });
//       toast.success('Vehicle deleted successfully');
//     } catch (error) {
//       toast.error('Failed to delete vehicle: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewDetail = async (vehicle) => {
//     setSelectedVehicleId(vehicle.vehicleId);
//     setIsDetailModalVisible(true);
//     if (!storageCache[vehicle.vehicleId]) {
//       await fetchStorageInfo(vehicle.vehicleId, vehicle.brandId);
//     }
//   };

//   const handleCreate = () => {
//     setEditingVehicle(null);
//     form.resetFields();
//     setIsModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     setEditingVehicle(null);
//     form.resetFields();
//   };

//   const handleDetailCancel = () => {
//     setIsDetailModalVisible(false);
//     setSelectedVehicleId(null);
//   };

//   // Table columns
//   const columns = [
//     { title: 'Model', dataIndex: 'modelName', key: 'modelName', sorter: (a, b) => a.modelName.localeCompare(b.modelName) },
//     { title: 'Version', dataIndex: 'version', key: 'version', sorter: (a, b) => a.version.localeCompare(b.version) },
//     { title: 'Color', dataIndex: 'color', key: 'color', sorter: (a, b) => a.color.localeCompare(b.color) },
//     {
//       title: 'Price',
//       dataIndex: 'price',
//       key: 'price',
//       sorter: (a, b) => a.price - b.price,
//       render: (value) => value >= 1000000 ? `${(value / 1000000).toFixed(2)}M` : `$${value?.toFixed(2) || 'N/A'}`,
//     },
//     { title: 'Type', dataIndex: 'vehicleType', key: 'vehicleType', sorter: (a, b) => a.vehicleType.localeCompare(b.vehicleType) },
//     {
//       title: 'Quantity Available',
//       key: 'quantityAvailable',
//       render: (_, record) => {
//         const info = getStorageInfo(record.vehicleId);
//         return <span onMouseEnter={() => preloadStorageOnHover(record)}>{info.quantityAvailable}</span>;
//       },
//     },
//         {
//     title: 'Actions',
//     key: 'actions',
//     render: (_, record) => (
//        <div
//       onClick={(e) => {
//         // 👉 Ngăn sự kiện click lan lên hàng (ngăn mở detail)
//         e.stopPropagation();
//       }}
//     >
//       <Dropdown
//         trigger={['click']}
//         getPopupContainer={(trigger) => trigger.parentElement}
//         menu={{
//           items: [
//             {
//               key: 'edit',
//               label: 'Edit',
//               onClick: (e) => {
//                 e.domEvent.stopPropagation();
//                 handleEdit(e.domEvent, record);
//               },
//             },
//             {
//               key: 'addToStock',
//               label: 'Add Stock',
//               onClick: (e) => {
//                 e.domEvent.stopPropagation();
//                 handleAddToStock(e.domEvent, record);
//               },
//             },
//             {
//               key: 'allocate',
//               label: 'Allocate',
//               disabled: getStorageInfo(record.vehicleId).quantityAvailable < 1,

//               onClick: (e) => {
//                 e.domEvent.stopPropagation();
//                 handleAllocate(e.domEvent, record);
//               },
//             },
//             {
//               key: 'delete',
//               icon: <DeleteOutlined />,
//               danger: true,
//               label: (
//                 <Popconfirm
//                   title="Are you sure to delete this vehicle?"
//                   onConfirm={(e) => {
//                     e?.stopPropagation();
//                     handleDelete(e, record.vehicleId);
//                   }}
//                   onCancel={(e) => e?.stopPropagation()}
//                   okText="Yes"
//                   cancelText="No"
//                   okButtonProps={{ 
//                     style: { 
//                       background: '#007BFF', 
//                       borderColor: '#007BFF' 
//                     } 
//                   }}
//                   getPopupContainer={(trigger) => trigger.parentElement}
//                 >
//                   <span onClick={(e) => e.stopPropagation()}>Delete</span>
//                 </Popconfirm>
//               ),
//             },
//           ],
//         }}
//       >
//         <Button 
//           icon={<EllipsisOutlined />} 
//           style={buttonStyle}
//           onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
//           onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
//         />
//       </Dropdown>
//     </div>

//     ),
//   },
//   ];

//   return (
//     <div>
//       <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
//         EVM Vehicle Management
//       </Title>
//       <Row gutter={16} style={{ marginBottom: 16 }}>
//         <Col span={20}>
//           <Input
//             prefix={<SearchOutlined style={{ color: '#007BFF' }} />}
//             placeholder="Search by Model, Version, or Color"
//             style={inputStyle}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </Col>
//         <Col span={4}>
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={handleCreate}
//             style={{ ...buttonStyle, background: '#007BFF', borderColor: '#007BFF' }}
//             onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
//             onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
//           >
//             Add Vehicle
//           </Button>
//         </Col>
//       </Row>

//       <Table
//         columns={columns}
//         dataSource={filteredVehicles}
//         rowKey="key"
//         loading={loading}
//         style={{ marginTop: 16 }}
//         pagination={{
//           pageSize: 10,
//           showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} Vehicle${total !== 1 ? 's' : ''}`,
//         }}
//         onRow={(record) => ({
//           onClick: () => handleViewDetail(record),
//           onMouseEnter: () => preloadStorageOnHover(record),
//         })}
//       />

//       {/* Modal Add to Stock */}
//       <Modal
//         title="Add Vehicle to Stock"
//         open={isStockModalVisible}
//         onOk={handleStockSave}
//         onCancel={handleStockCancel}
//         okText="Add"
//         cancelText="Cancel"
//         confirmLoading={loading}
//       >
//         <Form form={stockForm} layout="vertical">
//           <Form.Item
//             label="Model"
//             style={{ marginBottom: 8, fontWeight: 'bold' }}
//           >
//             <span>{selectedStockVehicle?.modelName} - {selectedStockVehicle?.version}</span>
//           </Form.Item>
//           <Form.Item
//             name="quantityAvailable"
//             label="Quantity Available"
//             rules={[{ required: true, message: 'Please input quantity!' }]}
//           >
//             <InputNumber min={1} style={{ width: '100%' }} />
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* ✅ NEW: Allocate Modal */}
//    {/* ✅ Modal Allocate - Cập nhật để có quantity */}
//       <Modal
//         title="Allocate Vehicle to Store"
//         open={isAllocateModalVisible}
//         onOk={handleAllocateSubmit}
//         onCancel={handleAllocateCancel}
//         okText="Allocate"
//         cancelText="Cancel"
//         confirmLoading={loading}
//       >
//         {selectedAllocateVehicle && (
//           <Form form={allocateForm} layout="vertical">
//             <Form.Item label="Vehicle" style={{ marginBottom: 8, fontWeight: 'bold' }}>
//               <span>{selectedAllocateVehicle.modelName} - {selectedAllocateVehicle.version}</span>
//             </Form.Item>

//             <Form.Item
//               name="storeId"
//               label="Select Store"
//               rules={[{ required: true, message: 'Vui lòng chọn cửa hàng!' }]}
//             >
//               <Select placeholder="Chọn cửa hàng">
//                 {stores.map((store) => (
//                   <Option key={store.storeId} value={store.storeId}>
//                     {store.storeName || `Store ${store.storeId}`}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>

//             <Form.Item
//               name="quantity"
//               label="Quantity to Allocate"
//               rules={[
//                 { required: true, message: 'Vui lòng nhập số lượng!' },
//                 { type: 'number', min: 1, message: 'Số lượng phải ≥ 1' },
//               ]}
//             >
//               <InputNumber min={1} style={{ width: '100%' }} placeholder="Số lượng xe phân bổ" />
//             </Form.Item>
//           </Form>
//         )}
//       </Modal>
//       <ModalVehicle
//         isModalVisible={isModalVisible}
//         editingVehicle={editingVehicle}
//         form={form}
//         brands={brands}
//         handleSave={handleSave}
//         handleCancel={handleCancel}
//         buttonStyle={buttonStyle}
//         inputStyle={inputStyle}
//       />
//       <ViewDetailBrandVehicle
//         vehicleId={selectedVehicleId}
//         isDetailModalVisible={isDetailModalVisible}
//         handleDetailCancel={handleDetailCancel}
//         vehicles={vehicles}
//       />
//     </div>
//   );
// };

// export default BrandVehicleManage;

//----------------------------------------------------------------------------------//

import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, Dropdown, Button, Form, Input, Select, Space, Popconfirm, Typography, Row, Col, Modal, InputNumber,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, StockOutlined, EllipsisOutlined
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import ViewDetailBrandVehicle from './ViewDetailBrandVehicle';
import ModalVehicle from './ModalVehicle';
import ManageVehicleService from '../../../../services/ManageVehicleService/ManageVehicleService.jsx';
import ManageStoreService from '../../../../services/ManageStore/ManageStoreService.jsx';
import ManageStorageService from '../../../../services/ManageStorage/ManageStorageService.jsx';

const { Title } = Typography;
const { Option } = Select;

const BrandVehicleManage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isStockModalVisible, setIsStockModalVisible] = useState(false);
  const [isAllocateModalVisible, setIsAllocateModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [selectedStockVehicle, setSelectedStockVehicle] = useState(null);
  const [selectedAllocateVehicle, setSelectedAllocateVehicle] = useState(null);
  const [form] = Form.useForm();
  const [stockForm] = Form.useForm();
  const [allocateForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [brands, setBrands] = useState([]);
  const [stores, setStores] = useState([]);

  // Cache lưu trữ dữ liệu storage theo vehicleId
  const [storageCache, setStorageCache] = useState({});

  // Styles
  const buttonStyle = { borderRadius: 8, transition: 'all 0.3s ease' };
  const inputStyle = { borderRadius: 8 };

  // Lấy brandId từ localStorage
  const getBrandIdFromStorage = () => {
    try {
      const staffInfo = localStorage.getItem('staffInfo');
      if (staffInfo) {
        const parsed = JSON.parse(staffInfo);
        return parsed.brandId;
      }
    } catch (error) {
      console.error('Failed to parse staffInfo from localStorage:', error);
    }
    return null;
  };

  // 🔁 Fetch all stores (assumed scoped to current brand by backend)
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await ManageStoreService.getAllStores();
        // Ensure response is an array
        setStores(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Failed to fetch stores:', error);
        toast.error('Failed to load stores for allocation.');
      }
    };
    fetchStores();
  }, []);
  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await ManageVehicleService.getAllBrands();
        setBrands(response);
      } catch (error) {
        toast.error('Failed to fetch brands: ' + error.message);
      }
    };
    fetchBrands();
  }, []);

  // Fetch vehicles by brandId
  useEffect(() => {
    const fetchVehicles = async () => {
      const brandId = getBrandIdFromStorage();
      if (!brandId) {
        toast.error('Brand ID not found in staff information.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await ManageVehicleService.getAllVehicleByBrandId(brandId);
        const fetchedVehicles = response.map((vehicle) => ({
          ...vehicle,
          key: vehicle.vehicleId.toString(),
          status: vehicle.status || 'Active',
          imageUrls: Array.isArray(vehicle.imageUrls) ? vehicle.imageUrls.join(', ') : vehicle.imageUrls || '',
        }));
        setVehicles(fetchedVehicles);
        setFilteredVehicles(fetchedVehicles);
        toast.success('Vehicles loaded successfully');
      } catch (error) {
        toast.error('Failed to fetch vehicles: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // Preload storage
  useEffect(() => {
    if (vehicles.length > 0) {
      vehicles.forEach(vehicle => {
        if (!storageCache[vehicle.vehicleId] && vehicle.brandId) {
          fetchStorageInfo(vehicle.vehicleId, vehicle.brandId);
        }
      });
    }
  }, [vehicles]);

  // Search effect
  useEffect(() => {
    const filtered = vehicles
      .filter((vehicle) => vehicle.status !== 'Deleted')
      .filter(
        (vehicle) =>
          vehicle.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.color.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredVehicles(filtered);
  }, [searchTerm, vehicles]);

  const fetchStorageInfo = useCallback(async (vehicleId, brandId) => {
    if (storageCache[vehicleId]) return storageCache[vehicleId];

    try {
      const data = await ManageStorageService.filterStorageByBrandIdAndVehicleId(brandId, vehicleId);

      let storageInfo = { quantityAvailable: 0, storeId: 'N/A', lastUpdated: 'N/A' };

      if (data && Array.isArray(data) && data.length > 0) {
        // Tìm bản ghi có storeId === null
        const centralRecord = data.find(record => record.storeId === null);

        if (centralRecord) {
          storageInfo = {
            quantityAvailable: centralRecord.quantityAvailable ?? 0,
            storeId: 'Central', // hoặc 'N/A' nếu muốn
            lastUpdated: centralRecord.lastUpdated ?? 'N/A',
          };
        }
        // Nếu không có storeId null → vẫn giữ mặc định '0'
      }

      setStorageCache(prev => ({ ...prev, [vehicleId]: storageInfo }));
      return storageInfo;
    } catch (error) {
      console.error(`Error fetching storage for vehicle ${vehicleId}:`, error);
      const fallback = { quantityAvailable: 'Error', storeId: 'N/A', lastUpdated: 'N/A' };
      setStorageCache(prev => ({ ...prev, [vehicleId]: fallback }));
      return fallback;
    }
  }, [storageCache]);

  const getStorageInfo = useCallback((vehicleId) => {
    return storageCache[vehicleId] || { quantityAvailable: 'Loading...', storeId: 'N/A', lastUpdated: 'N/A' };
  }, [storageCache]);

  const preloadStorageOnHover = useCallback((vehicle) => {
    if (!storageCache[vehicle.vehicleId]) {
      fetchStorageInfo(vehicle.vehicleId, vehicle.brandId);
    }
  }, [fetchStorageInfo, storageCache]);

  // Handle Add to Stock
  const handleAddToStock = (e, vehicle) => {
    e.stopPropagation();
    setSelectedStockVehicle(vehicle);
    stockForm.setFieldsValue({ quantityAvailable: 1 });
    setIsStockModalVisible(true);
  };

  const handleStockSave = async () => {
    try {
      const values = await stockForm.validateFields();
      setLoading(true);

      const today = new Date().toLocaleDateString('en-GB');

      // Luôn gửi storeId = null (theo yêu cầu)
      const payload = {
        vehicleId: selectedStockVehicle.vehicleId,
        storeId: null, // CỐ ĐỊNH NULL
        brandId: selectedStockVehicle.brandId,
        quantityAvailable: values.quantityAvailable,
        lastUpdated: today,
      };

      const result = await ManageStorageService.addToStock(payload);

      // Cập nhật cache với thông tin mới nhất (storeId có thể vẫn là null)
      setStorageCache(prev => ({
        ...prev,
        [selectedStockVehicle.vehicleId]: {
          quantityAvailable: result.quantityAvailable ?? values.quantityAvailable,
          storeId: result.storeId ?? 'N/A',
          lastUpdated: result.lastUpdated ?? today,
        },
      }));

      toast.success(`Added ${values.quantityAvailable} vehicles to central stock!`);
      setIsStockModalVisible(false);
      setSelectedStockVehicle(null);
      stockForm.resetFields();

      // Tùy chọn: reload lại thông tin mới nhất từ server
      await fetchStorageInfo(selectedStockVehicle.vehicleId, selectedStockVehicle.brandId);

    } catch (error) {
      console.error('Add to stock failed:', error);
      toast.error('Failed to add to stock: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  const handleStockCancel = () => {
    setIsStockModalVisible(false);
    setSelectedStockVehicle(null);
    stockForm.resetFields();
  };

  // 🔑 NEW: Open Allocate Modal
  const handleAllocate = (e, vehicle) => {
    e.stopPropagation();

    setSelectedAllocateVehicle(vehicle);
    allocateForm.resetFields();
    allocateForm.setFieldsValue({ quantity: 1 }); // Mặc định 1 xe
    setIsAllocateModalVisible(true);
  };


  // ko reload
  const handleAllocateSubmit = async () => {
    try {
      const values = await allocateForm.validateFields();
      const { storeId, quantity } = values;
      const vehicleId = selectedAllocateVehicle.vehicleId;

      if (quantity <= 0) {
        toast.error('Quantity must be greater than 0!');
        return;
      }

      // Lấy quantityAvailable từ cache
      const storageInfo = storageCache[vehicleId];
      if (!storageInfo || storageInfo.quantityAvailable === 'Loading...') {
        toast.warn('Loading stock data, please try again...');
        return;
      }

      const available = parseInt(storageInfo.quantityAvailable, 10);
      if (isNaN(available) || available < quantity) {
        toast.error(`Only ${available} vehicles left in central stock!`);
        return;
      }

      setLoading(true);

      const payload = {
        vehicleId,
        stores: [{ storeId, quantity }],
      };

      await ManageStorageService.vehicleAllocate(payload);

      // Cập nhật cache: giảm số lượng kho trung tâm
      setStorageCache(prev => ({
        ...prev,
        [vehicleId]: {
          ...prev[vehicleId],
          quantityAvailable: available - quantity,
        },
      }));

      toast.success(`Allocated ${quantity} vehicles to store!`);
      setIsAllocateModalVisible(false);
      setSelectedAllocateVehicle(null);
      allocateForm.resetFields();

      // Không reload trang → UX mượt
    } catch (error) {
      toast.error('Allocation failed: ' + (error.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  const handleAllocateCancel = () => {
    setIsAllocateModalVisible(false);
    setSelectedAllocateVehicle(null);
    allocateForm.resetFields();
  };

  // Các hàm CRUD
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // ✅ Chuẩn hóa imageUrls thành mảng
      let imageUrlsArray = [];
      if (values.imageUrls) {
        // Tách chuỗi theo dấu phẩy, xuống dòng, khoảng trắng thừa
        imageUrlsArray = values.imageUrls
          .split(/[\n,]+/)
          .map(url => url.trim())
          .filter(url => url.length > 0);
      }

      const vehicleData = {
        ...values,
        imageUrls: imageUrlsArray, // Luôn là mảng
      };

      if (editingVehicle) {
        const updatedVehicle = await ManageVehicleService.updateVehicle(editingVehicle.vehicleId, vehicleData);
        const newVehicleData = {
          ...updatedVehicle,
          key: updatedVehicle.vehicleId.toString(),
          status: updatedVehicle.status || 'Active',
          imageUrls: Array.isArray(updatedVehicle.imageUrls)
            ? updatedVehicle.imageUrls.join(', ')
            : updatedVehicle.imageUrls || '',
        };
        setVehicles(vehicles.map(v => v.vehicleId === editingVehicle.vehicleId ? newVehicleData : v));
        setFilteredVehicles(filteredVehicles.map(v => v.vehicleId === editingVehicle.vehicleId ? newVehicleData : v));
        toast.success('Vehicle updated successfully');
      } else {
        const newVehicle = await ManageVehicleService.AddVehicle(vehicleData);
        const newVehicleData = {
          ...newVehicle,
          key: newVehicle.vehicleId.toString(),
          status: newVehicle.status || 'Active',
          createDate: new Date().toLocaleDateString('en-GB'),
          imageUrls: Array.isArray(newVehicle.imageUrls)
            ? newVehicle.imageUrls.join(', ')
            : newVehicle.imageUrls || '',
        };
        setVehicles([...vehicles, newVehicleData]);
        setFilteredVehicles([...filteredVehicles, newVehicleData]);
        toast.success('Vehicle added successfully');
      }
      setIsModalVisible(false);
      setEditingVehicle(null);
      form.resetFields();
    } catch (error) {
      toast.error('Failed to save vehicle: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (e, vehicle) => {
    e.stopPropagation();
    if (!vehicle.vehicleId) return toast.error('Invalid vehicle ID');
    setEditingVehicle(vehicle);

    // ✅ Chuyển mảng URL thành chuỗi để hiển thị trong input
    const imageUrlsString = Array.isArray(vehicle.imageUrls)
      ? vehicle.imageUrls.join('\n')  // Mỗi URL 1 dòng cho dễ đọc
      : vehicle.imageUrls || '';

    form.setFieldsValue({
      ...vehicle,
      imageUrls: imageUrlsString,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!id) return toast.error('Invalid vehicle ID');
    setLoading(true);
    try {
      await ManageVehicleService.deleteVehicle(id);
      setVehicles(vehicles.filter(v => v.vehicleId !== id));
      setFilteredVehicles(filteredVehicles.filter(v => v.vehicleId !== id));
      setStorageCache(prev => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
      toast.success('Vehicle deleted successfully');
    } catch (error) {
      toast.error('Failed to delete vehicle: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (vehicle) => {
    setSelectedVehicleId(vehicle.vehicleId);
    setIsDetailModalVisible(true);
    if (!storageCache[vehicle.vehicleId]) {
      await fetchStorageInfo(vehicle.vehicleId, vehicle.brandId);
    }
  };

  const handleCreate = () => {
    setEditingVehicle(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingVehicle(null);
    form.resetFields();
  };

  const handleDetailCancel = () => {
    setIsDetailModalVisible(false);
    setSelectedVehicleId(null);
  };

  // Table columns
  const columns = [
    { title: 'Model', dataIndex: 'modelName', key: 'modelName', sorter: (a, b) => a.modelName.localeCompare(b.modelName) },
    { title: 'Version', dataIndex: 'version', key: 'version', sorter: (a, b) => a.version.localeCompare(b.version) },
    { title: 'Color', dataIndex: 'color', key: 'color', sorter: (a, b) => a.color.localeCompare(b.color) },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (value) => value >= 1000000 ? `${(value / 1000000).toFixed(2)}M` : `$${value?.toFixed(2) || 'N/A'}`,
    },
    { title: 'Type', dataIndex: 'vehicleType', key: 'vehicleType', sorter: (a, b) => a.vehicleType.localeCompare(b.vehicleType) },
    {
      title: 'Quantity Available',
      key: 'quantityAvailable',
      render: (_, record) => {
        const info = getStorageInfo(record.vehicleId);
        return <span onMouseEnter={() => preloadStorageOnHover(record)}>{info.quantityAvailable}</span>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div
          onClick={(e) => {
            // 👉 Ngăn sự kiện click lan lên hàng (ngăn mở detail)
            e.stopPropagation();
          }}
        >
          <Dropdown
            trigger={['click']}
            getPopupContainer={(trigger) => trigger.parentElement}
            menu={{
              items: [
                {
                  key: 'edit',
                  label: 'Edit',
                  onClick: (e) => {
                    e.domEvent.stopPropagation();
                    handleEdit(e.domEvent, record);
                  },
                },
                {
                  key: 'addToStock',
                  label: 'Add Stock',
                  onClick: (e) => {
                    e.domEvent.stopPropagation();
                    handleAddToStock(e.domEvent, record);
                  },
                },
                {
                  key: 'allocate',
                  label: 'Allocate',
                  disabled: getStorageInfo(record.vehicleId).quantityAvailable < 1,

                  onClick: (e) => {
                    e.domEvent.stopPropagation();
                    handleAllocate(e.domEvent, record);
                  },
                },
                {
                  key: 'delete',
                  icon: <DeleteOutlined />,
                  danger: true,
                  label: (
                    <Popconfirm
                      title="Are you sure to delete this vehicle?"
                      onConfirm={(e) => {
                        e?.stopPropagation();
                        handleDelete(e, record.vehicleId);
                      }}
                      onCancel={(e) => e?.stopPropagation()}
                      okText="Yes"
                      cancelText="No"
                      okButtonProps={{
                        style: {
                          background: '#007BFF',
                          borderColor: '#007BFF'
                        }
                      }}
                      getPopupContainer={(trigger) => trigger.parentElement}
                    >
                      <span onClick={(e) => e.stopPropagation()}>Delete</span>
                    </Popconfirm>
                  ),
                },
              ],
            }}
          >
            <Button
              icon={<EllipsisOutlined />}
              style={buttonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </Dropdown>
        </div>

      ),
    },
  ];

  return (
    <div>
      <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
        EVM Vehicle Management
      </Title>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={20}>
          <Input
            prefix={<SearchOutlined style={{ color: '#007BFF' }} />}
            placeholder="Search by Model, Version, or Color"
            style={inputStyle}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            style={{ ...buttonStyle, background: '#007BFF', borderColor: '#007BFF' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Add Vehicle
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredVehicles}
        rowKey="key"
        loading={loading}
        style={{ marginTop: 16 }}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} Vehicle${total !== 1 ? 's' : ''}`,
        }}
        onRow={(record) => ({
          onClick: () => handleViewDetail(record),
          onMouseEnter: () => preloadStorageOnHover(record),
        })}
      />

      {/* Modal Add to Stock */}
      <Modal
        title="Add Vehicle to Stock"
        open={isStockModalVisible}
        onOk={handleStockSave}
        onCancel={handleStockCancel}
        okText="Add"
        cancelText="Cancel"
        confirmLoading={loading}
      >
        <Form form={stockForm} layout="vertical">
          <Form.Item
            label="Model"
            style={{ marginBottom: 8, fontWeight: 'bold' }}
          >
            <span>{selectedStockVehicle?.modelName} - {selectedStockVehicle?.version}</span>
          </Form.Item>
          <Form.Item
            name="quantityAvailable"
            label="Quantity Available"
            rules={[{ required: true, message: 'Please input quantity!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* ✅ NEW: Allocate Modal */}
      {/* ✅ Modal Allocate - Cập nhật để có quantity */}
      <Modal
        title="Allocate Vehicle to Store"
        open={isAllocateModalVisible}
        onOk={handleAllocateSubmit}
        onCancel={handleAllocateCancel}
        okText="Allocate"
        cancelText="Cancel"
        confirmLoading={loading}
      >
        {selectedAllocateVehicle && (
          <Form form={allocateForm} layout="vertical">
            <Form.Item label="Vehicle" style={{ marginBottom: 8, fontWeight: 'bold' }}>
              <span>{selectedAllocateVehicle.modelName} - {selectedAllocateVehicle.version}</span>
            </Form.Item>

            <Form.Item
              name="storeId"
              label="Select Store"
              rules={[{ required: true, message: 'Please select a store!' }]}
            >
              <Select placeholder="Select store">
                {stores.map((store) => (
                  <Option key={store.storeId} value={store.storeId}>
                    {store.storeName || `Store ${store.storeId}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Quantity to Allocate"
              rules={[
                { required: true, message: 'Please enter quantity!' },
                { type: 'number', min: 1, message: 'Quantity must be ≥ 1' },
              ]}
            >
              <InputNumber min={1} style={{ width: '100%' }} placeholder="Number of vehicles to allocate" />
            </Form.Item>
          </Form>
        )}
      </Modal>
      <ModalVehicle
        isModalVisible={isModalVisible}
        editingVehicle={editingVehicle}
        form={form}
        brands={brands}
        handleSave={handleSave}
        handleCancel={handleCancel}
        buttonStyle={buttonStyle}
        inputStyle={inputStyle}
      />
      <ViewDetailBrandVehicle
        vehicleId={selectedVehicleId}
        isDetailModalVisible={isDetailModalVisible}
        handleDetailCancel={handleDetailCancel}
        vehicles={vehicles}
      />
    </div>
  );
};

export default BrandVehicleManage;