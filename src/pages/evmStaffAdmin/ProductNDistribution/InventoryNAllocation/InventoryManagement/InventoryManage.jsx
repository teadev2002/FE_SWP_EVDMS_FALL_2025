//  // fix quantiy va button add to stock
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Table, Button, Form, Input, Select, Typography, Row, Col, Modal, InputNumber,
// } from 'antd';
// import {
//   PlusOutlined, SearchOutlined, StockOutlined
// } from '@ant-design/icons';
// import { toast } from 'react-toastify';
// import ManageVehicleService from '../../../../../services/ManageVehicleService/ManageVehicleService.jsx';
// import ManageStoreService from '../../../../../services/ManageStore/ManageStoreService.jsx';
// import ManageStorageService from '../../../../../services/ManageStorage/ManageStorageService.jsx';
// import ModalVehicle from '../../BrandVehicle/ModalVehicle.jsx';

// const { Title } = Typography;
// const { Option } = Select;

// const InventoryManage = () => {
//   const [inventory, setInventory] = useState([]);
//   const [filteredInventory, setFilteredInventory] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isStockModalVisible, setIsStockModalVisible] = useState(false);
//   const [editingVehicle, setEditingVehicle] = useState(null);
//   const [selectedStockVehicle, setSelectedStockVehicle] = useState(null);
//   const [form] = Form.useForm();
//   const [stockForm] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [brands, setBrands] = useState([]);
//   const [setStores] = useState([]);

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

//   // Fetch all stores
//   useEffect(() => {
//     const fetchStores = async () => {
//       try {
//         const response = await ManageStoreService.getAllStores();
//         setStores(Array.isArray(response) ? response : []);
//       } catch (error) {
//         console.error('Failed to fetch stores:', error);

//       }
//     };
//     fetchStores();
//   }, []);

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
//         setInventory(fetchedVehicles);
//         setFilteredInventory(fetchedVehicles);
//         toast.success('Inventory loaded successfully');
//       } catch (error) {
//         toast.error('Failed to fetch inventory: ' + error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchVehicles();
//   }, []);

//   // Preload storage for all vehicles
//   useEffect(() => {
//     if (inventory.length > 0) {
//       inventory.forEach(vehicle => {
//         if (!storageCache[vehicle.vehicleId] && vehicle.brandId) {
//           fetchStorageInfo(vehicle.vehicleId, vehicle.brandId);
//         }
//       });
//     }
//   }, [inventory]);

//   // Search effect
//   useEffect(() => {
//     const filtered = inventory
//       .filter((vehicle) => vehicle.status !== 'Deleted')
//       .filter(
//         (vehicle) =>
//           vehicle.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           vehicle.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           vehicle.color.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     setFilteredInventory(filtered);
//   }, [searchTerm, inventory]);

//   // LẤY quantityAvailable CHỈ TỪ storeId === null (KHO TRUNG TÂM)
//   const fetchStorageInfo = useCallback(async (vehicleId, brandId) => {
//     if (storageCache[vehicleId]) return storageCache[vehicleId];

//     try {
//       const data = await ManageStorageService.filterStorageByBrandIdAndVehicleId(brandId, vehicleId);

//       let storageInfo = { quantityAvailable: 0, storeId: 'Central', lastUpdated: 'N/A' };

//       if (data && Array.isArray(data) && data.length > 0) {
//         const centralRecord = data.find(record => record.storeId === null);

//         if (centralRecord) {
//           storageInfo = {
//             quantityAvailable: centralRecord.quantityAvailable ?? 0,
//             storeId: 'Central',
//             lastUpdated: centralRecord.lastUpdated ?? 'N/A',
//           };
//         }
//         // Nếu không có → mặc định 0
//       }

//       setStorageCache(prev => ({ ...prev, [vehicleId]: storageInfo }));
//       return storageInfo;
//     } catch (error) {
//       console.error(`Error fetching storage for vehicle ${vehicleId}:`, error);
//       const fallback = { quantityAvailable: 'Error', storeId: 'N/A', lastUpdated: 'N/A' };
//       setStorageCache(prev => ({ ...prev, [vehicleId]: fallback }));
//       return fallback;
//     }
//   }, [storageCache]);

