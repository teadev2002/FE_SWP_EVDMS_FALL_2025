import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, Button, Modal, Form, Input, Space, Typography, Popconfirm, Row, Col, Select, message,
} from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined, PlusOutlined,
  EditOutlined, DeleteOutlined, SearchOutlined, LockOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import ManageStaffService from '../../../services/ManageStaff/ManageStaffService';
import ManageBrandService from '../../../services/ManageBrand/ManageBrandService';

const { Title, Text } = Typography;
const { Option } = Select;

const StaffAccountManage = () => {
  const [allStaffs, setAllStaffs] = useState([]);
  const [filteredStaffs, setFilteredStaffs] = useState([]);
  const [brandNames, setBrandNames] = useState({});
  const [currentBrandId, setCurrentBrandId] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // LẤY brandId + role TỪ localStorage.staffInfo
  const getStaffInfo = useCallback(() => {
    try {
      const info = localStorage.getItem('staffInfo');
      if (!info) return { brandId: null, role: null };
      const parsed = JSON.parse(info);
      return {
        brandId: parsed?.brandId ?? null,
        role: parsed?.role ?? null,
      };
    } catch (err) {
      console.error('Failed to parse staffInfo:', err);
      return { brandId: null, role: null };
    }
  }, []);

  // Fetch staffs + filter theo brandId
  const fetchStaffs = useCallback(async () => {
    setLoading(true);
    const { brandId, role } = getStaffInfo();

    if (!brandId) {
      message.error('Brand information not found. Please log in again.');
      setLoading(false);
      return;
    }

    setCurrentBrandId(brandId);
    setCurrentRole(role);

    try {
      const data = await ManageStaffService.getAllStaffs();
      const mappedData = data
        .filter(staff => staff.brandId === brandId && staff.status !== 'Deleted')
        .map(staff => ({
          ...staff,
          id: staff.staffId,
          key: staff.staffId.toString(),
        }));

      setAllStaffs(mappedData);
      setFilteredStaffs(searchTerm ? applySearch(mappedData, searchTerm) : mappedData);
    } catch (error) {
      toast.error(`Failed to load staffs: ${error.message || error}`);
    }
    setLoading(false);
  }, [getStaffInfo, searchTerm]);

  // Tách hàm search
  const applySearch = (data, term) => {
    return data.filter(staff =>
      staff.fullName.toLowerCase().includes(term.toLowerCase()) ||
      staff.email.toLowerCase().includes(term.toLowerCase()) ||
      (staff.phone && staff.phone.toLowerCase().includes(term.toLowerCase()))
    );
  };

  // Initial fetch
  useEffect(() => {
    fetchStaffs();
  }, [fetchStaffs]);

  // Fetch brands để hiển thị tên
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandData = await ManageBrandService.getAllBrands();
        const brandNameMap = {};
        brandData.forEach(brand => {
          brandNameMap[brand.brandId] = brand.brandName || `Brand ${brand.brandId}`;
        });
        setBrandNames(brandNameMap);
      } catch (error) {
        toast.error(`Failed to load brands: ${error.message || error}`);
      }
    };
    fetchBrands();
  }, []);

  // Search client-side
  useEffect(() => {
    setFilteredStaffs(searchTerm === '' ? allStaffs : applySearch(allStaffs, searchTerm));
  }, [searchTerm, allStaffs]);

  // Save (Add or Update) – chỉ Admin
  const handleSave = async () => {
    if (currentRole !== 'Admin') {
      toast.error('Only Admins can perform this action.');
      return;
    }

    try {
      const values = await form.validateFields();
      setLoading(true);

      const staffData = {
        fullName: values.fullName,
        role: values.role,
        phone: values.phone,
        email: values.email,
        status: values.status,
        brandId: currentBrandId,
      };

      if (editingStaff) {
        // UPDATE
        if (values.password && values.password.trim()) {
          staffData.password = values.password;
        }
        await ManageStaffService.UpdateStaff(editingStaff.staffId, staffData);
        toast.success('Staff updated successfully');
      } else {
        // ADD NEW
        staffData.password = values.password;
        await ManageStaffService.AddStaff(staffData);
        toast.success('Staff added successfully');
      }

      setIsModalVisible(false);
      setEditingStaff(null);
      form.resetFields();
      fetchStaffs();
    } catch (error) {
      toast.error(`Failed to save staff: ${error.message || error}`);
    }
    setLoading(false);
  };

  // Open modal for Add
  const handleAdd = () => {
    if (currentRole !== 'Admin') {
      toast.error('Only Admins can add new staff.');
      return;
    }
    setEditingStaff(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Open modal for Edit
  const handleEdit = (staff) => {
    if (currentRole !== 'Admin') {
      toast.error('Only Admins can edit staff.');
      return;
    }
    setEditingStaff(staff);
    form.setFieldsValue({
      fullName: staff.fullName,
      role: staff.role,
      email: staff.email,
      phone: staff.phone,
      status: staff.status,
    });
    setIsModalVisible(true);
  };

  // Delete
  const handleDelete = async (id) => {
    if (currentRole !== 'Admin') {
      toast.error('Only Admins can delete staff.');
      return;
    }
    setLoading(true);
    try {
      await ManageStaffService.DeleteStaff(id);
      toast.success('Staff deleted successfully');
      fetchStaffs();
    } catch (error) {
      toast.error(`Failed to delete staff: ${error.message || error}`);
    }
    setLoading(false);
  };

  // Modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingStaff(null);
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
        { text: 'EVM_Staff', value: 'EVM_Staff' },
        { text: 'Admin', value: 'Admin' },
      ],
      onFilter: (value, record) => record.role === value,
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
          {currentRole === 'Admin' ? (
            <>
              <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} type="link" style={{ color: '#007BFF' }}>
                Edit
              </Button>
              <Popconfirm title="Delete this staff?" onConfirm={() => handleDelete(record.id)} okText="Yes" cancelText="No">
                <Button icon={<DeleteOutlined />} type="link" danger>
                  Delete
                </Button>
              </Popconfirm>
            </>
          ) : (
            <Text type="secondary">No permission</Text>
          )}
        </Space>
      ),
    },
  ];

  // Kiểm tra login
  if (currentBrandId === null && loading === false) {
    return <div>Please log in to view your brand's staff.</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>My Brand Staff</Title>
      {currentBrandId && (
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          Brand: <strong>{brandNames[currentBrandId] || `Brand ID #${currentBrandId}`}</strong>
          {' | '}
          Your Role: <strong>{currentRole || 'Unknown'}</strong>
        </Text>
      )}

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
          {currentRole === 'Admin' ? (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              style={{ width: '100%', borderRadius: 8 }}
            >
              Add Staff
            </Button>
          ) : (
            <Button disabled style={{ width: '100%', borderRadius: 8 }}>
              Add Staff (Admin Only)
            </Button>
          )}
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredStaffs}
        rowKey="key"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingStaff ? 'Edit Staff' : 'Add New Staff'}
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
              <Option value="EVM_Staff">EVM_Staff</Option>
              <Option value="Admin">Admin</Option>
            </Select>
          </Form.Item>

          {!editingStaff && (
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

          {editingStaff && (
            <Form.Item
              name="password"
              label="New Password (optional)"
              rules={[
                {
                  validator: (_, value) =>
                    !value || value.length >= 6
                      ? Promise.resolve()
                      : Promise.reject(new Error('Password must be at least 6 characters')),
                },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Leave blank to keep current" />
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
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Brand">
            <Input value={brandNames[currentBrandId] || `Brand #${currentBrandId}`} disabled />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffAccountManage;