import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Typography, Card, message, DatePicker, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const SalesManagement = () => {
  // Sample sales data
  const [salesData, setSalesData] = useState([
    {
      key: '1',
      orderId: 'EV-ORD789012',
      customer: 'John Doe',
      vehicleModel: 'EcoVolt X1',
      amount: 45000.00,
      status: 'Completed',
      saleDate: '2025-09-15',
    },
    {
      key: '2',
      orderId: 'EV-ORD789013',
      customer: 'Jane Smith',
      vehicleModel: 'EcoVolt S2',
      amount: 38000.00,
      status: 'Pending',
      saleDate: '2025-09-20',
    },
    {
      key: '3',
      orderId: 'EV-ORD789014',
      customer: 'City Y Dealership',
      vehicleModel: 'EcoVolt Z3',
      amount: 52000.00,
      status: 'Cancelled',
      saleDate: '2025-09-10',
    },
  ]);

  // State for modal, form, and filters
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [customerFilter, setCustomerFilter] = useState(null);
  const [form] = Form.useForm();

  // Show modal for adding or editing
  const showModal = (record = null) => {
    if (record) {
      form.setFieldsValue({
        ...record,
        saleDate: record.saleDate ? dayjs(record.saleDate) : null,
      });
      setEditingKey(record.key);
    } else {
      form.resetFields();
      setEditingKey(null);
    }
    setIsModalVisible(true);
  };

  // Handle form submission
  const handleSubmit = (values) => {
    const formattedValues = {
      ...values,
      saleDate: values.saleDate ? values.saleDate.format('YYYY-MM-DD') : null,
    };
    if (editingKey) {
      // Update existing record
      setSalesData((prev) =>
        prev.map((item) =>
          item.key === editingKey ? { ...item, ...formattedValues } : item
        )
      );
      message.success('Sale record updated successfully');
    } else {
      // Add new record
      setSalesData((prev) => [
        ...prev,
        { key: `${prev.length + 1}`, ...formattedValues },
      ]);
      message.success('Sale record added successfully');
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle delete
  const handleDelete = (key) => {
    setSalesData((prev) => prev.filter((item) => item.key !== key));
    message.success('Sale record deleted successfully');
  };

  // Handle filters
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    applyFilters(value, customerFilter);
  };

  const handleCustomerFilter = (value) => {
    setCustomerFilter(value);
    applyFilters(statusFilter, value);
  };

  // Apply filters
  const applyFilters = (status, customer) => {
    let filteredData = [...salesData]; // Create a copy of the original data
    if (status) {
      filteredData = filteredData.filter((item) => item.status === status);
    }
    if (customer) {
      filteredData = filteredData.filter((item) => item.customer === customer);
    }
    setSalesData(filteredData);
  };

  // Table columns
  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      sorter: (a, b) => a.orderId.localeCompare(b.orderId),
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      sorter: (a, b) => a.customer.localeCompare(b.customer),
      filters: [
        { text: 'John Doe', value: 'John Doe' },
        { text: 'Jane Smith', value: 'Jane Smith' },
        { text: 'City Y Dealership', value: 'City Y Dealership' },
      ],
      onFilter: (value, record) => record.customer === value,
    },
    {
      title: 'Vehicle Model',
      dataIndex: 'vehicleModel',
      key: 'vehicleModel',
      sorter: (a, b) => a.vehicleModel.localeCompare(b.vehicleModel),
    },
    {
      title: 'Amount (USD)',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Completed', value: 'Completed' },
        { text: 'Pending', value: 'Pending' },
        { text: 'Cancelled', value: 'Cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Sale Date',
      dataIndex: 'saleDate',
      key: 'saleDate',
      sorter: (a, b) => dayjs(a.saleDate).unix() - dayjs(b.saleDate).unix(),
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
      <Title level={2}>Sales Management</Title>
      <Card
        title="Sales Records"
     variant="borderless"
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
        extra={
          <Space>
            <Select
              placeholder="Filter by Customer"
              allowClear
              style={{ width: 200 }}
              onChange={handleCustomerFilter}
            >
              <Option value="John Doe">John Doe</Option>
              <Option value="Jane Smith">Jane Smith</Option>
              <Option value="City Y Dealership">City Y Dealership</Option>
            </Select>
            <Select
              placeholder="Filter by Status"
              allowClear
              style={{ width: 200 }}
              onChange={handleStatusFilter}
            >
              <Option value="Completed">Completed</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              Add New Sale
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={salesData}
          rowKey="key"
          pagination={{ pageSize: 10 }}
          style={{ marginTop: 16 }}
        />
      </Card>

      <Modal
        title={editingKey ? 'Edit Sale Record' : 'Add Sale Record'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: 'Pending' }}
        >
          <Form.Item
            label="Order ID"
            name="orderId"
            rules={[{ required: true, message: 'Please enter the order ID' }]}
          >
            <Input placeholder="e.g., EV-ORD789012" />
          </Form.Item>
          <Form.Item
            label="Customer"
            name="customer"
            rules={[{ required: true, message: 'Please enter the customer name' }]}
          >
            <Input placeholder="e.g., John Doe" />
          </Form.Item>
          <Form.Item
            label="Vehicle Model"
            name="vehicleModel"
            rules={[{ required: true, message: 'Please enter the vehicle model' }]}
          >
            <Input placeholder="e.g., EcoVolt X1" />
          </Form.Item>
          <Form.Item
            label="Amount (USD)"
            name="amount"
            rules={[{ required: true, message: 'Please enter the amount' }]}
          >
            <InputNumber
              min={0}
              step={100}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select>
              <Option value="Completed">Completed</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Sale Date"
            name="saleDate"
            rules={[{ required: true, message: 'Please select the sale date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
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

export default SalesManagement;