import React, { useState, useEffect } from 'react';
import {
  Table, Button, Modal, Form, Input, Space, Typography, Popconfirm,
} from 'antd';
import {
  MailOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ShopOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';

const { Title } = Typography;

// Mock data for stores based on provided JSON structure
const mockStores = [
  {
    id: 1,
    storeId: 1,
    storeName: 'ABC Store',
    address: '123 Main St, Springfield, USA',
    email: 'abc@store.com',
    promotionId: null,
  },
  {
    id: 2,
    storeId: 2,
    storeName: 'XYZ Outlet',
    address: '456 Elm St, Rivertown, USA',
    email: 'xyz@store.com',
    promotionId: 101,
  },
  {
    id: 3,
    storeId: 3,
    storeName: 'City Mart',
    address: '789 Oak St, Metropolis, USA',
    email: 'citymart@store.com',
    promotionId: 102,
  },
];

const StoreManage = () => {
  const [stores, setStores] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Initialize with mock data
  useEffect(() => {
    setStores(mockStores);
  }, []);

  // Styles
  const buttonStyle = {
    borderRadius: 8,
    transition: 'all 0.3s ease',
  };

  const inputStyle = {
    borderRadius: 8,
  };

  // Handle create or update store
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editingStore) {
        // Update existing store
        const updatedStore = {
          ...editingStore,
          ...values,
          storeId: editingStore.storeId, // Preserve storeId
          id: editingStore.storeId, // Map storeId to id
        };
        setStores(
          stores.map((store) =>
            store.id === editingStore.id ? updatedStore : store
          )
        );
        toast.success('Store updated successfully');
      } else {
        // Create new store
        const newId = stores.length + 1;
        const newStore = { ...values, storeId: newId, id: newId };
        setStores([...stores, newStore]);
        toast.success('Store added successfully');
      }
      setIsModalVisible(false);
      setEditingStore(null);
      form.resetFields();
    } catch (error) {
      toast.error('Failed to save store',error);
    }
    setLoading(false);
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
      promotionId: store.promotionId,
    });
    setIsModalVisible(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    if (!id) {
      toast.error('Cannot delete store: Invalid store ID');
      return;
    }
    setLoading(true);
    setStores(stores.filter((store) => store.id !== id));
    toast.success('Store deleted successfully');
    setLoading(false);
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

  // Table columns
  const columns = [
    {
      title: 'Store Name',
      dataIndex: 'storeName',
      key: 'storeName',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Promotion ID',
      dataIndex: 'promotionId',
      key: 'promotionId',
      render: (promotionId) => promotionId || 'None',
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
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
        Store Management
      </Title>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreate}
        style={{ ...buttonStyle, background: '#007BFF', borderColor: '#007BFF', marginBottom: 16 }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        Add Store
      </Button>
      <Table
        columns={columns}
        dataSource={stores}
        rowKey="id"
        pagination={{ pageSize: 5 }}
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
          style={{ padding: '24px' }}
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
            label="Promotion ID"
            rules={[
              {
                type: 'number',
                message: 'Promotion ID must be a number',
                transform: (value) => (value ? Number(value) : null),
              },
            ]}
          >
            <Input
              type="number"
              placeholder="Enter promotion ID (optional)"
              style={inputStyle}
              allowClear
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StoreManage;