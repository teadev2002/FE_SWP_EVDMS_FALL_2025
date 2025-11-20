// import React, { useState, useEffect } from 'react';
// import {
//   Table, Button, Space, Typography, Card, Input,
//   Modal, Form, Select, InputNumber, Tag
// } from 'antd';
// import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import ManageVehicleService from '../../../../../services/ManageVehicleService/ManageVehicleService.jsx';
// import ManageStorageService from '../../../../../services/ManageStorage/ManageStorageService.jsx';
// import ManageStoreService from '../../../../../services/ManageStore/ManageStoreService.jsx';
// import { toast } from 'react-toastify';

// const { Title } = Typography;
// const { Search } = Input;

// const VehicleAllocationManage = () => {
//   const [stores, setStores] = useState([]);
//   const [filteredStores, setFilteredStores] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchText, setSearchText] = useState('');
//   const [vehiclesInStore, setVehiclesInStore] = useState([]);
//   const [isVehiclesModalOpen, setIsVehiclesModalOpen] = useState(false);
//   const [selectedStore, setSelectedStore] = useState(null);
//   const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
//   const [selectedVehicle, setSelectedVehicle] = useState(null);
//   const [form] = Form.useForm();

//   // Lấy brandId từ localStorage
//   const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
//   const brandId = staffInfo.brandId;

//   // Cache lưu quantityAvailable theo vehicleId + storeId
//   const [quantityCache, setQuantityCache] = useState({});

//   // Load stores
//   useEffect(() => {
//     if (!brandId) {
//       toast.error('Brand ID not found in staffInfo');
//       return;
//     }
//     fetchStores();
//   }, [brandId]);

//   // API: Lấy danh sách cửa hàng
//   const fetchStores = async () => {
//     setLoading(true);
//     try {
//       const response = await ManageStoreService.getAllStores();
//       const storeList = Array.isArray(response) ? response : response.data || [];
//       setStores(storeList);
//       setFilteredStores(storeList);
//     } catch (error) {
//       toast.error('Failed to fetch stores', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Tìm kiếm stores
//   useEffect(() => {
//     const lower = searchText.toLowerCase();
//     const filtered = stores.filter(s =>
//       s.storeName?.toLowerCase().includes(lower) ||
//       s.address?.toLowerCase().includes(lower) ||
//       s.email?.toLowerCase().includes(lower)
//     );
//     setFilteredStores(filtered);
//   }, [searchText, stores]);

//   // Lấy quantityAvailable theo storeId, brandId, vehicleId
//   const fetchQuantityForVehicle = async (vehicleId, storeId) => {
//     const cacheKey = `${vehicleId}_${storeId}`;
//     if (quantityCache[cacheKey] !== undefined) {
//       return quantityCache[cacheKey];
//     }

//     try {
//       const data = await ManageStorageService.filterStorageByBrandIdAndVehicleId(brandId, vehicleId);
//       const record = Array.isArray(data) ? data.find(r => r.storeId === storeId) : null;
//       const qty = record?.quantityAvailable ?? 0;

//       setQuantityCache(prev => ({ ...prev, [cacheKey]: qty }));
//       return qty;
//     } catch (error) {
//       console.error('Error fetching quantity:', error);
//       setQuantityCache(prev => ({ ...prev, [cacheKey]: 0 }));
//       return 0;
//     }
//   };

//   // Mở modal xem xe → load xe + quantity
//   const openVehiclesModal = async (store) => {
//     setSelectedStore(store);
//     setVehiclesInStore([]);
//     setIsVehiclesModalOpen(true);

//     try {
//       const response = await ManageVehicleService.getAllVehicleByStoreId(store.storeId);
//       const vehicleList = Array.isArray(response) ? response : response.data || [];

//       // Lọc theo brandId
//       const filteredByBrand = vehicleList.filter(v => v.brandId === brandId);

//       // Load quantity cho từng xe
//       const enrichedVehicles = await Promise.all(
//         filteredByBrand.map(async (vehicle) => {
//           const qty = await fetchQuantityForVehicle(vehicle.vehicleId, store.storeId);
//           return { ...vehicle, quantityAvailable: qty };
//         })
//       );

//       setVehiclesInStore(enrichedVehicles);
//     } catch (error) {
//       toast.error('Failed to fetch vehicle list', error);
//       setVehiclesInStore([]);
//     }
//   };

//   // Đóng modal xe
//   const closeVehiclesModal = () => {
//     setIsVehiclesModalOpen(false);
//     setSelectedStore(null);
//     setVehiclesInStore([]);
//   };

