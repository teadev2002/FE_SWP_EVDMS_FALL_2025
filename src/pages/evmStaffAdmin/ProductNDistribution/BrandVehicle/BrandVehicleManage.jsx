import React, { useState, useEffect } from 'react';
import {
  Table, Button, Form, Input, Select, Space, Popconfirm, Typography, Row, Col,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import ViewDetailBrandVehicle from './ViewDetailBrandVehicle';
import ModalVehicle from './ModalVehicle';
import ManageVehicleService from '../../../../services/ManageVehicleService/ManageVehicleService.jsx';
import ManageStoreService from '../../../../services/ManageStore/ManageStoreService.jsx';
const { Title } = Typography;
const { Option } = Select;

const BrandVehicleManage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [storageData] = useState([
    { storageId: 1, vehicleId: 1, storeId: 1, quantityAvailable: 1, lastUpdated: '24/10/2025' },
    { storageId: 2, vehicleId: 2, storeId: 2, quantityAvailable: 2, lastUpdated: '25/10/2025' },
    { storageId: 3, vehicleId: 3, storeId: 3, quantityAvailable: 3, lastUpdated: '25/10/2025' },
    { storageId: 4, vehicleId: 4, storeId: 4, quantityAvailable: 4, lastUpdated: '24/10/2025' },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [brands, setBrands] = useState([]);

  // Styles
  const buttonStyle = {
    borderRadius: 8,
    transition: 'all 0.3s ease',
  };

  const inputStyle = {
    borderRadius: 8,
  };

  // Fetch brands for brandId dropdown
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

  // Fetch vehicles from API
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const response = await ManageVehicleService.getAllVehicle();
        const fetchedVehicles = response.map((vehicle) => ({
          ...vehicle,
          key: vehicle.vehicleId.toString(),
          status: vehicle.status || 'Active',
          imageUrls: Array.isArray(vehicle.imageUrls) ? vehicle.imageUrls.join(', ') : vehicle.imageUrls || '', // Normalize to string for UI
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

  // Handle create or update vehicle
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Prepare the vehicle data
      const vehicleData = {
        ...values,
        imageUrls: editingVehicle
          ? values.imageUrls || '' // Send as string for updateVehicle
          : values.imageUrls ? [values.imageUrls] : [], // Send as array for AddVehicle
      };

      if (editingVehicle) {
        // Update vehicle
        const updatedVehicle = await ManageVehicleService.updateVehicle(editingVehicle.vehicleId, vehicleData);
        const newVehicleData = {
          ...updatedVehicle,
          key: updatedVehicle.vehicleId.toString(),
          status: updatedVehicle.status || 'Active',
          imageUrls: Array.isArray(updatedVehicle.imageUrls) ? updatedVehicle.imageUrls.join(', ') : updatedVehicle.imageUrls || '', // Normalize response
        };
        setVehicles(
          vehicles.map((vehicle) =>
            vehicle.vehicleId === editingVehicle.vehicleId ? newVehicleData : vehicle
          )
        );
        setFilteredVehicles(
          filteredVehicles.map((vehicle) =>
            vehicle.vehicleId === editingVehicle.vehicleId ? newVehicleData : vehicle
          )
        );
        toast.success('Vehicle updated successfully');
      } else {
        // Create vehicle using AddVehicle API
        const newVehicle = await ManageVehicleService.AddVehicle(vehicleData);
        const newVehicleData = {
          ...newVehicle,
          key: newVehicle.vehicleId.toString(),
          status: newVehicle.status || 'Active',
          createDate: new Date().toLocaleDateString('en-GB'),
          imageUrls: Array.isArray(newVehicle.imageUrls) ? newVehicle.imageUrls.join(', ') : newVehicle.imageUrls || '', // Normalize response
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

  // Handle edit
  const handleEdit = (e, vehicle) => {
    e.stopPropagation();
    if (!vehicle.vehicleId) {
      toast.error('Cannot edit vehicle: Invalid vehicle ID');
      return;
    }
    setEditingVehicle(vehicle);
    form.setFieldsValue({
      ...vehicle,
      imageUrls: Array.isArray(vehicle.imageUrls) ? vehicle.imageUrls.join(', ') : vehicle.imageUrls || '', // Ensure string for form
    });
    setIsModalVisible(true);
  };

  // Handle delete
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!id) {
      toast.error('Cannot delete vehicle: Invalid vehicle ID');
      return;
    }
    setLoading(true);
    try {
      await ManageVehicleService.deleteVehicle(id);
      setVehicles(vehicles.filter((vehicle) => vehicle.vehicleId !== id));
      setFilteredVehicles(filteredVehicles.filter((vehicle) => vehicle.vehicleId !== id));
      toast.success('Vehicle deleted successfully');
    } catch (error) {
      toast.error('Failed to delete vehicle: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle view detail
  const handleViewDetail = (vehicle) => {
    setSelectedVehicleId(vehicle.vehicleId);
    setIsDetailModalVisible(true);
  };

  // Handle create new vehicle
  const handleCreate = () => {
    setEditingVehicle(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingVehicle(null);
    form.resetFields();
  };

  // Handle detail modal cancel
  const handleDetailCancel = () => {
    setIsDetailModalVisible(false);
    setSelectedVehicleId(null);
  };

  // Get storage info for a vehicle
  const getStorageInfo = (vehicleId) => {
    const storage = storageData.find((item) => item.vehicleId === vehicleId);
    return storage ? storage : { quantityAvailable: 'N/A', storeId: 'N/A', lastUpdated: 'N/A' };
  };

  // Table columns
  const columns = [
    {
      title: 'Model',
      dataIndex: 'modelName',
      key: 'modelName',
      sorter: (a, b) => a.modelName.localeCompare(b.modelName),
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      sorter: (a, b) => a.version.localeCompare(b.version),
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      sorter: (a, b) => a.color.localeCompare(b.color),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (value) => value >= 1000000 ? `${(value / 1000000).toFixed(2)}M` : `$${value?.toFixed(2) || 'N/A'}`,
    },
    {
      title: 'Type',
      dataIndex: 'vehicleType',
      key: 'vehicleType',
      sorter: (a, b) => a.vehicleType.localeCompare(b.vehicleType),
    },
    {
      title: 'Quantity Available',
      dataIndex: 'vehicleId',
      key: 'quantityAvailable',
      render: (vehicleId) => getStorageInfo(vehicleId).quantityAvailable,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Inactive', value: 'Inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={(e) => handleEdit(e, record)}
            style={{ ...buttonStyle, color: '#007BFF', borderColor: '#007BFF' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this vehicle?"
            onConfirm={(e) => handleDelete(e, record.vehicleId)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ style: { ...buttonStyle, background: '#007BFF', borderColor: '#007BFF' } }}
            cancelButtonProps={{ style: buttonStyle }}
            onCancel={(e) => e.stopPropagation()}
          >
            <Button
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
              style={{ ...buttonStyle, color: '#FF4D4F', borderColor: '#FF4D4F' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
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
        })}
      />
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
        getStorageInfo={getStorageInfo}
        buttonStyle={buttonStyle}
      />
    </div>
  );
};

export default BrandVehicleManage;

 