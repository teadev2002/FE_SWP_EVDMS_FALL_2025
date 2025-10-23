// core feature
import React, { useState, useEffect } from 'react';
import {
  Table, Button, Modal, Form, Input, Space, Typography, Popconfirm, Select,
  Row,
  Col,
} from 'antd';
import {
  MailOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ShopOutlined, SearchOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import ManageStoreService from '../../../services/ManageStore/ManageStoreService';
import ManageServicePromotions from '../../../services/ManagePromotions/ManageServicePromotions';

const { Title } = Typography;
const { Option } = Select;

const StoreManage = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Fetch stores and their promotion details
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const data = await ManageStoreService.getAllStores();
        const mappedData = await Promise.all(
          data.map(async (store) => {
            let discountPercent = null;
            if (store.promotionId) {
              try {
                const promotion = await ManageServicePromotions.getPromotionById(store.promotionId);
                discountPercent = promotion.discountPercent;
              } catch (error) {
                console.error(`Failed to fetch promotion ${store.promotionId}:`, error);
              }
            }
            return {
              ...store,
              id: store.storeId,
              discountPercent,
            };
          })
        );
        setStores(mappedData);
        setFilteredStores(mappedData); // Initialize filteredStores
      } catch (error) {
        toast.error('Failed to load stores',error);
      }
      setLoading(false);
    };
    fetchStores();
  }, []);

  // Fetch promotions when modal is opened
  useEffect(() => {
    if (isModalVisible) {
      const fetchPromotions = async () => {
        try {
          const data = await ManageServicePromotions.getAllPromotions();
          setPromotions(data);
        } catch (error) {
          toast.error('Failed to load promotions',error);
        }
      };
      fetchPromotions();
    }
  }, [isModalVisible]);

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    const lowerValue = value.toLowerCase();
    const filtered = stores.filter((store) =>
      store.storeName.toLowerCase().includes(lowerValue) ||
      store.address.toLowerCase().includes(lowerValue) ||
      store.email.toLowerCase().includes(lowerValue) ||
      (store.discountPercent !== null && store.discountPercent.toString().includes(lowerValue))
    );
    setFilteredStores(filtered);
  };

  // Styles
  const buttonStyle = {
    borderRadius: 8,
    transition: 'all 0.3s ease',
  };

  const inputStyle = {
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  };

  // Handle create or update store
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingStore) {
        // Update existing store
        const updateData = {
          storeName: values.storeName,
          address: values.address,
          email: values.email,
          promotionId: values.promotionId || 0, // Send 0 if no promotion is selected
        };
        const response = await ManageStoreService.updateStore(editingStore.storeId, updateData);
        let discountPercent = null;
        if (response.promotionId) {
          try {
            const promotion = await ManageServicePromotions.getPromotionById(response.promotionId);
            discountPercent = promotion.discountPercent;
          } catch (error) {
            console.error(`Failed to fetch promotion ${response.promotionId}:`, error);
          }
        }
        const updatedStore = {
          ...response,
          id: response.storeId,
          discountPercent,
        };
        const updatedStores = stores.map((store) =>
          store.id === editingStore.id ? updatedStore : store
        );
        setStores(updatedStores);
        setFilteredStores(
          updatedStores.filter((store) =>
            store.storeName.toLowerCase().includes(searchText.toLowerCase()) ||
            store.address.toLowerCase().includes(searchText.toLowerCase()) ||
            store.email.toLowerCase().includes(searchText.toLowerCase()) ||
            (store.discountPercent !== null && store.discountPercent.toString().includes(searchText.toLowerCase()))
          )
        );
        toast.success('Store updated successfully');
      } else {
        // Create new store
        const response = await ManageStoreService.addStore(values);
        let discountPercent = null;
        if (response.promotionId) {
          try {
            const promotion = await ManageServicePromotions.getPromotionById(response.promotionId);
            discountPercent = promotion.discountPercent;
          } catch (error) {
            console.error(`Failed to fetch promotion ${response.promotionId}:`, error);
          }
        }
        const newStore = {
          ...response,
          id: response.storeId,
          discountPercent,
        };
        const updatedStores = [...stores, newStore];
        setStores(updatedStores);
        setFilteredStores(
          updatedStores.filter((store) =>
            store.storeName.toLowerCase().includes(searchText.toLowerCase()) ||
            store.address.toLowerCase().includes(searchText.toLowerCase()) ||
            store.email.toLowerCase().includes(searchText.toLowerCase()) ||
            (store.discountPercent !== null && store.discountPercent.toString().includes(searchText.toLowerCase()))
          )
        );
        toast.success('Store added successfully');
      }

      setIsModalVisible(false);
      setEditingStore(null);
      form.resetFields();
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Failed to ${editingStore ? 'update' : 'add'} store`;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (store) => {
    if (!store.id) {
      toast.error('Cannot edit store: Invalid store ID');
      return;
    }
    setEditingStore(store);
    form.setFieldsValue({
      storeName: store.storeName,
      address: store.address,
      email: store.email,
      promotionId: store.promotionId || null,
    });
    setIsModalVisible(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!id) {
      toast.error('Cannot delete store: Invalid store ID');
      return;
    }
    setLoading(true);
    try {
      await ManageStoreService.deleteStore(id);
      const updatedStores = stores.filter((store) => store.id !== id);
      setStores(updatedStores);
      setFilteredStores(
        updatedStores.filter((store) =>
          store.storeName.toLowerCase().includes(searchText.toLowerCase()) ||
          store.address.toLowerCase().includes(searchText.toLowerCase()) ||
          store.email.toLowerCase().includes(searchText.toLowerCase()) ||
          (store.discountPercent !== null && store.discountPercent.toString().includes(searchText.toLowerCase()))
        )
      );
      toast.success('Store deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete store';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle create new store
  const handleCreate = () => {
    setEditingStore(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingStore(null);
    form.resetFields();
  };

  // Table columns with sorting
  const columns = [
    {
      title: 'Store ID',
      dataIndex: 'storeId',
      key: 'storeId',
      sorter: (a, b) => a.storeId - b.storeId,
    },
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
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Discount Percent',
      dataIndex: 'discountPercent',
      key: 'discountPercent',
      render: (discountPercent) => (discountPercent !== null ? `${discountPercent}%` : 'No Promotion'),
      sorter: (a, b) => (a.discountPercent || 0) - (b.discountPercent || 0),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ ...buttonStyle, color: '#007BFF', borderColor: '#007BFF' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this store?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ style: { ...buttonStyle, background: '#007BFF', borderColor: '#007BFF' } }}
            cancelButtonProps={{ style: buttonStyle }}
          >
            <Button
              icon={<DeleteOutlined />}
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
        Store Management
      </Title>
         <Row gutter={16} style={{ marginBottom: 16 }}>
  <Col span={20}>
    <Input.Search
      placeholder="Search by Store Name, Address, Email, or Discount Percent"
      value={searchText}
      onChange={(e) => handleSearch(e.target.value)}
      style={{ borderRadius: 8 }}
      allowClear
      prefix={<SearchOutlined />}
    />
  </Col>
  <Col span={4}>
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={handleCreate}
      style={{ ...buttonStyle, background: '#007BFF', borderColor: '#007BFF', width: '100%' }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      Add Store
    </Button>
  </Col>
</Row>
      <Table
        columns={columns}
        dataSource={filteredStores}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} Store${total !== 1 ? 's' : ''}`,
        }}
        bordered
        loading={loading}
        style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
      />
      <Modal
        title={editingStore ? 'Edit Store' : 'Add Store'}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
        okButtonProps={{ style: { ...buttonStyle, background: '#007BFF', borderColor: '#007BFF' }, loading: loading }}
        cancelButtonProps={{ style: buttonStyle }}
      >
        <Form
          form={form}
          layout="vertical"
        
        >
          <Form.Item
            name="storeName"
            label="Store Name"
            rules={[
              { required: true, message: 'Please enter the store name' },
              { min: 2, message: 'Store name must be at least 2 characters' },
            ]}
          >
            <Input
              prefix={<ShopOutlined style={{ color: '#007BFF' }} />}
              placeholder="Enter store name"
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[
              { required: true, message: 'Please enter the address' },
              { min: 5, message: 'Address must be at least 5 characters' },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter address"
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter the email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#007BFF' }} />}
              placeholder="Enter email"
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item
            name="promotionId"
            label="Promotion"
          >
            <Select
              placeholder="No promotion"
              style={inputStyle}
              allowClear
            >
             
              {promotions.map((promotion) => (
                <Option key={promotion.promotionId} value={promotion.promotionId}>
                  {`${promotion.title} (${promotion.discountPercent}%)`}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StoreManage;