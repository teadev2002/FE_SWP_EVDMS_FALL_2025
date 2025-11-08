import React, { useState, useEffect } from 'react';
import {
  Table, Button, Modal, Form, Input, Space, Typography, Popconfirm, Row, Col, Input as AntInput, Descriptions,
} from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined, PlusOutlined,
  EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';

const { Title } = Typography;
const { TextArea } = Input;

const CustomerProfile = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [storeId, setStoreId] = useState(null);

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

  // Lấy storeId từ localStorage
  useEffect(() => {
    const dealerInfo = localStorage.getItem('dealerInfo');
    if (dealerInfo) {
      try {
        const parsed = JSON.parse(dealerInfo);
        if (parsed.storeId) {
          setStoreId(parsed.storeId);
        } else {
          toast.error('Store ID not found in dealer info');
        }
      } catch (error) {
        console.error('Failed to parse dealerInfo:', error);
        toast.error('Invalid dealer info');
      }
    } else {
      toast.error('Please login again. Dealer info not found.');
    }
  }, []);

  // Hàm fetch danh sách khách hàng (dùng lại)
  const fetchCustomers = async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const data = await ManageCustomersService.getCustomerByStoreId(storeId);
      const mappedData = data.map(customer => ({
        ...customer,
        id: customer.customerId,
      }));
      setCustomers(mappedData);
      setFilteredCustomers(mappedData);
    } catch (error) {
      toast.error('Failed to load customers for this store');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch danh sách ban đầu
  useEffect(() => {
    fetchCustomers();
  }, [storeId]);

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    const lowerValue = value.toLowerCase();
    const filtered = customers.filter((customer) =>
      customer.fullName?.toLowerCase().includes(lowerValue) ||
      customer.email?.toLowerCase().includes(lowerValue) ||
      customer.phone?.toLowerCase().includes(lowerValue) ||
      customer.address?.toLowerCase().includes(lowerValue)
    );
    setFilteredCustomers(filtered);
  };

  // Handle create new
  const handleCreate = () => {
    setEditingCustomer(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Handle edit
  const handleEdit = (customer) => {
    if (!customer.id) {
      toast.error('Invalid customer ID');
      return;
    }
    setEditingCustomer(customer);
    form.setFieldsValue({
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      licenseUp: customer.licenseUp,
      licenseDown: customer.licenseDown,
    });
    setIsModalVisible(true);
  };

  // Handle view detail
  const handleView = async (id) => {
    setLoading(true);
    try {
      const customer = await ManageCustomersService.GetCustomerById(id);
      setViewingCustomer(customer);
      setIsDetailModalVisible(true);
    } catch (error) {
      toast.error('Failed to load customer details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle save (add or update)
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingCustomer) {
        // UPDATE
        const updateData = {
          ...editingCustomer,
          ...values,
          customerId: editingCustomer.id,
        };
        const updated = await ManageCustomersService.editCustomer(editingCustomer.id, updateData);
        const mapped = { ...updated, id: updated.customerId };
        const updatedList = customers.map(c => c.id === editingCustomer.id ? mapped : c);
        setCustomers(updatedList);
        setFilteredCustomers(
          updatedList.filter(c =>
            c.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchText.toLowerCase()) ||
            c.phone?.toLowerCase().includes(searchText.toLowerCase()) ||
            c.address?.toLowerCase().includes(searchText.toLowerCase())
          )
        );
        toast.success('Customer updated successfully');
      } else {
        // ADD NEW
        const payload = {
          fullName: values.fullName,
          phone: values.phone,
          email: values.email,
          address: values.address,
          licenseUp: values.licenseUp || null,
          licenseDown: values.licenseDown || null,
          storeId: storeId,
        };
        const newCustomer = await ManageCustomersService.AddCustomer(payload);
        const mapped = { ...newCustomer, id: newCustomer.customerId };
        const newList = [...customers, mapped];
        setCustomers(newList);
        setFilteredCustomers(
          newList.filter(c =>
            c.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchText.toLowerCase()) ||
            c.phone?.toLowerCase().includes(searchText.toLowerCase()) ||
            c.address?.toLowerCase().includes(searchText.toLowerCase())
          )
        );
        toast.success('Customer added successfully');
      }

      setIsModalVisible(false);
      setEditingCustomer(null);
      form.resetFields();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save customer';
      toast.error(msg);
      console.error(error);
    } finally {
      setLoading(false);
      fetchCustomers();
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!id) {
      toast.error('Invalid customer ID');
      return;
    }
    setLoading(true);
    try {
      await ManageCustomersService.deleteCustomer(id);
      const updatedList = customers.filter(c => c.id !== id);
      setCustomers(updatedList);
      setFilteredCustomers(
        updatedList.filter(c =>
          c.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchText.toLowerCase()) ||
          c.phone?.toLowerCase().includes(searchText.toLowerCase()) ||
          c.address?.toLowerCase().includes(searchText.toLowerCase())
        )
      );
      toast.success('Customer deleted successfully');
    } catch (error) {
      toast.error('Failed to delete customer');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCustomer(null);
    form.resetFields();
  };

  const handleDetailCancel = () => {
    setIsDetailModalVisible(false);
    setViewingCustomer(null);
  };

  // Table columns
  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => (a.fullName || '').localeCompare(b.fullName || ''),
      onCell: (record) => ({
        onClick: () => handleView(record.id),
        style: { cursor: 'pointer' },
      }),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => (a.email || '').localeCompare(b.email || ''),
      onCell: (record) => ({
        onClick: () => handleView(record.id),
        style: { cursor: 'pointer' },
      }),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      sorter: (a, b) => (a.phone || '').localeCompare(b.phone || ''),
      onCell: (record) => ({
        onClick: () => handleView(record.id),
        style: { cursor: 'pointer' },
      }),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      sorter: (a, b) => (a.address || '').localeCompare(b.address || ''),
      onCell: (record) => ({
        onClick: () => handleView(record.id),
        style: { cursor: 'pointer' },
      }),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }}
            style={{
              ...buttonStyle,
              background: 'linear-gradient(135deg, #ec6e07ff 0%, #ceb24fff 100%)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              color: 'white',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this customer?"
            onConfirm={(e) => {
              e.stopPropagation();
              handleDelete(record.id);
            }}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ style: { ...buttonStyle, background: '#007BFF', borderColor: '#007BFF' } }}
            cancelButtonProps={{ style: buttonStyle }}
          >
            <Button
              onClick={(e) => e.stopPropagation()}
              style={{
                ...buttonStyle,
                background: 'linear-gradient(135deg, #b13d3dff 0%, #fb6161ff 100%)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                color: 'white',
              }}
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

  if (!storeId) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Title level={3}>Loading store information...</Title>
      </div>
    );
  }

  return (
    <div>
      <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
        Customer Management
      </Title>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={20}>
          <AntInput.Search
            placeholder="Search by Full Name, Email, Phone, or Address"
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
            Add Customer
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredCustomers}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} Customer${total !== 1 ? 's' : ''}`,
        }}
        bordered
        loading={loading}
        style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
        onRow={(record) => ({
          onClick: () => handleView(record.id),
        })}
      />

      {/* Modal: Add / Edit */}
      <Modal
        title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
        okButtonProps={{
          style: { ...buttonStyle, background: '#007BFF', borderColor: '#007BFF' },
          loading,
        }}
        cancelButtonProps={{ style: buttonStyle }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="fullName" label="Full Name" rules={[{ required: true }, { min: 2 }]}>
            <Input prefix={<UserOutlined style={{ color: '#007BFF' }} />} style={inputStyle} />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined style={{ color: '#007BFF' }} />} style={inputStyle} />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true, pattern: /^\+?[\d\s-]{10,}$/ }]}>
            <Input prefix={<PhoneOutlined style={{ color: '#007BFF' }} />} style={inputStyle} />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true, min: 5 }]}>
            <TextArea rows={3} style={inputStyle} />
          </Form.Item>
          <Form.Item name="licenseUp" label="License Plate (Upper)">
            <Input placeholder="e.g., 51H-12345 (optional)" style={inputStyle} allowClear />
          </Form.Item>
          <Form.Item name="licenseDown" label="License Plate (Lower)">
            <Input placeholder="e.g., 51H-67890 (optional)" style={inputStyle} allowClear />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal: View Detail */}
      <Modal
        title="Customer Details"
        open={isDetailModalVisible}
        onCancel={handleDetailCancel}
        footer={null}
        width={600}
      >
        {viewingCustomer && (
          <Descriptions bordered column={1} style={{ marginTop: 16 }}>
            <Descriptions.Item label="Customer ID">{viewingCustomer.customerId}</Descriptions.Item>
            <Descriptions.Item label="Full Name">{viewingCustomer.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{viewingCustomer.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{viewingCustomer.phone}</Descriptions.Item>
            <Descriptions.Item label="Address">{viewingCustomer.address}</Descriptions.Item>
            <Descriptions.Item label="Create Date">{viewingCustomer.createDate}</Descriptions.Item>
            <Descriptions.Item label="License Plate (Upper)">
              {viewingCustomer.licenseUp || <i style={{ color: '#aaa' }}>Not provided</i>}
            </Descriptions.Item>
            <Descriptions.Item label="License Plate (Lower)">
              {viewingCustomer.licenseDown || <i style={{ color: '#aaa' }}>Not provided</i>}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default CustomerProfile;