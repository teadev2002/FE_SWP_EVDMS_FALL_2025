// phân role
import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, Button, Modal, Form, Input, Space, Typography, Popconfirm, Row, Col, Select, message,
} from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined, PlusOutlined,
  EditOutlined, DeleteOutlined, SearchOutlined, LockOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import ManageDealerService from '../../../services/ManageDealer/ManageDealerService';
import ManageStoreService from '../../../services/ManageStore/ManageStoreService';

const { Title, Text } = Typography;
const { Option } = Select;

const DealerAccountManage = () => {
  const [allDealers, setAllDealers] = useState([]);
  const [filteredDealers, setFilteredDealers] = useState([]);
  const [storeNames, setStoreNames] = useState({});
  const [currentStoreId, setCurrentStoreId] = useState(null);
  const [currentRole, setCurrentRole] = useState(null); // LẤY ROLE
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDealer, setEditingDealer] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // LẤY storeId + role TỪ localStorage
  const getDealerInfo = useCallback(() => {
    try {
      const info = localStorage.getItem('dealerInfo');
      if (!info) return { storeId: null, role: null };
      const parsed = JSON.parse(info);
      return {
        storeId: parsed?.storeId ?? null,
        role: parsed?.role ?? null,
      };
    } catch (err) {
      console.error('Failed to parse dealerInfo:', err);
      return { storeId: null, role: null };
    }
  }, []);

  // Fetch dealers + filter theo storeId
  const fetchDealers = useCallback(async () => {
    setLoading(true);
    const { storeId, role } = getDealerInfo();

    if (!storeId) {
      message.error('Store information not found. Please log in again.');
      setLoading(false);
      return;
    }

    setCurrentStoreId(storeId);
    setCurrentRole(role); // LƯU ROLE

    try {
      const data = await ManageDealerService.getAllDealers();
      const mappedData = data
        .filter(dealer => dealer.storeId === storeId)
        .map(dealer => ({
          ...dealer,
          id: dealer.dealerId,
          key: dealer.dealerId.toString(),
        }));

      setAllDealers(mappedData);
      setFilteredDealers(searchTerm ? applySearch(mappedData, searchTerm) : mappedData);
    } catch (error) {
      toast.error(`Failed to load dealers: ${error.message || error}`);
    }
    setLoading(false);
  }, [getDealerInfo, searchTerm]);

  // Tách hàm search
  const applySearch = (data, term) => {
    return data.filter(dealer =>
      dealer.fullName.toLowerCase().includes(term.toLowerCase()) ||
      dealer.email.toLowerCase().includes(term.toLowerCase()) ||
      (dealer.phone && dealer.phone.toLowerCase().includes(term.toLowerCase()))
    );
  };

  // Initial fetch
  useEffect(() => {
    fetchDealers();
  }, [fetchDealers]);

  // Fetch stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storeData = await ManageStoreService.getAllStores();
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

  // Search client-side
  useEffect(() => {
    setFilteredDealers(searchTerm === '' ? allDealers : applySearch(allDealers, searchTerm));
  }, [searchTerm, allDealers]);

  // Save (Add or Update)
  const handleSave = async () => {
    if (currentRole !== 'Dealer_manager') {
      toast.error('You do not have permission to perform this action.');
      return;
    }

    try {
      const values = await form.validateFields();
      setLoading(true);

      const dealerData = {
        fullName: values.fullName,
        role: values.role,
        phone: values.phone,
        email: values.email,
        address: values.address,
        storeId: currentStoreId,
      };

      if (editingDealer) {
        await ManageDealerService.UpdateDealer(editingDealer.dealerId, dealerData);
        toast.success('Dealer updated successfully');
      } else {
        dealerData.password = values.password;
        await ManageDealerService.AddDealer(dealerData);
        toast.success('Dealer added successfully');
      }

      setIsModalVisible(false);
      setEditingDealer(null);
      form.resetFields();
      fetchDealers();
    } catch (error) {
      toast.error(`Failed to save dealer: ${error.message || error}`);
    }
    setLoading(false);
  };

  // Open modal for Add
  const handleAdd = () => {
    if (currentRole !== 'Dealer_manager') {
      toast.error('Only Dealer Managers can add new dealers.');
      return;
    }
    setEditingDealer(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Open modal for Edit
  const handleEdit = (dealer) => {
    if (currentRole !== 'Dealer_manager') {
      toast.error('Only Dealer Managers can edit dealers.');
      return;
    }
    setEditingDealer(dealer);
    form.setFieldsValue({
      fullName: dealer.fullName,
      role: dealer.role,
      email: dealer.email,
      phone: dealer.phone,
      address: dealer.address,
    });
    setIsModalVisible(true);
  };

  // Delete
  const handleDelete = async (id) => {
    if (currentRole !== 'Dealer_manager') {
      toast.error('Only Dealer Managers can delete dealers.');
      return;
    }
    setLoading(true);
    try {
      await ManageDealerService.DeleteDealer(id);
      toast.success('Dealer deleted successfully');
      fetchDealers();
    } catch (error) {
      toast.error(`Failed to delete dealer: ${error.message || error}`);
    }
    setLoading(false);
  };

  // Modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingDealer(null);
    form.resetFields();
  };

  // Table columns
  const columns = [
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName', sorter: (a, b) => a.fullName.localeCompare(b.fullName) },
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
    { title: 'Phone', dataIndex: 'phone', key: 'phone', sorter: (a, b) => (a.phone || '').localeCompare(b.phone || '') },
    { title: 'Email', dataIndex: 'email', key: 'email', sorter: (a, b) => a.email.localeCompare(b.email) },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          {currentRole === 'Dealer_manager' && (
            <>
              <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} type="link" style={{ color: '#007BFF' }}>
                Edit
              </Button>
              <Popconfirm title="Delete this dealer?" onConfirm={() => handleDelete(record.id)} okText="Yes" cancelText="No">
                <Button icon={<DeleteOutlined />} type="link" danger>
                  Delete
                </Button>
              </Popconfirm>
            </>
          )}
          {currentRole !== 'Dealer_manager' && (
            <Text type="secondary">No permission</Text>
          )}
        </Space>
      ),
    },
  ];

  // Kiểm tra login
  if (currentStoreId === null && loading === false) {
    return <div>Please log in to view your store's dealers.</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>My Store Dealers</Title>
      {currentStoreId && (
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          Store: <strong>{storeNames[currentStoreId] || `Store ID #${currentStoreId}`}</strong>
          {' | '}
          Your Role: <strong>{currentRole || 'Unknown'}</strong>
        </Text>
      )}

      {/* Chỉ hiện nút Add nếu là Manager */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={18}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by Name, Email, or Phone"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderRadius: 8 }}
          />
        </Col>
        <Col span={6}>
          {currentRole === 'Dealer_manager' ? (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              style={{ width: '100%', borderRadius: 8 }}
            >
              Add Dealer
            </Button>
          ) : (
            <Button disabled style={{ width: '100%', borderRadius: 8 }}>
              Add Dealer (Manager Only)
            </Button>
          )}
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredDealers}
        rowKey="key"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingDealer ? 'Edit Dealer' : 'Add New Dealer'}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
        okButtonProps={{ loading }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder="Select role">
              <Option value="Dealer_Staff">Dealer_Staff</Option>
              <Option value="Dealer_Manager">Dealer_Manager</Option>
            </Select>
          </Form.Item>

          {!editingDealer && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Enter password" />
            </Form.Item>
          )}

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item label="Store">
            <Input value={storeNames[currentStoreId] || `Store #${currentStoreId}`} disabled />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DealerAccountManage;