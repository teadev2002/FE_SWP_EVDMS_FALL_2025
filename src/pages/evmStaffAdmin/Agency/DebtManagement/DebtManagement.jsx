import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Typography, Card, message, DatePicker, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const DebtManagement = () => {
  // Sample debt data
  const [debtData, setDebtData] = useState([
    {
      key: '1',
      debtId: 'DEBT-001',
      debtor: 'John Doe',
      amount: 15000.00,
      status: 'Pending',
      dueDate: '2025-10-15',
      description: 'Installment plan for EcoVolt X1',
    },
    {
      key: '2',
      debtId: 'DEBT-002',
      debtor: 'City Y Dealership',
      amount: 30000.00,
      status: 'Overdue',
      dueDate: '2025-09-20',
      description: 'Bulk purchase credit for EcoVolt S2',
    },
    {
      key: '3',
      debtId: 'DEBT-003',
      debtor: 'Jane Smith',
      amount: 8000.00,
      status: 'Paid',
      dueDate: '2025-08-30',
      description: 'Final payment for EcoVolt Z3',
    },
  ]);

  // State for modal, form, and filters
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [debtorFilter, setDebtorFilter] = useState(null);
  const [form] = Form.useForm();

  // Show modal for adding or editing
  const showModal = (record = null) => {
    if (record) {
      form.setFieldsValue({
        ...record,
        dueDate: record.dueDate ? dayjs(record.dueDate) : null,
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
      dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : null,
    };
    if (editingKey) {
      // Update existing record
      setDebtData((prev) =>
        prev.map((item) =>
          item.key === editingKey ? { ...item, ...formattedValues } : item
        )
      );
      message.success('Debt record updated successfully');
    } else {
      // Add new record
      setDebtData((prev) => [
        ...prev,
        { key: `${prev.length + 1}`, ...formattedValues },
      ]);
      message.success('Debt record added successfully');
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle delete
  const handleDelete = (key) => {
    setDebtData((prev) => prev.filter((item) => item.key !== key));
    message.success('Debt record deleted successfully');
  };

  // Handle filters
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    applyFilters(value, debtorFilter);
  };

  const handleDebtorFilter = (value) => {
    setDebtorFilter(value);
    applyFilters(statusFilter, value);
  };

  // Apply filters
  const applyFilters = (status, debtor) => {
    let filteredData = [...debtData]; // Create a copy of the original data
    if (status) {
      filteredData = filteredData.filter((item) => item.status === status);
    }
    if (debtor) {
      filteredData = filteredData.filter((item) => item.debtor === debtor);
    }
    setDebtData(filteredData);
  };

  // Table columns
  const columns = [
    {
      title: 'Debt ID',
      dataIndex: 'debtId',
      key: 'debtId',
      sorter: (a, b) => a.debtId.localeCompare(b.debtId),
    },
    {
      title: 'Debtor',
      dataIndex: 'debtor',
      key: 'debtor',
      sorter: (a, b) => a.debtor.localeCompare(b.debtor),
      filters: [
        { text: 'John Doe', value: 'John Doe' },
        { text: 'City Y Dealership', value: 'City Y Dealership' },
        { text: 'Jane Smith', value: 'Jane Smith' },
      ],
      onFilter: (value, record) => record.debtor === value,
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
        { text: 'Pending', value: 'Pending' },
        { text: 'Overdue', value: 'Overdue' },
        { text: 'Paid', value: 'Paid' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) => dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix(),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
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
      <Title level={2}>Debt Management</Title>
      <Card
        title="Debt Records"
        variant="borderless"
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
        extra={
          <Space>
            <Select
              placeholder="Filter by Debtor"
              allowClear
              style={{ width: 200 }}
              onChange={handleDebtorFilter}
            >
              <Option value="John Doe">John Doe</Option>
              <Option value="City Y Dealership">City Y Dealership</Option>
              <Option value="Jane Smith">Jane Smith</Option>
            </Select>
            <Select
              placeholder="Filter by Status"
              allowClear
              style={{ width: 200 }}
              onChange={handleStatusFilter}
            >
              <Option value="Pending">Pending</Option>
              <Option value="Overdue">Overdue</Option>
              <Option value="Paid">Paid</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              Add New Debt
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={debtData}
          rowKey="key"
          pagination={{ pageSize: 10 }}
          style={{ marginTop: 16 }}
        />
      </Card>

      <Modal
        title={editingKey ? 'Edit Debt Record' : 'Add Debt Record'}
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
            label="Debt ID"
            name="debtId"
            rules={[{ required: true, message: 'Please enter the debt ID' }]}
          >
            <Input placeholder="e.g., DEBT-001" />
          </Form.Item>
          <Form.Item
            label="Debtor"
            name="debtor"
            rules={[{ required: true, message: 'Please enter the debtor name' }]}
          >
            <Input placeholder="e.g., John Doe" />
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
              <Option value="Pending">Pending</Option>
              <Option value="Overdue">Overdue</Option>
              <Option value="Paid">Paid</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Due Date"
            name="dueDate"
            rules={[{ required: true, message: 'Please select the due date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter the description' }]}
          >
            <Input.TextArea rows={4} placeholder="e.g., Installment plan for EcoVolt X1" />
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

export default DebtManagement;