//   // Mở modal allocate → mặc định storeId là cửa hàng đang xem
//   const openAllocateModal = (vehicle) => {
//     setSelectedVehicle(vehicle);
//     form.resetFields();
//     form.setFieldsValue({
//       storeId: selectedStore.storeId,
//       quantity: 1
//     });
//     setIsAllocateModalOpen(true);
//   };

//   // Xử lý allocate
//   const handleAllocate = async (values) => {
//     const payload = {
//       vehicleId: selectedVehicle.vehicleId,
//       stores: [{ storeId: values.storeId, quantity: values.quantity }]
//     };

//     try {
//       await ManageStorageService.vehicleAllocate(payload);
//       toast.success(`Allocated additional ${values.quantity} vehicles successfully!`);

//       // Cập nhật quantity trong cache
//       const cacheKey = `${selectedVehicle.vehicleId}_${values.storeId}`;
//       const currentQty = quantityCache[cacheKey] || 0;
//       setQuantityCache(prev => ({ ...prev, [cacheKey]: currentQty + values.quantity }));

//       // Cập nhật UI trong modal
//       setVehiclesInStore(prev => prev.map(v =>
//         v.vehicleId === selectedVehicle.vehicleId
//           ? { ...v, quantityAvailable: v.quantityAvailable + values.quantity }
//           : v
//       ));

//       setIsAllocateModalOpen(false);
//     } catch (error) {
//       toast.error('Allocation failed: ' + (error.message || 'Unknown error'));
//     }
//   };

//   // Format
//   const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
//   const formatDate = (date) => date ? dayjs(date, 'DD/MM/YYYY').format('DD/MM/YYYY') : '-';

//   // Cột bảng stores
//   const storeColumns = [
//     {
//       title: 'Store Name',
//       dataIndex: 'storeName',
//       key: 'storeName',
//       sorter: (a, b) => a.storeName.localeCompare(b.storeName),
//     },
//     {
//       title: 'Address',
//       dataIndex: 'address',
//       key: 'address',
//       ellipsis: true,
//     },
//     {
//       title: 'Email',
//       dataIndex: 'email',
//       key: 'email',
//       ellipsis: true,
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (_, record) => (
//         <Space>
//           <Button
//             type="primary"
//             size="small"
//             icon={<EyeOutlined />}
//             onClick={() => openVehiclesModal(record)}
//           >
//             View Vehicles
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   // Cột bảng vehicles in store
//   const vehicleColumns = [
//     {
//       title: 'Model Name',
//       dataIndex: 'modelName',
//       key: 'modelName',
//     },
//     {
//       title: 'Year',
//       dataIndex: 'year',
//       key: 'year',
//     },
//     {
//       title: 'Color',
//       dataIndex: 'color',
//       key: 'color',
//     },
//     {
//       title: 'Price',
//       dataIndex: 'price',
//       key: 'price',
//       render: formatPrice,
//     },
//     {
//       title: 'Vehicle Type',
//       dataIndex: 'vehicleType',
//       key: 'vehicleType',
//     },
//     {
//       title: 'Quantity',
//       key: 'quantityAvailable',
//       render: (_, record) => (
//         record.quantityAvailable
//       ),
//     },
//     {
//       title: 'Created Date',
//       dataIndex: 'createDate',
//       key: 'createDate',
//       render: formatDate,
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (_, record) => (
//         <Button
//           type="primary"
//           size="small"
//           onClick={() => openAllocateModal(record)}
//         >
//           Allocate More
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: '24px' }}>
//       <Title level={2}>Vehicle Allocation Management</Title>

//       <Card
//         style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
//         extra={
//           <Search
//             placeholder="Search by store name, address, email..."
//             allowClear
//             enterButton={<SearchOutlined />}
//             size="large"
//             onChange={(e) => setSearchText(e.target.value)}
//             style={{ width: 400 }}
//           />
//         }
//       >
//         <Table
//           columns={storeColumns}
//           dataSource={filteredStores}
//           rowKey="storeId"
//           loading={loading}
//           pagination={{ pageSize: 10 }}
//           scroll={{ x: 800 }}
//         />
//       </Card>

//       {/* Modal xem xe theo store */}
//       <Modal
//         title={`Vehicles at Store: ${selectedStore?.storeName || ''}`}
//         open={isVehiclesModalOpen}
//         onCancel={closeVehiclesModal}
//         footer={null}
//         width={1200}
//       >
//         <Table
//           columns={vehicleColumns}
//           dataSource={vehiclesInStore}
//           rowKey="vehicleId"
//           pagination={{ pageSize: 10 }}
//           scroll={{ x: 1000 }}
//         />
//       </Modal>

//       {/* Modal Allocate – storeId mặc định là cửa hàng đang xem */}
//       <Modal
//         title={`Allocate Additional Vehicles: ${selectedVehicle?.modelName || ''}`}
//         open={isAllocateModalOpen}
//         onCancel={() => setIsAllocateModalOpen(false)}
//         footer={null}
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={handleAllocate}
//         >
//           <Form.Item label="Store">
//             <Input
//               value={selectedStore?.storeName || ''}
//               disabled
//               style={{ color: '#000', fontWeight: 'bold' }}
//             />
//             <Form.Item
//               name="storeId"
//               noStyle
//               rules={[{ required: true }]}
//             >
//               <Input type="hidden" />
//             </Form.Item>
//           </Form.Item>

//           <Form.Item
//             label="Additional Quantity to Allocate"
//             name="quantity"
//             rules={[
//               { required: true, message: 'Please enter quantity' },
//               { type: 'number', min: 1, message: 'Quantity must be ≥ 1' }
//             ]}
//           >
//             <InputNumber min={1} style={{ width: '100%' }} />
//           </Form.Item>

//           <Form.Item>
//             <Space>
//               <Button type="primary" htmlType="submit">
//                 Confirm Allocation
//               </Button>
//               <Button onClick={() => setIsAllocateModalOpen(false)}>Cancel</Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default VehicleAllocationManage;

// recall vehicle
import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Typography, Card, Input,
  Modal, Form, Select, InputNumber, Tag
} from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import ManageVehicleService from '../../../../../services/ManageVehicleService/ManageVehicleService.jsx';
import ManageStorageService from '../../../../../services/ManageStorage/ManageStorageService.jsx';
import ManageStoreService from '../../../../../services/ManageStore/ManageStoreService.jsx';
import { toast } from 'react-toastify';

const { Title } = Typography;
const { Search } = Input;

const VehicleAllocationManage = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [vehiclesInStore, setVehiclesInStore] = useState([]);
  const [isVehiclesModalOpen, setIsVehiclesModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [form] = Form.useForm();
const [isRecallModalOpen, setIsRecallModalOpen] = useState(false);
const [recallForm] = Form.useForm();
  // Lấy brandId từ localStorage
  const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
  const brandId = staffInfo.brandId;

  // Cache lưu quantityAvailable theo vehicleId + storeId
  const [quantityCache, setQuantityCache] = useState({});

  // Load stores
  useEffect(() => {
    if (!brandId) {
      toast.error('Brand ID not found in staffInfo');
      return;
    }
    fetchStores();
  }, [brandId]);

  // API: Lấy danh sách cửa hàng
  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await ManageStoreService.getAllStores();
      const storeList = Array.isArray(response) ? response : response.data || [];
      setStores(storeList);
      setFilteredStores(storeList);
    } catch (error) {
      toast.error('Failed to fetch stores', error);
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm stores
  useEffect(() => {
    const lower = searchText.toLowerCase();
    const filtered = stores.filter(s =>
      s.storeName?.toLowerCase().includes(lower) ||
      s.address?.toLowerCase().includes(lower) ||
      s.email?.toLowerCase().includes(lower)
    );
    setFilteredStores(filtered);
  }, [searchText, stores]);

  // Lấy quantityAvailable theo storeId, brandId, vehicleId
  const fetchQuantityForVehicle = async (vehicleId, storeId) => {
    const cacheKey = `${vehicleId}_${storeId}`;
    if (quantityCache[cacheKey] !== undefined) {
      return quantityCache[cacheKey];
    }

    try {
      const data = await ManageStorageService.filterStorageByBrandIdAndVehicleId(brandId, vehicleId);
      const record = Array.isArray(data) ? data.find(r => r.storeId === storeId) : null;
      const qty = record?.quantityAvailable ?? 0;

      setQuantityCache(prev => ({ ...prev, [cacheKey]: qty }));
      return qty;
    } catch (error) {
      console.error('Error fetching quantity:', error);
      setQuantityCache(prev => ({ ...prev, [cacheKey]: 0 }));
      return 0;
    }
  };

  // Mở modal xem xe → load xe + quantity
  const openVehiclesModal = async (store) => {
    setSelectedStore(store);
    setVehiclesInStore([]);
    setIsVehiclesModalOpen(true);

    try {
      const response = await ManageVehicleService.getAllVehicleByStoreId(store.storeId);
      const vehicleList = Array.isArray(response) ? response : response.data || [];

      // Lọc theo brandId
      const filteredByBrand = vehicleList.filter(v => v.brandId === brandId);

      // Load quantity cho từng xe
      const enrichedVehicles = await Promise.all(
        filteredByBrand.map(async (vehicle) => {
          const qty = await fetchQuantityForVehicle(vehicle.vehicleId, store.storeId);
          return { ...vehicle, quantityAvailable: qty };
        })
      );

      setVehiclesInStore(enrichedVehicles);
    } catch (error) {
      toast.error('Failed to fetch vehicle list', error);
      setVehiclesInStore([]);
    }
  };
 const handleRecall = async (values) => {
  const quantity = values.quantity;
  const vehicleId = selectedVehicle.vehicleId;
  const storeId = values.storeId;

  const recallPayload = {
    vehicleId,
    stores: [{ storeId, quantity }]
  };

  try {
    setLoading(true);

    // 1. Gọi API recall → chỉ trừ ở cửa hàng
    await ManageStorageService.recallVehicle(recallPayload);

    // 2. Cộng vào kho trung tâm – backend sẽ tự tạo nếu chưa có
    const centralData = await ManageStorageService.filterStorageByBrandIdAndVehicleId(brandId, vehicleId);
    const centralRecord = Array.isArray(centralData) ? centralData.find(r => r.storeId === null) : null;

    if (!centralRecord || !centralRecord.storageId) {
      toast.error('Central warehouse record not found!');
      throw new Error('No central storage record');
    }

    const newQty = (centralRecord.quantityAvailable || 0) + quantity;

    await ManageStorageService.updateStorage(centralRecord.storageId, {
      vehicleId,
      quantityAvailable: newQty,
      lastUpdated: new Date().toLocaleDateString('en-GB'),
    });

    // 3. Cập nhật UI + cache cửa hàng
    const cacheKey = `${vehicleId}_${storeId}`;
    setQuantityCache(prev => ({
      ...prev,
      [cacheKey]: (prev[cacheKey] || 0) - quantity
    }));

    setVehiclesInStore(prev => prev.map(v =>
      v.vehicleId === vehicleId
        ? { ...v, quantityAvailable: v.quantityAvailable - quantity }
        : v
    ));

    toast.success(`Recalled ${quantity} vehicle(s) → +${quantity} to Central Warehouse!`);
    setIsRecallModalOpen(false);

  } catch (error) {
    console.error('Recall failed:', error);
    toast.error('Recall failed: ' + (error.response?.data?.message || error.message));
  } finally {
    setLoading(false);
  }
};
  const openRecallModal = (vehicle) => {
  setSelectedVehicle(vehicle);
  recallForm.resetFields();
  recallForm.setFieldsValue({
    storeId: selectedStore.storeId,
    quantity: 1
  });
  setIsRecallModalOpen(true);
};

  // Đóng modal xe
  const closeVehiclesModal = () => {
    setIsVehiclesModalOpen(false);
    setSelectedStore(null);
    setVehiclesInStore([]);
  };

  // Mở modal allocate → mặc định storeId là cửa hàng đang xem
  const openAllocateModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    form.resetFields();
    form.setFieldsValue({
      storeId: selectedStore.storeId,
      quantity: 1
    });
    setIsAllocateModalOpen(true);
  };

  // Xử lý allocate
  const handleAllocate = async (values) => {
    const payload = {
      vehicleId: selectedVehicle.vehicleId,
      stores: [{ storeId: values.storeId, quantity: values.quantity }]
    };

    try {
      await ManageStorageService.vehicleAllocate(payload);
      toast.success(`Allocated additional ${values.quantity} vehicles successfully!`);

      // Cập nhật quantity trong cache
      const cacheKey = `${selectedVehicle.vehicleId}_${values.storeId}`;
      const currentQty = quantityCache[cacheKey] || 0;
      setQuantityCache(prev => ({ ...prev, [cacheKey]: currentQty + values.quantity }));

      // Cập nhật UI trong modal
      setVehiclesInStore(prev => prev.map(v =>
        v.vehicleId === selectedVehicle.vehicleId
          ? { ...v, quantityAvailable: v.quantityAvailable + values.quantity }
          : v
      ));

      setIsAllocateModalOpen(false);
    } catch (error) {
      toast.error('Allocation failed: ' + (error.message || 'Unknown error'));
    }
  };

  // Format
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  const formatDate = (date) => date ? dayjs(date, 'DD/MM/YYYY').format('DD/MM/YYYY') : '-';

  // Cột bảng stores
  const storeColumns = [
    {
      title: 'Store Name',
      dataIndex: 'storeName',
      key: 'storeName',
      sorter: (a, b) => a.storeName.localeCompare(b.storeName),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => openVehiclesModal(record)}
          >
            View Vehicles
          </Button>
        </Space>
      ),
    },
  ];

  // Cột bảng vehicles in store
  const vehicleColumns = [
    {
      title: 'Model Name',
      dataIndex: 'modelName',
      key: 'modelName',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: formatPrice,
    },
    {
      title: 'Vehicle Type',
      dataIndex: 'vehicleType',
      key: 'vehicleType',
    },
    {
      title: 'Quantity',
      key: 'quantityAvailable',
      render: (_, record) => (
        record.quantityAvailable
      ),
    },
    {
      title: 'Created Date',
      dataIndex: 'createDate',
      key: 'createDate',
      render: formatDate,
    },
  {
  title: 'Action',
  key: 'action',
  render: (_, record) => (
    <Space>
      <Button
        type="primary"
        size="small"
        onClick={() => openAllocateModal(record)}
      >
        Allocate More
      </Button>

      {/* Nút Recall mới */}
      <Button
        type="default"
        danger
        size="small"
        onClick={() => openRecallModal(record)}
        disabled={record.quantityAvailable <= 0} // Không cho thu hồi nếu đã hết
      >
        Recall
      </Button>
    </Space>
  ),
},
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Vehicle Allocation Management</Title>

      <Card
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
        extra={
          <Search
            placeholder="Search by store name, address, email..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 400 }}
          />
        }
      >
        <Table
          columns={storeColumns}
          dataSource={filteredStores}
          rowKey="storeId"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Modal xem xe theo store */}
      <Modal
        title={`Vehicles at Store: ${selectedStore?.storeName || ''}`}
        open={isVehiclesModalOpen}
        onCancel={closeVehiclesModal}
        footer={null}
        width={1200}
      >
        <Table
          columns={vehicleColumns}
          dataSource={vehiclesInStore}
          rowKey="vehicleId"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Modal>

      {/* Modal Allocate – storeId mặc định là cửa hàng đang xem */}
      <Modal
        title={`Allocate Additional Vehicles: ${selectedVehicle?.modelName || ''}`}
        open={isAllocateModalOpen}
        onCancel={() => setIsAllocateModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAllocate}
        >
          <Form.Item label="Store">
            <Input
              value={selectedStore?.storeName || ''}
              disabled
              style={{ color: '#000', fontWeight: 'bold' }}
            />
            <Form.Item
              name="storeId"
              noStyle
              rules={[{ required: true }]}
            >
              <Input type="hidden" />
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="Additional Quantity to Allocate"
            name="quantity"
            rules={[
              { required: true, message: 'Please enter quantity' },
              { type: 'number', min: 1, message: 'Quantity must be ≥ 1' }
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Confirm Allocation
              </Button>
              <Button onClick={() => setIsAllocateModalOpen(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Recall Vehicle */}
<Modal
  title={`Recall Vehicle: ${selectedVehicle?.modelName || ''} - ${selectedVehicle?.version || ''}`}
  open={isRecallModalOpen}
  onCancel={() => setIsRecallModalOpen(false)}
  footer={null}
>
  <Form
    form={recallForm}
    layout="vertical"
    onFinish={handleRecall}
  >
    <Form.Item label="From Store">
      <Input
        value={selectedStore?.storeName || ''}
        disabled
        style={{ color: '#000', fontWeight: 'bold' }}
      />
      <Form.Item name="storeId" noStyle rules={[{ required: true }]}>
        <Input type="hidden" />
      </Form.Item>
    </Form.Item>

    <Form.Item
      label="Current Quantity at Store"
      style={{ marginBottom: 12 }}
    >
      <Tag color="blue" style={{ fontSize: 16, padding: '4px 12px' }}>
        {selectedVehicle?.quantityAvailable || 0} unit(s)
      </Tag>
    </Form.Item>

    <Form.Item
      label="Quantity to Recall"
      name="quantity"
      rules={[
        { required: true, message: 'Please enter quantity' },
        { type: 'number', min: 1, message: 'Minimum 1' },
        ( ) => ({
          validator(_, value) {
            if (!value || value <= (selectedVehicle?.quantityAvailable || 0)) {
              return Promise.resolve();
            }
            return Promise.reject(new Error(`Only ${selectedVehicle?.quantityAvailable} available to recall!`));
          },
        }),
      ]}
    >
      <InputNumber min={1} max={selectedVehicle?.quantityAvailable} style={{ width: '100%' }} />
    </Form.Item>

    <Form.Item>
      <Space>
        <Button type="primary" danger htmlType="submit" loading={loading}>
          Confirm Recall
        </Button>
        <Button onClick={() => setIsRecallModalOpen(false)}>Cancel</Button>
      </Space>
    </Form.Item>
  </Form>
</Modal>
    </div>
  );
};

export default VehicleAllocationManage;