//   const getStorageInfo = useCallback((vehicleId) => {
//     return storageCache[vehicleId] || { quantityAvailable: 0, storeId: 'Central', lastUpdated: 'N/A' };
//   }, [storageCache]);

//   // Handle Add to Stock – LUÔN storeId: null
//   const handleAddToStock = (e, vehicle) => {
//     e.stopPropagation();
//     setSelectedStockVehicle(vehicle);
//     stockForm.setFieldsValue({ quantityAvailable: 1 });
//     setIsStockModalVisible(true);
//   };

//   // const handleStockSave = async () => {
//   //   try {
//   //     const values = await stockForm.validateFields();
//   //     setLoading(true);

//   //     const today = new Date().toLocaleDateString('en-GB');

//   //     const payload = {
//   //       vehicleId: selectedStockVehicle.vehicleId,
//   //       storeId: null, // CỐ ĐỊNH NULL → KHO TRUNG TÂM
//   //       brandId: selectedStockVehicle.brandId,
//   //       quantityAvailable: values.quantityAvailable,
//   //       lastUpdated: today,
//   //     };

//   //     await ManageStorageService.addToStock(payload);

//   //     // Reload dữ liệu mới nhất từ server → chính xác
//   //     await fetchStorageInfo(selectedStockVehicle.vehicleId, selectedStockVehicle.brandId);

//   //     toast.success(`Đã thêm ${values.quantityAvailable} xe vào kho trung tâm!`);
//   //     setIsStockModalVisible(false);
//   //     setSelectedStockVehicle(null);
//   //     stockForm.resetFields();

//   //     // KHÔNG RELOAD TRANG → UX MƯỢT
//   //   } catch (error) {
//   //     console.error('Add to stock failed:', error);
//   //     toast.error('Thêm vào kho thất bại: ' + (error.message || 'Lỗi không xác định'));
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//     const handleStockSave = async () => {
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

//   // CRUD: Add Vehicle
//   const handleSave = async () => {
//     try {
//       const values = await form.validateFields();
//       setLoading(true);

//       let imageUrlsArray = [];
//       if (values.imageUrls) {
//         imageUrlsArray = values.imageUrls
//           .split(/[\n,]+/)
//           .map(url => url.trim())
//           .filter(url => url.length > 0);
//       }

//       const vehicleData = { ...values, imageUrls: imageUrlsArray };

//       if (editingVehicle) {
//         const updatedVehicle = await ManageVehicleService.updateVehicle(editingVehicle.vehicleId, vehicleData);
//         const newVehicleData = {
//           ...updatedVehicle,
//           key: updatedVehicle.vehicleId.toString(),
//           status: updatedVehicle.status || 'Active',
//           imageUrls: Array.isArray(updatedVehicle.imageUrls)
//             ? updatedVehicle.imageUrls.join(', ')
//             : updatedVehicle.imageUrls || '',
//         };
//         setInventory(prev => prev.map(v => v.vehicleId === editingVehicle.vehicleId ? newVehicleData : v));
//         setFilteredInventory(prev => prev.map(v => v.vehicleId === editingVehicle.vehicleId ? newVehicleData : v));
//         toast.success('Vehicle updated successfully');
//       } else {
//         const newVehicle = await ManageVehicleService.AddVehicle(vehicleData);
//         const newVehicleData = {
//           ...newVehicle,
//           key: newVehicle.vehicleId.toString(),
//           status: newVehicle.status || 'Active',
//           createDate: new Date().toLocaleDateString('en-GB'),
//           imageUrls: Array.isArray(newVehicle.imageUrls)
//             ? newVehicle.imageUrls.join(', ')
//             : newVehicle.imageUrls || '',
//         };
//         setInventory(prev => [...prev, newVehicleData]);
//         setFilteredInventory(prev => [...prev, newVehicleData]);
//         toast.success('Vehicle added successfully');
//       }

//       setIsModalVisible(false);
//       setEditingVehicle(null);
//       form.resetFields();
//     } catch (error) {
//       toast.error('Failed to save vehicle: ' + error.message);
//     } finally {
//       setLoading(false);
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

//   // Table columns
//   const columns = [
//     { title: 'Model', dataIndex: 'modelName', key: 'modelName', sorter: (a, b) => a.modelName.localeCompare(b.modelName) },
//     { title: 'Version', dataIndex: 'version', key: 'version', sorter: (a, b) => a.version.localeCompare(b.version) },
//     {
//       title: 'Status',
//       key: 'status',
//       render: (_, record) => {
//         const qty = parseInt(getStorageInfo(record.vehicleId).quantityAvailable) || 0;
//         const text = qty > 0 ? 'In Stock' : 'Out of Stock';
//         const color = qty > 0 ? '#1890ff' : '#ff4d4f';
//         return <span style={{ color, fontWeight: 'bold' }}>{text}</span>;
//       },
//       filters: [
//         { text: 'In Stock', value: 'In Stock' },
//         { text: 'Out of Stock', value: 'Out of Stock' },
//       ],
//       onFilter: (value, record) => {
//         const qty = parseInt(getStorageInfo(record.vehicleId).quantityAvailable) || 0;
//         return (qty > 0 ? 'In Stock' : 'Out of Stock') === value;
//       },
//     },
//     {
//       title: 'Quantity (Central)',
//       key: 'quantityAvailable',
//       render: (_, record) => getStorageInfo(record.vehicleId).quantityAvailable,
//       sorter: (a, b) => {
//         const qtyA = parseInt(getStorageInfo(a.vehicleId).quantityAvailable) || 0;
//         const qtyB = parseInt(getStorageInfo(b.vehicleId).quantityAvailable) || 0;
//         return qtyA - qtyB;
//       },
//     },
//     {
//       title: 'Location',
//       key: 'location',
//       render: () => 'Central Warehouse', // Vì chỉ lấy kho trung tâm
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Button
//           type="link"
//           icon={<StockOutlined />}
//           onClick={(e) => handleAddToStock(e, record)}
//           style={{ padding: 0 }}
//         >
//           Add to Stock
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
//         Electric Vehicle Inventory Management
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
//             Add New Vehicle
//           </Button>
//         </Col>
//       </Row>

//       <Table
//         columns={columns}
//         dataSource={filteredInventory}
//         rowKey="key"
//         loading={loading}
//         style={{ marginTop: 16 }}
//         pagination={{
//           pageSize: 10,
//           showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} Item${total !== 1 ? 's' : ''}`,
//         }}
//       />

//       {/* Modal Add to Stock */}
//       <Modal
//         title="Add Vehicle to Central Stock"
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
//             label="Quantity to Add"
//             rules={[{ required: true, message: 'Please input quantity!' }]}
//           >
//             <InputNumber min={1} style={{ width: '100%' }} />
//           </Form.Item>
//         </Form>
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
//     </div>
//   );
// };

// export default InventoryManage;

//----------------------------------------------------------------------------------//

import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, Button, Form, Input, Select, Typography, Row, Col, Modal, InputNumber,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, StockOutlined
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import ManageVehicleService from '../../../../../services/ManageVehicleService/ManageVehicleService.jsx';
import ManageStoreService from '../../../../../services/ManageStore/ManageStoreService.jsx';
import ManageStorageService from '../../../../../services/ManageStorage/ManageStorageService.jsx';
import ModalVehicle from '../../BrandVehicle/ModalVehicle.jsx';

const { Title } = Typography;
const { Option } = Select;

