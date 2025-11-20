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
  const [storageCache, setStorageCache] = useState({});

  const buttonStyle = { borderRadius: 8, transition: 'all 0.3s ease' };
  const inputStyle = { borderRadius: 8 };

  const getBrandIdFromStorage = () => {
    try {
      const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
      return staffInfo.brandId ? Number(staffInfo.brandId) : null;
    } catch {
      return null;
    }
  };

  const formatDate = () => new Date().toLocaleDateString('en-GB');

  // Fetch stores
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
        toast.error('Failed to fetch brands.', error);
      }
    };
    fetchBrands();
  }, []);

  // Fetch vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      const brandId = getBrandIdFromStorage();
      if (!brandId) {
        toast.error('Brand ID not found.');
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
      } catch (error) {
        toast.error('Failed to fetch inventory.', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // Preload storage
  useEffect(() => {
    if (inventory.length > 0) {
      inventory.forEach(vehicle => {
        if (!storageCache[vehicle.vehicleId]) {
          fetchStorageInfo(vehicle.vehicleId, vehicle.brandId);
        }
      });
    }
  }, [inventory]);

  // Search
  useEffect(() => {
    const filtered = inventory
      .filter(v => v.status !== 'Deleted')
      .filter(v =>
        v.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.color.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredInventory(filtered);
  }, [searchTerm, inventory]);

  // LẤY storageId + quantityAvailable (chỉ kho trung tâm)
  const fetchStorageInfo = useCallback(async (vehicleId, brandId) => {
    if (storageCache[vehicleId]) return storageCache[vehicleId];

    try {
      const data = await ManageStorageService.filterStorageByBrandIdAndVehicleId(brandId, vehicleId);
      const centralRecord = Array.isArray(data) ? data.find(r => r.storeId === null) : null;

      const info = centralRecord
        ? {
            storageId: centralRecord.storageId,
            quantityAvailable: centralRecord.quantityAvailable ?? 0,
            storeId: 'Central',
            lastUpdated: centralRecord.lastUpdated ?? 'N/A',
          }
        : { storageId: null, quantityAvailable: 0, storeId: 'Central', lastUpdated: 'N/A' };

      setStorageCache(prev => ({ ...prev, [vehicleId]: info }));
      return info;
    } catch (error) {
      console.error('Error fetching storage:', error);
      const fallback = { storageId: null, quantityAvailable: 'Error', storeId: 'N/A', lastUpdated: 'N/A' };
      setStorageCache(prev => ({ ...prev, [vehicleId]: fallback }));
      return fallback;
    }
  }, [storageCache]);

  const getStorageInfo = useCallback((vehicleId) => {
    return storageCache[vehicleId] || { storageId: null, quantityAvailable: 0, storeId: 'Central', lastUpdated: 'N/A' };
  }, [storageCache]);

  // === DÙNG updateStorage ===
  const handleAddToStock = (e, vehicle) => {
    e.stopPropagation();
    setSelectedStockVehicle(vehicle);
    stockForm.setFieldsValue({ quantityAvailable: 1 });
    setIsStockModalVisible(true);
  };

  const handleStockSave = async () => {
    try {
      const values = await stockForm.validateFields();
      const quantityToAdd = values.quantityAvailable;
      setLoading(true);

      const vehicleId = selectedStockVehicle.vehicleId;
      const brandId = selectedStockVehicle.brandId;
      const storageInfo = getStorageInfo(vehicleId);

      console.log(brandId, vehicleId, storageInfo, stores);
      // Lấy storageId từ cache
      if (!storageInfo.storageId) {
        toast.error('Central stock record not found. Please refresh.');
        return;
      }

      const currentQty = parseInt(storageInfo.quantityAvailable) || 0;
      const newQty = currentQty + quantityToAdd;

      const payload = {
        vehicleId,
        quantityAvailable: newQty,
        lastUpdated: formatDate(),
      };

      // GỌI updateStorage
      const result = await ManageStorageService.updateStorage(storageInfo.storageId, payload);

      // Cập nhật cache
      setStorageCache(prev => ({
        ...prev,
        [vehicleId]: {
          storageId: storageInfo.storageId,
          quantityAvailable: result.quantityAvailable ?? newQty,
          storeId: 'Central',
          lastUpdated: result.lastUpdated ?? payload.lastUpdated,
        },
      }));

      toast.success(`+${quantityToAdd} added to central stock!`);
      setIsStockModalVisible(false);
      setSelectedStockVehicle(null);
      stockForm.resetFields();
    } catch (error) {
      console.error('Update stock failed:', error);
      toast.error('Failed to update stock: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleStockCancel = () => {
    setIsStockModalVisible(false);
    setSelectedStockVehicle(null);
    stockForm.resetFields();
  };

  // CRUD: Add/Edit Vehicle
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const imageUrlsArray = values.imageUrls
        ? values.imageUrls.split(/[\n,]+/).map(url => url.trim()).filter(url => url)
        : [];

      const vehicleData = { ...values, imageUrls: imageUrlsArray };

      if (editingVehicle) {
        const updatedVehicle = await ManageVehicleService.updateVehicle(editingVehicle.vehicleId, vehicleData);
        const newData = {
          ...updatedVehicle,
          key: updatedVehicle.vehicleId.toString(),
          status: updatedVehicle.status || 'Active',
          imageUrls: Array.isArray(updatedVehicle.imageUrls) ? updatedVehicle.imageUrls.join(', ') : '',
        };
        setInventory(prev => prev.map(v => v.vehicleId === editingVehicle.vehicleId ? newData : v));
        setFilteredInventory(prev => prev.map(v => v.vehicleId === editingVehicle.vehicleId ? newData : v));
        toast.success('Vehicle updated.');
      } else {
        const newVehicle = await ManageVehicleService.AddVehicle(vehicleData);
        const newData = {
          ...newVehicle,
          key: newVehicle.vehicleId.toString(),
          status: 'Active',
          createDate: formatDate(),
          imageUrls: Array.isArray(newVehicle.imageUrls) ? newVehicle.imageUrls.join(', ') : '',
        };
        setInventory(prev => [...prev, newData]);
        setFilteredInventory(prev => [...prev, newData]);
        toast.success('Vehicle added.');

        // TỰ ĐỘNG +1 KHO TRUNG TÂM (nếu cần)
        // await autoAddToCentralStock(newVehicle);
      }

      setIsModalVisible(false);
      setEditingVehicle(null);
      form.resetFields();
    } catch (error) {
      toast.error('Save failed.', error);
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
      render: () => 'Central Warehouse',
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
            onChange={e => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            style={{ ...buttonStyle, background: '#007BFF', borderColor: '#007BFF' }}
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
          showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} Item${total !== 1 ? 's' : ''}`,
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
          <Form.Item label="Model" style={{ marginBottom: 8, fontWeight: 'bold' }}>
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