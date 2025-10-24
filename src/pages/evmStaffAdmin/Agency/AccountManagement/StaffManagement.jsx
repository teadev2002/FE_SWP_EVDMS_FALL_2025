import React, { useState, useEffect } from 'react';
import {
  Table, Button, Modal, Form, Input, Space, Popconfirm, Typography,
  Row,
  Col,
} from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined, PlusOutlined,
  EditOutlined, DeleteOutlined, IdcardOutlined, LockOutlined, SearchOutlined
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const { Title } = Typography;

// Mock data for staff
const mockStaffData = [
  {
    key: '1',
    staffId: 1,
    fullName: "John Doe",
    phone: "+1-555-123-4567",
    email: "john.doe@example.com",
    password: "password123",
    status: "Active",
    role: "EVM_Staff",
    lastUpdated: "2025-10-20",
  },
  {
    key: '2',
    staffId: 2,
    fullName: "Jane Smith",
    phone: "+1-555-987-6543",
    email: "jane.smith@example.com",
    password: "password456",
    status: "Active",
    role: "EVM_Staff",
    lastUpdated: "2025-10-18",
  },
  {
    key: '3',
    staffId: 3,
    fullName: "Bob Johnson",
    phone: "+1-555-555-5555",
    email: "bob.johnson@example.com",
    password: "password789",
    status: "Inactive",
    role: "EVM_Staff",
    lastUpdated: "2025-10-22",
  },
];

const StaffManagement = () => {
  const [staffs, setStaffs] = useState(mockStaffData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Styles
  const buttonStyle = {
    borderRadius: 8,
    transition: 'all 0.3s ease',
  };

  const inputStyle = {
    borderRadius: 8,
  };

  // Handle search
  useEffect(() => {
    const filteredData = mockStaffData.filter((staff) =>
      staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setStaffs(filteredData);
  }, [searchTerm]);

  // Handle create or update staff
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editingStaff) {
        // Update existing staff
        const updatedStaff = {
          ...editingStaff,
          ...values,
          staffId: editingStaff.staffId,
          key: editingStaff.key,
          lastUpdated: dayjs().format('YYYY-MM-DD'),
        };
        setStaffs(
          staffs.map((staff) =>
            staff.staffId === editingStaff.staffId ? updatedStaff : staff
          )
        );
        toast.success('Staff updated successfully');
      } else {
        // Create new staff
        const newId = staffs.length + 1;
        const newStaff = {
          ...values,
          staffId: newId,
          key: `${newId}`,
          lastUpdated: dayjs().format('YYYY-MM-DD'),
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
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      sorter: (a, b) => dayjs(a.lastUpdated).unix() - dayjs(b.lastUpdated).unix(),
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
        EVM_Staff Management
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
          showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} Store${total !== 1 ? 's' : ''}`,
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
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please enter the status' }]}
          >
            <Input
              prefix={<IdcardOutlined style={{ color: '#007BFF' }} />}
              placeholder="Enter status (e.g., Active, Inactive)"
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
              placeholder="Enter role (e.g., EVM_Staff)"
              style={inputStyle}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffManagement;