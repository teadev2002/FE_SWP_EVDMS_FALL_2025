import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Typography, Card, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FilterOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const AccountManagement = () => {
  // Sample account data
  const [accountData, setAccountData] = useState([
    {
      key: '1',
      username: 'johndoe',
      email: 'john.doe@example.com',
      role: 'Admin',
      status: 'Active',
    },
    {
      key: '2',
      username: 'janesmith',
      email: 'jane.smith@example.com',
      role: 'Sales',
      status: 'Active',
    },
    {
      key: '3',
      username: 'dealercityy',
      email: 'contact@cityydealership.com',
      role: 'Dealer',
      status: 'Suspended',
    },
  ]);

  // State for modal, form, and filters
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [roleFilter, setRoleFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [form] = Form.useForm();

  // Show modal for adding or editing
  const showModal = (record = null) => {
    if (record) {
      form.setFieldsValue(record);
      setEditingKey(record.key);
    } else {
      form.resetFields();
      setEditingKey(null);
    }
    setIsModalVisible(true);
  };

  // Handle form submission
  const handleSubmit = (values) => {
    if (editingKey) {
      // Update existing record
      setAccountData((prev) =>
        prev.map((item) =>
          item.key === editingKey ? { ...item, ...values } : item
        )
      );
      message.success('Account updated successfully');
    } else {
      // Add new record
      setAccountData((prev) => [
        ...prev,
        { key: `${prev.length + 1}`, ...values },
      ]);
      message.success('Account added successfully');
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle delete
  const handleDelete = (key) => {
    setAccountData((prev) => prev.filter((item) => item.key !== key));
    message.success('Account deleted successfully');
  };

  // Handle filters
  const handleRoleFilter = (value) => {
    setRoleFilter(value);
    applyFilters(value, statusFilter);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    applyFilters(roleFilter, value);
  };

  // Apply filters
  const applyFilters = (role, status) => {
    let filteredData = [...accountData]; // Create a copy of the original data
    if (role) {
      filteredData = filteredData.filter((item) => item.role === role);
    }
    if (status) {
      filteredData = filteredData.filter((item) => item.status === status);
    }
    setAccountData(filteredData);
  };

  // Table columns
  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Admin', value: 'Admin' },
        { text: 'Sales', value: 'Sales' },
        { text: 'Dealer', value: 'Dealer' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Suspended', value: 'Suspended' },
        { text: 'Inactive', value: 'Inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Account Management</Title>
      <Card
        title="User Accounts"
       variant="borderless"
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
        extra={
          <Space>
            <Select
              placeholder="Filter by Role"
              allowClear
              style={{ width: 200 }}
              onChange={handleRoleFilter}
            >
              <Option value="Admin">Admin</Option>
              <Option value="Sales">Sales</Option>
              <Option value="Dealer">Dealer</Option>
            </Select>
            <Select
              placeholder="Filter by Status"
              allowClear
              style={{ width: 200 }}
              onChange={handleStatusFilter}
            >
              <Option value="Active">Active</Option>
              <Option value="Suspended">Suspended</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              Add New Account
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={accountData}
          rowKey="key"
          pagination={{ pageSize: 10 }}
          style={{ marginTop: 16 }}
        />
      </Card>

      <Modal
        title={editingKey ? 'Edit Account' : 'Add Account'}
       open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ role: 'Sales', status: 'Active' }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please enter the username' }]}
          >
            <Input placeholder="e.g., johndoe" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter the email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="e.g., john.doe@example.com" />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select>
              <Option value="Admin">Admin</Option>
              <Option value="Sales">Sales</Option>
              <Option value="Dealer">Dealer</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Suspended">Suspended</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingKey ? 'Update' : 'Add'}
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountManagement;