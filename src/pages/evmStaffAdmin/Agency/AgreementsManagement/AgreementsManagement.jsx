import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Typography, Card, message, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const AgreementsManagement = () => {
  // Sample agreement data
  const [agreementsData, setAgreementsData] = useState([
    {
      key: '1',
      agreementId: 'AGR-001',
      type: 'Dealer Contract',
      party: 'City Y Dealership',
      status: 'Active',
      agreementDate: '2025-09-01',
      details: 'Exclusive EV distribution for City Y',
    },
    {
      key: '2',
      agreementId: 'AGR-002',
      type: 'Customer Purchase',
      party: 'John Doe',
      status: 'Pending',
      agreementDate: '2025-09-15',
      details: 'Purchase of EcoVolt X1',
    },
    {
      key: '3',
      agreementId: 'AGR-003',
      type: 'Service Contract',
      party: 'City Z Service Center',
      status: 'Expired',
      agreementDate: '2025-06-01',
      details: 'Maintenance for EcoVolt S2 fleet',
    },
  ]);

  // State for modal, form, and filters
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [form] = Form.useForm();

  // Show modal for adding or editing
  const showModal = (record = null) => {
    if (record) {
      form.setFieldsValue({
        ...record,
        agreementDate: record.agreementDate ? dayjs(record.agreementDate) : null,
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
      agreementDate: values.agreementDate ? values.agreementDate.format('YYYY-MM-DD') : null,
    };
    if (editingKey) {
      // Update existing record
      setAgreementsData((prev) =>
        prev.map((item) =>
          item.key === editingKey ? { ...item, ...formattedValues } : item
        )
      );
      message.success('Agreement updated successfully');
    } else {
      // Add new record
      setAgreementsData((prev) => [
        ...prev,
        { key: `${prev.length + 1}`, ...formattedValues },
      ]);
      message.success('Agreement added successfully');
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle delete
  const handleDelete = (key) => {
    setAgreementsData((prev) => prev.filter((item) => item.key !== key));
    message.success('Agreement deleted successfully');
  };

  // Handle filters
  const handleTypeFilter = (value) => {
    setTypeFilter(value);
    applyFilters(value, statusFilter);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    applyFilters(typeFilter, value);
  };

  // Apply filters
  const applyFilters = (type, status) => {
    let filteredData = [...agreementsData]; // Create a copy of the original data
    if (type) {
      filteredData = filteredData.filter((item) => item.type === type);
    }
    if (status) {
      filteredData = filteredData.filter((item) => item.status === status);
    }
    setAgreementsData(filteredData);
  };

  // Table columns
  const columns = [
    {
      title: 'Agreement ID',
      dataIndex: 'agreementId',
      key: 'agreementId',
      sorter: (a, b) => a.agreementId.localeCompare(b.agreementId),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Dealer Contract', value: 'Dealer Contract' },
        { text: 'Customer Purchase', value: 'Customer Purchase' },
        { text: 'Service Contract', value: 'Service Contract' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Party',
      dataIndex: 'party',
      key: 'party',
      sorter: (a, b) => a.party.localeCompare(b.party),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Pending', value: 'Pending' },
        { text: 'Expired', value: 'Expired' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Agreement Date',
      dataIndex: 'agreementDate',
      key: 'agreementDate',
      sorter: (a, b) => dayjs(a.agreementDate).unix() - dayjs(b.agreementDate).unix(),
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
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
      <Title level={2}>Agreements Management</Title>
      <Card
        title="Agreements List"
      variant="borderless"
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
        extra={
          <Space>
            <Select
              placeholder="Filter by Type"
              allowClear
              style={{ width: 200 }}
              onChange={handleTypeFilter}
            >
              <Option value="Dealer Contract">Dealer Contract</Option>
              <Option value="Customer Purchase">Customer Purchase</Option>
              <Option value="Service Contract">Service Contract</Option>
            </Select>
            <Select
              placeholder="Filter by Status"
              allowClear
              style={{ width: 200 }}
              onChange={handleStatusFilter}
            >
              <Option value="Active">Active</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Expired">Expired</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              Add New Agreement
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={agreementsData}
          rowKey="key"
          pagination={{ pageSize: 10 }}
          style={{ marginTop: 16 }}
        />
      </Card>

      <Modal
        title={editingKey ? 'Edit Agreement' : 'Add Agreement'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: 'Active', type: 'Dealer Contract' }}
        >
          <Form.Item
            label="Agreement ID"
            name="agreementId"
            rules={[{ required: true, message: 'Please enter the agreement ID' }]}
          >
            <Input placeholder="e.g., AGR-001" />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: 'Please select the agreement type' }]}
          >
            <Select>
              <Option value="Dealer Contract">Dealer Contract</Option>
              <Option value="Customer Purchase">Customer Purchase</Option>
              <Option value="Service Contract">Service Contract</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Party"
            name="party"
            rules={[{ required: true, message: 'Please enter the party name' }]}
          >
            <Input placeholder="e.g., City Y Dealership" />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Expired">Expired</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Agreement Date"
            name="agreementDate"
            rules={[{ required: true, message: 'Please select the agreement date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Details"
            name="details"
            rules={[{ required: true, message: 'Please enter agreement details' }]}
          >
            <Input.TextArea rows={4} placeholder="e.g., Exclusive EV distribution" />
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

export default AgreementsManagement;