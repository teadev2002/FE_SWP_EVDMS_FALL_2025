import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Typography, Card, message, DatePicker,InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const VehicleAllocationManage = () => {
  // Sample dispatch data
  const [dispatchData, setDispatchData] = useState([
    {
      key: '1',
      model: 'EcoVolt X1',
      vin: '5YJ3E1EA0MF123456',
      dealer: 'City Y Dealership',
      status: 'Scheduled',
      dispatchDate: '2025-10-01',
      quantity: 5,
    },
    {
      key: '2',
      model: 'EcoVolt S2',
      vin: '5YJ3E1EA0MF789012',
      dealer: 'City Z Dealership',
      status: 'In Transit',
      dispatchDate: '2025-09-29',
      quantity: 3,
    },
    {
      key: '3',
      model: 'EcoVolt Z3',
      vin: '5YJ3E1EA0MF345678',
      dealer: 'City X Dealership',
      status: 'Delivered',
      dispatchDate: '2025-09-25',
      quantity: 2,
    },
  ]);

  // State for modal, form, and filters
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [dealerFilter, setDealerFilter] = useState(null);
  const [form] = Form.useForm();

  // Show modal for adding or editing
  const showModal = (record = null) => {
    if (record) {
      form.setFieldsValue({
        ...record,
        dispatchDate: record.dispatchDate ? dayjs(record.dispatchDate) : null,
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
      dispatchDate: values.dispatchDate ? values.dispatchDate.format('YYYY-MM-DD') : null,
    };
    if (editingKey) {
      // Update existing record
      setDispatchData((prev) =>
        prev.map((item) =>
          item.key === editingKey ? { ...item, ...formattedValues } : item
        )
      );
      message.success('Dispatch updated successfully');
    } else {
      // Add new record
      setDispatchData((prev) => [
        ...prev,
        { key: `${prev.length + 1}`, ...formattedValues },
      ]);
      message.success('Dispatch added successfully');
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle delete
  const handleDelete = (key) => {
    setDispatchData((prev) => prev.filter((item) => item.key !== key));
    message.success('Dispatch deleted successfully');
  };

  // Handle filters
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    applyFilters(value, dealerFilter);
  };

  const handleDealerFilter = (value) => {
    setDealerFilter(value);
    applyFilters(statusFilter, value);
  };

  // Apply filters
  const applyFilters = (status, dealer) => {
    let filteredData = dispatchData;
    if (status) {
      filteredData = filteredData.filter((item) => item.status === status);
    }
    if (dealer) {
      filteredData = filteredData.filter((item) => item.dealer === dealer);
    }
    setDispatchData(filteredData);
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
      title: 'Dealer',
      dataIndex: 'dealer',
      key: 'dealer',
      filters: [
        { text: 'City Y Dealership', value: 'City Y Dealership' },
        { text: 'City Z Dealership', value: 'City Z Dealership' },
        { text: 'City X Dealership', value: 'City X Dealership' },
      ],
      onFilter: (value, record) => record.dealer === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Scheduled', value: 'Scheduled' },
        { text: 'In Transit', value: 'In Transit' },
        { text: 'Delivered', value: 'Delivered' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Dispatch Date',
      dataIndex: 'dispatchDate',
      key: 'dispatchDate',
      sorter: (a, b) => dayjs(a.dispatchDate).unix() - dayjs(b.dispatchDate).unix(),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
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
      <Title level={2}>Vehicle Dispatch Management</Title>
      <Card
        title="Dispatch List"
          variant='borderless'
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
        extra={
          <Space>
            <Select
              placeholder="Filter by Dealer"
              allowClear
              style={{ width: 200 }}
              onChange={handleDealerFilter}
            >
              <Option value="City Y Dealership">City Y Dealership</Option>
              <Option value="City Z Dealership">City Z Dealership</Option>
              <Option value="City X Dealership">City X Dealership</Option>
            </Select>
            <Select
              placeholder="Filter by Status"
              allowClear
              style={{ width: 200 }}
              onChange={handleStatusFilter}
            >
              <Option value="Scheduled">Scheduled</Option>
              <Option value="In Transit">In Transit</Option>
              <Option value="Delivered">Delivered</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              Add New Dispatch
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={dispatchData}
          rowKey="key"
          pagination={{ pageSize: 10 }}
          style={{ marginTop: 16 }}
        />
      </Card>

      <Modal
        title={editingKey ? 'Edit Dispatch' : 'Add Dispatch'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: 'Scheduled', quantity: 1 }}
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
            label="Dealer"
            name="dealer"
            rules={[{ required: true, message: 'Please select a dealer' }]}
          >
            <Select>
              <Option value="City Y Dealership">City Y Dealership</Option>
              <Option value="City Z Dealership">City Z Dealership</Option>
              <Option value="City X Dealership">City X Dealership</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select>
              <Option value="Scheduled">Scheduled</Option>
              <Option value="In Transit">In Transit</Option>
              <Option value="Delivered">Delivered</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Dispatch Date"
            name="dispatchDate"
            rules={[{ required: true, message: 'Please select a dispatch date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: 'Please enter the quantity' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
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

export default VehicleAllocationManage;