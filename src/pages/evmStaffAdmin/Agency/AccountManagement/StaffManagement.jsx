// add new staff
import React, { useState, useEffect } from 'react';
import {
  Table, Button, Modal, Form, Input, Space, Popconfirm, Typography, Row, Col, Select,
} from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined, PlusOutlined,
  EditOutlined, DeleteOutlined, IdcardOutlined, LockOutlined, SearchOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import ManageStaffService from '../../../../services/ManageStaff/ManageStaffService';

const { Title } = Typography;
const { Option } = Select;

const StaffManagement = () => {
  const [staffs, setStaffs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch staff using ManageStaffService
  useEffect(() => {
    const fetchStaffs = async () => {
      setLoading(true);
      try {
        const data = await ManageStaffService.getAllStaffs();
        const filteredData = data.filter(staff => staff.status !== 'Deleted');
        const mappedData = filteredData.map(staff => ({
          ...staff,
          id: staff.staffId,
          key: staff.staffId.toString(),
        }));
        setStaffs(mappedData);
      } catch (error) {
        toast.error('Failed to load staffs', error);
      }
      setLoading(false);
    };
    fetchStaffs();
  }, []);

  // Handle search
  useEffect(() => {
    const fetchStaffs = async () => {
      setLoading(true);
      try {
        const data = await ManageStaffService.getAllStaffs();
        const filteredData = data
          .filter(staff => staff.status !== 'Deleted')
          .filter((staff) =>
            staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
        const mappedData = filteredData.map(staff => ({
          ...staff,
          id: staff.staffId,
          key: staff.staffId.toString(),
        }));
        setStaffs(mappedData);
      } catch (error) {
        toast.error('Failed to load staffs', error);
      }
      setLoading(false);
    };
    fetchStaffs();
  }, [searchTerm]);

  // Styles
  const buttonStyle = {
    borderRadius: 8,
    transition: 'all 0.3s ease',
  };

  const inputStyle = {
    borderRadius: 8,
  };

  // Handle create or update staff
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editingStaff) {
        // Update existing staff (placeholder, as API not provided)
        const updatedStaff = {
          ...editingStaff,
          ...values,
          staffId: editingStaff.staffId,
          key: editingStaff.key,
        };
        setStaffs(
          staffs.map((staff) =>
            staff.staffId === editingStaff.staffId ? updatedStaff : staff
          )
        );
        toast.success('Staff updated successfully');
      } else {
        // Create new staff using AddStaff API
        const newStaffData = {
          fullName: values.fullName,
          phone: values.phone,
          email: values.email,
          password: values.password || '',
          status: values.status,
          role: values.role,
        };
        const response = await ManageStaffService.AddStaff(newStaffData);
        const newStaff = {
          ...newStaffData,
          staffId: response.staffId || Math.max(...staffs.map(s => s.staffId), 0) + 1,
          id: response.staffId || Math.max(...staffs.map(s => s.staffId), 0) + 1,
          key: (response.staffId || Math.max(...staffs.map(s => s.staffId), 0) + 1).toString(),
        };
        setStaffs([...staffs, newStaff]);
        toast.success('Staff added successfully');
      }
      setIsModalVisible(false);
      setEditingStaff(null);
      form.resetFields();
    } catch (error) {
      toast.error('Failed to save staff', error);
    }
    setLoading(false);
  };

  // Handle edit
  const handleEdit = (staff) => {
    if (!staff.staffId) {
      toast.error('Cannot edit staff: Invalid staff ID');
      return;
    }
    setEditingStaff(staff);
    form.setFieldsValue({
      fullName: staff.fullName,
      phone: staff.phone,
      email: staff.email,
      password: staff.password,
      status: staff.status,
      role: staff.role,
    });
    setIsModalVisible(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    if (!id) {
      toast.error('Cannot delete staff: Invalid staff ID');
      return;
    }
    setLoading(true);
    setStaffs(staffs.filter((staff) => staff.staffId !== id));
    toast.success('Staff deleted successfully');
    setLoading(false);
  };

  // Handle create new staff
  const handleCreate = () => {
    setEditingStaff(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Handle modal cancel
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
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      sorter: (a, b) => a.phone.localeCompare(b.phone),
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
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      sorter: (a, b) => a.role.localeCompare(b.role),
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
            title="Are you sure to delete this staff?"
            onConfirm={() => handleDelete(record.staffId)}
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
        EVM Staff Management
      </Title>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={20}>
          <Input 
            prefix={<SearchOutlined style={{ color: '#007BFF' }} />}
            placeholder="Search by Name, Phone, or Email"
            style={{ ...inputStyle }}
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
            Add Staff
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={staffs}
        rowKey="key"
        loading={loading}
        style={{ marginTop: 16 }}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} Staff${total !== 1 ? 's' : ''}`,
        }}
      />
      <Modal
        title={editingStaff ? 'Edit Staff' : 'Add Staff'}
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
            name="password"
            label="Password"
            rules={[
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#007BFF' }} />}
              placeholder="Enter password (optional)"
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select
              placeholder="Select status"
              style={inputStyle}
            >
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
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
              <Option value="EVM_Staff">EVM_Staff</Option>
              <Option value="Admin">Admin</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffManagement;