import React, { useState, useEffect } from 'react';
import {
  Table, Button, Modal, Form, Input, Space, Typography, Popconfirm,
} from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined, PlusOutlined,
  EditOutlined, DeleteOutlined, IdcardOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';

const { Title } = Typography;

// Mock data for dealers based on provided JSON structure
const mockDealers = [
  {
    id: 1,
    dealerId: 1,
    fullName: 'TheAnh',
    role: 'Dealer_staff',
    phone: '0123123321',
    email: 'anhhoanggg855@gmail.com',
    address: '6b5 HHG',
    storeId: 3,
  },
  {
    id: 2,
    dealerId: 2,
    fullName: 'Minh Nguyen',
    role: 'Dealer_manager',
    phone: '0987654321',
    email: 'minh.nguyen@gmail.com',
    address: '123 Tran Phu, Hanoi',
    storeId: 5,
  },
  {
    id: 3,
    dealerId: 3,
    fullName: 'Lan Hoang',
    role: 'Dealer_staff',
    phone: '0912345678',
    email: 'lan.hoang@gmail.com',
    address: '456 Le Loi, HCMC',
    storeId: 7,
  },
];

const DealerManage = () => {
  const [dealers, setDealers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDealer, setEditingDealer] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Initialize with mock data
  useEffect(() => {
    setDealers(mockDealers);
  }, []);

  // Styles
  const buttonStyle = {
    borderRadius: 8,
    transition: 'all 0.3s ease',
  };

  const inputStyle = {
    borderRadius: 8,
  };

  // Handle create or update dealer
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editingDealer) {
        // Update existing dealer
        const updatedDealer = {
          ...editingDealer,
          ...values,
          dealerId: editingDealer.dealerId, // Preserve dealerId
          id: editingDealer.dealerId, // Map dealerId to id
        };
        setDealers(
          dealers.map((dealer) =>
            dealer.id === editingDealer.id ? updatedDealer : dealer
          )
        );
        toast.success('Dealer updated successfully');
      } else {
        // Create new dealer
        const newId = dealers.length + 1;
        const newDealer = { ...values, dealerId: newId, id: newId };
        setDealers([...dealers, newDealer]);
        toast.success('Dealer added successfully');
      }
      setIsModalVisible(false);
      setEditingDealer(null);
      form.resetFields();
    } catch (error) {
      toast.error('Failed to save dealer', error);
    }
    setLoading(false);
  };

  // Handle edit
  const handleEdit = (dealer) => {
    if (!dealer.id) {
      toast.error('Cannot edit dealer: Invalid dealer ID');
      return;
    }
    setEditingDealer(dealer);
    form.setFieldsValue({
      fullName: dealer.fullName,
      role: dealer.role,
      email: dealer.email,
      phone: dealer.phone,
      address: dealer.address,
      storeId: dealer.storeId,
    });
    setIsModalVisible(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    if (!id) {
      toast.error('Cannot delete dealer: Invalid dealer ID');
      return;
    }
    setLoading(true);
    setDealers(dealers.filter((dealer) => dealer.id !== id));
    toast.success('Dealer deleted successfully');
    setLoading(false);
  };

  // Handle create new dealer
  const handleCreate = () => {
    setEditingDealer(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingDealer(null);
    form.resetFields();
  };

  // Table columns
  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Store ID',
      dataIndex: 'storeId',
      key: 'storeId',
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
            title="Are you sure to delete this dealer?"
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
        Dealer Management
      </Title>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreate}
        style={{ ...buttonStyle, background: '#007BFF', borderColor: '#007BFF', marginBottom: 16 }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        Add Dealer
      </Button>
      <Table
        columns={columns}
        dataSource={dealers}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
        loading={loading}
        style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
      />
      <Modal
        title={editingDealer ? 'Edit Dealer' : 'Add Dealer'}
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
            name="fullName"
            label="Full Name"
            rules={[
              { required: true, message: 'Please enter the full name' },
              { min: 2, message: 'Full name must be at least 2 characters' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#007BFF' }} />}
              placeholder="Enter full name"
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[
              { required: true, message: 'Please enter the role' },
              { min: 2, message: 'Role must be at least 2 characters' },
            ]}
          >
            <Input
              prefix={<IdcardOutlined style={{ color: '#007BFF' }} />}
              placeholder="Enter role (e.g., Dealer_staff)"
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
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: 'Please enter the phone number' },
              {
                pattern: /^\+?[\d\s-]{10,}$/,
                message: 'Please enter a valid phone number',
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: '#007BFF' }} />}
              placeholder="Enter phone number (e.g., +1-555-123-4567)"
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
            name="storeId"
            label="Store ID"
            rules={[
              { required: true, message: 'Please enter the store ID' },
              { type: 'number', message: 'Store ID must be a number', transform: (value) => Number(value) },
            ]}
          >
            <Input
              type="number"
              placeholder="Enter store ID"
              style={inputStyle}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DealerManage;