const InventoryManage = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isStockModalVisible, setIsStockModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [selectedStockVehicle, setSelectedStockVehicle] = useState(null);
  const [form] = Form.useForm();
  const [stockForm] = Form.useForm();
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

  // Fetch all stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await ManageStoreService.getAllStores();
        setStores(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Failed to fetch stores:', error);

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
        setInventory(fetchedVehicles);
        setFilteredInventory(fetchedVehicles);
        toast.success('Inventory loaded successfully');
      } catch (error) {
        toast.error('Failed to fetch inventory: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // Preload storage for all vehicles
  useEffect(() => {
    if (inventory.length > 0) {
      inventory.forEach(vehicle => {
        if (!storageCache[vehicle.vehicleId] && vehicle.brandId) {
          fetchStorageInfo(vehicle.vehicleId, vehicle.brandId);
        }
      });
    }
  }, [inventory]);

  // Search effect
  useEffect(() => {
    const filtered = inventory
      .filter((vehicle) => vehicle.status !== 'Deleted')
      .filter(
        (vehicle) =>
          vehicle.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.color.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredInventory(filtered);
  }, [searchTerm, inventory]);

  // LẤY quantityAvailable CHỈ TỪ storeId === null (KHO TRUNG TÂM)
  const fetchStorageInfo = useCallback(async (vehicleId, brandId) => {
    if (storageCache[vehicleId]) return storageCache[vehicleId];

    try {
      const data = await ManageStorageService.filterStorageByBrandIdAndVehicleId(brandId, vehicleId);

      let storageInfo = { quantityAvailable: 0, storeId: 'Central', lastUpdated: 'N/A' };

      if (data && Array.isArray(data) && data.length > 0) {
        const centralRecord = data.find(record => record.storeId === null);

        if (centralRecord) {
          storageInfo = {
            quantityAvailable: centralRecord.quantityAvailable ?? 0,
            storeId: 'Central',
            lastUpdated: centralRecord.lastUpdated ?? 'N/A',
          };
        }
        // Nếu không có → mặc định 0
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
    return storageCache[vehicleId] || { quantityAvailable: 0, storeId: 'Central', lastUpdated: 'N/A' };
  }, [storageCache]);

  // Handle Add to Stock – LUÔN storeId: null
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

  // CRUD: Add Vehicle
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      let imageUrlsArray = [];
      if (values.imageUrls) {
        imageUrlsArray = values.imageUrls
          .split(/[\n,]+/)
          .map(url => url.trim())
          .filter(url => url.length > 0);
      }

      const vehicleData = { ...values, imageUrls: imageUrlsArray };

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
        setInventory(prev => prev.map(v => v.vehicleId === editingVehicle.vehicleId ? newVehicleData : v));
        setFilteredInventory(prev => prev.map(v => v.vehicleId === editingVehicle.vehicleId ? newVehicleData : v));
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
        setInventory(prev => [...prev, newVehicleData]);
        setFilteredInventory(prev => [...prev, newVehicleData]);
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

  // Table columns
  const columns = [
    { title: 'Model', dataIndex: 'modelName', key: 'modelName', sorter: (a, b) => a.modelName.localeCompare(b.modelName) },
    { title: 'Version', dataIndex: 'version', key: 'version', sorter: (a, b) => a.version.localeCompare(b.version) },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const qty = parseInt(getStorageInfo(record.vehicleId).quantityAvailable) || 0;
        const text = qty > 0 ? 'In Stock' : 'Out of Stock';
        const color = qty > 0 ? '#1890ff' : '#ff4d4f';
        return <span style={{ color, fontWeight: 'bold' }}>{text}</span>;
      },
      filters: [
        { text: 'In Stock', value: 'In Stock' },
        { text: 'Out of Stock', value: 'Out of Stock' },
      ],
      onFilter: (value, record) => {
        const qty = parseInt(getStorageInfo(record.vehicleId).quantityAvailable) || 0;
        return (qty > 0 ? 'In Stock' : 'Out of Stock') === value;
      },
    },
    {
      title: 'Quantity (Central)',
      key: 'quantityAvailable',
      render: (_, record) => getStorageInfo(record.vehicleId).quantityAvailable,
      sorter: (a, b) => {
        const qtyA = parseInt(getStorageInfo(a.vehicleId).quantityAvailable) || 0;
        const qtyB = parseInt(getStorageInfo(b.vehicleId).quantityAvailable) || 0;
        return qtyA - qtyB;
      },
    },
    {
      title: 'Location',
      key: 'location',
      render: () => 'Central Warehouse', // Vì chỉ lấy kho trung tâm
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="link"
          icon={<StockOutlined />}
          onClick={(e) => handleAddToStock(e, record)}
          style={{ padding: 0 }}
        >
          Add to Stock
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
        Electric Vehicle Inventory Management
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
            Add New Vehicle
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredInventory}
        rowKey="key"
        loading={loading}
        style={{ marginTop: 16 }}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} Item${total !== 1 ? 's' : ''}`,
        }}
      />

      {/* Modal Add to Stock */}
      <Modal
        title="Add Vehicle to Central Stock"
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
            label="Quantity to Add"
            rules={[{ required: true, message: 'Please input quantity!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
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
    </div>
  );
};

export default InventoryManage;