import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Typography, Card, InputNumber, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FilterOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const InventoryManage = () => {
  // Sample inventory data
  const [inventoryData, setInventoryData] = useState([
    {
      key: '1',
      model: 'EcoVolt X1',
      vin: '5YJ3E1EA0MF123456',
      status: 'In Stock',
      quantity: 10,
      location: 'Warehouse A, City Y',
    },
    {
      key: '2',
      model: 'EcoVolt S2',
      vin: '5YJ3E1EA0MF789012',
      status: 'In Transit',
      quantity: 5,
      location: 'Distribution Center, City Z',
    },
    {
      key: '3',
      model: 'EcoVolt Z3',
      vin: '5YJ3E1EA0MF345678',
      status: 'Sold',
      quantity: 0,
      location: 'Dealership, City X',
    },
  ]);

  // State for modal, form, and filter
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
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
      setInventoryData((prev) =>
        prev.map((item) =>
          item.key === editingKey ? { ...item, ...values } : item
        )
      );
      message.success('Inventory item updated successfully');
    } else {
      // Add new record
      setInventoryData((prev) => [
        ...prev,
        { key: `${prev.length + 1}`, ...values },
      ]);
      message.success('Inventory item added successfully');
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle delete
  const handleDelete = (key) => {
    setInventoryData((prev) => prev.filter((item) => item.key !== key));
    message.success('Inventory item deleted successfully');
  };

  // Handle status filter
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    if (value) {
      setInventoryData((prev) =>
        prev.filter((item) => item.status === value)
      );
    } else {
      setInventoryData(inventoryData); // Reset to original data
    }
    console.log('Filtered by status:', statusFilter);
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
      title: 'VIN',
      dataIndex: 'vin',
      key: 'vin',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'In Stock', value: 'In Stock' },
        { text: 'In Transit', value: 'In Transit' },
        { text: 'Sold', value: 'Sold' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
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
      <Title level={2}>Electric Vehicle Inventory Management</Title>
      <Card
        title="Inventory List"
        variant="borderless"
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
        extra={
          <Space>
            <Select
              placeholder="Filter by Status"
              allowClear
              style={{ width: 200 }}
              onChange={handleStatusFilter}
            >
              <Option value="In Stock">In Stock</Option>
              <Option value="In Transit">In Transit</Option>
              <Option value="Sold">Sold</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              Add New Vehicle
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={inventoryData}
          rowKey="key"
          pagination={{ pageSize: 10 }}
          style={{ marginTop: 16 }}
        />
      </Card>

      <Modal
        title={editingKey ? 'Edit Inventory Item' : 'Add Inventory Item'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: 'In Stock', quantity: 1 }}
        >
          <Form.Item
            label="Model"
            name="model"
            rules={[{ required: true, message: 'Please enter the vehicle model' }]}
          >
            <Input placeholder="e.g., EcoVolt X1" />
          </Form.Item>
          <Form.Item
            label="VIN"
            name="vin"
            rules={[{ required: true, message: 'Please enter the VIN' }]}
          >
            <Input placeholder="e.g., 5YJ3E1EA0MF123456" />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select>
              <Option value="In Stock">In Stock</Option>
              <Option value="In Transit">In Transit</Option>
              <Option value="Sold">Sold</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: 'Please enter the quantity' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: 'Please enter the location' }]}
          >
            <Input placeholder="e.g., Warehouse A, City Y" />
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

export default InventoryManage;