import React, { useState } from 'react';
import { Card, Form, Input, Button, Descriptions, Divider, Space, Typography, Table, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const CustomerProfile = () => {
  // Sample customer data
  const [customerData, setCustomerData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-123-4567',
    address: '123 Greenway Dr, City Z, USA',
    purchaseHistory: [
      { orderId: 'EV-ORD789012', vehicleModel: 'EcoVolt X1 Electric SUV', purchaseDate: '2025-09-15', amount: 45000.00 },
      { orderId: 'EV-ORD789013', vehicleModel: 'EcoVolt S2 Electric Sedan', purchaseDate: '2025-06-10', amount: 38000.00 },
    ],
  });

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  // Handle edit toggle
  const handleEditToggle = () => {
    if (!isEditing) {
      form.setFieldsValue(customerData);
    }
    setIsEditing(!isEditing);
  };

  // Handle form submission
  const handleSave = (values) => {
    setCustomerData({ ...customerData, ...values });
    setIsEditing(false);
    message.success('Profile updated successfully');
  };

  // Table columns for purchase history
  const columns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
    { title: 'Vehicle Model', dataIndex: 'vehicleModel', key: 'vehicleModel' },
    { title: 'Purchase Date', dataIndex: 'purchaseDate', key: 'purchaseDate' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `USD ${amount.toFixed(2)}`,
    },
  ];

  return (
    <div>
      <Title level={2}>Manage Customer Profile</Title>
      <Card
        title="Personal Information"
        bordered={false}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
        extra={
          <Button
            type={isEditing ? 'default' : 'primary'}
            icon={isEditing ? <CloseOutlined /> : <EditOutlined />}
            onClick={handleEditToggle}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        }
      >
        {isEditing ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={customerData}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input prefix={<MailOutlined />} />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: 'Please enter your address' }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Name">{customerData.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{customerData.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{customerData.phone}</Descriptions.Item>
            <Descriptions.Item label="Address">{customerData.address}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      <Divider />

      <Card
        title="Purchase History"
        bordered={false}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', marginTop: 16 }}
      >
        <Table
          columns={columns}
          dataSource={customerData.purchaseHistory}
          rowKey="orderId"
          pagination={false}
          style={{ marginTop: 16 }}
        />
      </Card>
    </div>
  );
};

export default CustomerProfile;