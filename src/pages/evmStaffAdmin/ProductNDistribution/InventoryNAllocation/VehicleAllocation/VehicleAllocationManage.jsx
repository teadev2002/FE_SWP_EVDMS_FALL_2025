// fix xem dc quantity, popup phân bổ thêm auto chọn store
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

  // Lấy brandId từ localStorage
  const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
  const brandId = staffInfo.brandId;

  // Cache lưu quantityAvailable theo vehicleId + storeId
  const [quantityCache, setQuantityCache] = useState({});

  // Load stores
  useEffect(() => {
    if (!brandId) {
      toast.error('Không tìm thấy brandId trong staffInfo');
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
      toast.error('Lấy danh sách cửa hàng thất bại', error);
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
      console.error('Lỗi lấy quantity:', error);
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
      toast.error('Lấy danh sách xe thất bại', error);
      setVehiclesInStore([]);
    }
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
      toast.success(`Đã phân bổ thêm ${values.quantity} xe thành công!`);

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
      toast.error('Phân bổ thất bại: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  // Format
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  const formatDate = (date) => date ? dayjs(date, 'DD/MM/YYYY').format('DD/MM/YYYY') : '-';

  // Cột bảng stores
  const storeColumns = [
    {
      title: 'Tên Cửa Hàng',
      dataIndex: 'storeName',
      key: 'storeName',
      sorter: (a, b) => a.storeName.localeCompare(b.storeName),
    },
    {
      title: 'Địa Chỉ',
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
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => openVehiclesModal(record)}
          >
            Xem Xe
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
      title: 'Năm Sản Xuất',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Màu Sắc',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: formatPrice,
    },
    {
      title: 'Loại Xe',
      dataIndex: 'vehicleType',
      key: 'vehicleType',
    },
    {
      title: 'Số Lượng',
      key: 'quantityAvailable',
      render: (_, record) => (
          record.quantityAvailable
      ),
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'createDate',
      key: 'createDate',
      render: formatDate,
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => openAllocateModal(record)}
        >
          Phân Bổ Thêm
        </Button>
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
            placeholder="Tìm theo tên cửa hàng, địa chỉ, email..."
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
        title={`Xe tại cửa hàng: ${selectedStore?.storeName || ''}`}
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
        title={`Phân bổ thêm xe: ${selectedVehicle?.modelName || ''}`}
        open={isAllocateModalOpen}
        onCancel={() => setIsAllocateModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAllocate}
        >
          <Form.Item label="Cửa hàng">
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
            label="Số lượng phân bổ thêm"
            name="quantity"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng' },
              { type: 'number', min: 1, message: 'Số lượng phải ≥ 1' }
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Xác nhận phân bổ
              </Button>
              <Button onClick={() => setIsAllocateModalOpen(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VehicleAllocationManage;