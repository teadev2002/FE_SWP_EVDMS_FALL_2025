import React, { useState, useEffect } from 'react';
import {
  Table, Button, Modal, Form, Input, Space, Typography, Popconfirm,
} from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined, PlusOutlined,
  EditOutlined, DeleteOutlined,
} from '@ant-design/icons';
import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService'; // Import the service
import { toast } from 'react-toastify';
 
const { Title } = Typography;

const CustomerProfile = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // Loading state for table and form

  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const data = await ManageCustomersService.getAllCustomers();
        // Map customerId to id for frontend consistency
        const mappedData = data.map(customer => ({
          ...customer,
          id: customer.customerId,
        }));
        setCustomers(mappedData);
      } catch (error) {
        toast.error('Failed to load customers',error);
      }
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  // Styles
  const buttonStyle = {
    borderRadius: 8,
    transition: 'all 0.3s ease',
  };

  const inputStyle = {
    borderRadius: 8,
  };

  // Handle create or update customer
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editingCustomer) {
        // Prepare data for edit, preserving extra fields
        const updatedCustomerData = {
          ...editingCustomer, // Preserve extra fields like createDate, licenseUp, etc.
          ...values, // Update form fields
          customerId: editingCustomer.id, // Use customerId for backend
        };
        const updatedCustomer = await ManageCustomersService.editCustomer(editingCustomer.id, updatedCustomerData);
        // Map customerId to id for frontend consistency
        const mappedUpdatedCustomer = { ...updatedCustomer, id: updatedCustomer.customerId };
        setCustomers(
          customers.map((customer) =>
            customer.id === editingCustomer.id ? mappedUpdatedCustomer : customer
          )
        );
       
      window.location.reload();
      } else {
        // Create new customer via API
        const newCustomer = await ManageCustomersService.AddCustomer(values);
        // Map customerId to id for frontend consistency
        const mappedNewCustomer = { ...newCustomer, id: newCustomer.customerId };
        setCustomers([...customers, mappedNewCustomer]);
      
     window.location.reload();
          
      }
      setIsModalVisible(false);
      setEditingCustomer(null);
      form.resetFields();
      toast.success('Customer saved successfully');
    } catch (error) {
      toast.error('Failed to save customer',error);
    }
    setLoading(false);
  };

  // Handle edit
  const handleEdit = (customer) => {
    if (!customer.id) {
      toast.error('Cannot edit customer: Invalid customer ID');
      return;
    }
    setEditingCustomer(customer);
    form.setFieldsValue({
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });
    setIsModalVisible(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!id) {
      toast.error('Cannot delete customer: Invalid customer ID');
      return;
    }
    try {
      setLoading(true);
      await ManageCustomersService.deleteCustomer(id);
      setCustomers(customers.filter((customer) => customer.id !== id));
      toast.success('Customer deleted successfully');
    } catch (error) {
      toast.error('Failed to delete customer',error);
    }
    setLoading(false);
  };

  // Handle create new customer
  const handleCreate = () => {
    setEditingCustomer(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCustomer(null);
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
            title="Are you sure to delete this customer?"
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
        Customer Management
      </Title>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreate}
        style={{ ...buttonStyle, background: '#007BFF', borderColor: '#007BFF', marginBottom: 16 }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        Add Customer
      </Button>
      <Table
        columns={columns}
        dataSource={customers}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
        loading={loading}
        style={{ background: '#fff', borderRadius: 12, boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)' }}
      />
      <Modal
        title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
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
              { min: 2, message: 'Name must be at least 2 characters' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#007BFF' }} />}
              placeholder="Enter full name"
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
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerProfile;