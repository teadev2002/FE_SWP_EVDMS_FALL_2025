 //fix searchh
import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, Button, Modal, Form, Input, Space, Typography, Popconfirm, Row, Col, Select,
} from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined, PlusOutlined,
  EditOutlined, DeleteOutlined, IdcardOutlined, SearchOutlined, LockOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import ManageDealerService from '../../../services/ManageDealer/ManageDealerService';
import ManageStoreService from '../../../services/ManageStore/ManageStoreService';

const { Title } = Typography;
const { Option } = Select;

const DealerManage = () => {
  const [allDealers, setAllDealers] = useState([]); // Full list of dealers
  const [filteredDealers, setFilteredDealers] = useState([]); // Filtered list for display
  const [storeNames, setStoreNames] = useState({}); // Store ID to storeName mapping
  const [stores, setStores] = useState([]); // List of stores for dropdown
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDealer, setEditingDealer] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch dealers using ManageDealerService (common function)
  const fetchDealers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ManageDealerService.getAllDealers();
      const mappedData = data.map(dealer => ({
        ...dealer,
        id: dealer.dealerId,
        key: dealer.dealerId.toString(),
      }));
      setAllDealers(mappedData);
      // Apply current filter after fetch
      if (searchTerm) {
        const filtered = mappedData.filter((dealer) =>
          dealer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dealer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (dealer.phone && dealer.phone.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredDealers(filtered);
      } else {
        setFilteredDealers(mappedData);
      }
    } catch (error) {
      toast.error(`Failed to load dealers: ${error.message || error}`);
    }
    setLoading(false);
  }, [searchTerm]);

  // Initial fetch dealers
  useEffect(() => {
    fetchDealers();
  }, [fetchDealers]);

  // Fetch stores for dropdown and store names for table
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storeData = await ManageStoreService.getAllStores();
        setStores(storeData);
        const storeNameMap = {};
        storeData.forEach(store => {
          storeNameMap[store.storeId] = store.storeName || `Store ${store.storeId}`;
        });
        setStoreNames(storeNameMap);
      } catch (error) {
        toast.error(`Failed to load stores: ${error.message || error}`);
      }
    };
    fetchStores();
  }, []);

  // Handle search (client-side filter, no re-fetch)
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredDealers(allDealers);
    } else {
      const filtered = allDealers.filter((dealer) =>
        dealer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dealer.phone && dealer.phone.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredDealers(filtered);
    }
  }, [searchTerm, allDealers]);

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
        // Update existing dealer using UpdateDealer API
        const updatedDealerData = {
          fullName: values.fullName,
          role: values.role,
          phone: values.phone,
          email: values.email,
          address: values.address,
          storeId: values.storeId,
        };
        await ManageDealerService.UpdateDealer(editingDealer.dealerId, updatedDealerData);
        toast.success('Dealer updated successfully');
      } else {
        // Create new dealer using AddDealer API
        const newDealerData = {
          fullName: values.fullName,
          role: values.role,
          password: values.password,
          phone: values.phone,
          email: values.email,
          address: values.address,
          storeId: values.storeId,
        };
        await ManageDealerService.AddDealer(newDealerData);
        toast.success('Dealer added successfully');
      }
      setIsModalVisible(false);
      setEditingDealer(null);
      form.resetFields();
      // Refresh full list after save
      fetchDealers();
    } catch (error) {
      toast.error(`Failed to save dealer: ${error.message || error}`);
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
  const handleDelete = async (id) => {
    if (!id) {
      toast.error('Cannot delete dealer: Invalid dealer ID');
      return;
    }
    setLoading(true);
    try {
      await ManageDealerService.DeleteDealer(id);
      toast.success('Dealer deleted successfully');
      // Refresh full list after delete
      fetchDealers();
    } catch (error) {
      toast.error(`Failed to delete dealer: ${error.message || error}`);
    }
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
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      sorter: (a, b) => a.role.localeCompare(b.role),
      filters: [
        { text: 'Dealer_Staff', value: 'Dealer_Staff' },
        { text: 'Dealer_Manager', value: 'Dealer_Manager' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Store Name',
      dataIndex: 'storeId',
      key: 'storeId',
      render: (storeId) => storeNames[storeId] || `Store ${storeId}`,
    },
     {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      sorter: (a, b) => (a.phone || '').localeCompare(b.phone || ''),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
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
    <div>
      <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
        Dealer Management
      </Title>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={20}>
          <Input
            prefix={<SearchOutlined style={{ color: '#007BFF' }} />}
            placeholder="Search by Name, Email, or Phone"
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
            Add Dealer
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={filteredDealers}
        rowKey="key"
        loading={loading}
        style={{ marginTop: 16, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} Dealer${total !== 1 ? 's' : ''}`,
        }}
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
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select
              placeholder="Select role"
              style={inputStyle}
            >
              <Option value="Dealer_Staff">Dealer_Staff</Option>
              <Option value="Dealer_Manager">Dealer_Manager</Option>
            </Select>
          </Form.Item>
          {!editingDealer && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter the password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#007BFF' }} />}
                placeholder="Enter password"
                style={inputStyle}
              />
            </Form.Item>
          )}
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
            label="Store Name"
            rules={[{ required: true, message: 'Please select a store' }]}
          >
            <Select
              placeholder="Select store"
              style={inputStyle}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {stores.map(store => (
                <Option key={store.storeId} value={store.storeId}>
                  {store.storeName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DealerManage;