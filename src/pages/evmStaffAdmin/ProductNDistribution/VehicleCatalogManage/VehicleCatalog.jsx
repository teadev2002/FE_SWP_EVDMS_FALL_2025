import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Typography, Card, InputNumber, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const VehicleCatalog = () => {
  // Sample catalog data
  const [catalogData, setCatalogData] = useState([
    {
      key: '1',
      model: 'EcoVolt X1',
      version: 'Premium',
      color: 'Midnight Blue',
      price: 45000.00,
    },
    {
      key: '2',
      model: 'EcoVolt S2',
      version: 'Standard',
      color: 'Pearl White',
      price: 38000.00,
    },
    {
      key: '3',
      model: 'EcoVolt Z3',
      version: 'Luxury',
      color: 'Crimson Red',
      price: 52000.00,
    },
  ]);

  // State for modal and form
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
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
      setCatalogData((prev) =>
        prev.map((item) =>
          item.key === editingKey ? { ...item, ...values } : item
        )
      );
      message.success('Vehicle model updated successfully');
    } else {
      // Add new record
      setCatalogData((prev) => [
        ...prev,
        { key: `${prev.length + 1}`, ...values },
      ]);
      message.success('Vehicle model added successfully');
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle delete
  const handleDelete = (key) => {
    setCatalogData((prev) => prev.filter((item) => item.key !== key));
    message.success('Vehicle model deleted successfully');
  };

  // Table columns
  const columns = [
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      sorter: (a, b) => a.model.localeCompare(b.model),
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: 'Price (USD)',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (value) => `$${value.toFixed(2)}`,
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
      <Title level={2}>Electric Vehicle Catalog Management</Title>
      <Card
        title="Vehicle Models"
        bordered={false}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Add New Model
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={catalogData}
          rowKey="key"
          pagination={{ pageSize: 10 }}
          style={{ marginTop: 16 }}
        />
      </Card>

      <Modal
        title={editingKey ? 'Edit Vehicle Model' : 'Add Vehicle Model'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ version: 'Standard', color: 'Black' }}
        >
          <Form.Item
            label="Model"
            name="model"
            rules={[{ required: true, message: 'Please enter the vehicle model' }]}
          >
            <Input placeholder="e.g., EcoVolt X1" />
          </Form.Item>
          <Form.Item
            label="Version"
            name="version"
            rules={[{ required: true, message: 'Please select a version' }]}
          >
            <Select>
              <Option value="Standard">Standard</Option>
              <Option value="Premium">Premium</Option>
              <Option value="Luxury">Luxury</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Color"
            name="color"
            rules={[{ required: true, message: 'Please select a color' }]}
          >
            <Select>
              <Option value="Black">Black</Option>
              <Option value="Pearl White">Pearl White</Option>
              <Option value="Midnight Blue">Midnight Blue</Option>
              <Option value="Crimson Red">Crimson Red</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Price (USD)"
            name="price"
            rules={[{ required: true, message: 'Please enter the price' }]}
          >
            <InputNumber
              min={0}
              step={1000}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              style={{ width: '100%' }}
            />
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

export default VehicleCatalog;