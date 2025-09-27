import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const Discount = () => {
  // Sample discount data
  const [discountData, setDiscountData] = useState([
    {
      key: '1',
      model: 'EcoVolt X1',
      discountPercent: 10,
      validFrom: '2025-10-01',
      validTo: '2025-12-31',
    },
    {
      key: '2',
      model: 'EcoVolt S2',
      discountPercent: 15,
      validFrom: '2025-09-01',
      validTo: '2025-11-30',
    },
  ]);

  // State for modal and form
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [form] = Form.useForm();

  // Show modal for adding or editing
  const showModal = (record = null) => {
    if (record) {
      form.setFieldsValue({
        ...record,
        dateRange: [dayjs(record.validFrom), dayjs(record.validTo)],
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
    const { dateRange, ...rest } = values;
    const formattedValues = {
      ...rest,
      validFrom: dateRange ? dateRange[0].format('YYYY-MM-DD') : null,
      validTo: dateRange ? dateRange[1].format('YYYY-MM-DD') : null,
    };
    if (editingKey) {
      setDiscountData((prev) =>
        prev.map((item) =>
          item.key === editingKey ? { ...item, ...formattedValues } : item
        )
      );
      message.success('Discount updated successfully');
    } else {
      setDiscountData((prev) => [
        ...prev,
        { key: `${prev.length + 1}`, ...formattedValues },
      ]);
      message.success('Discount added successfully');
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle delete
  const handleDelete = (key) => {
    setDiscountData((prev) => prev.filter((item) => item.key !== key));
    message.success('Discount deleted successfully');
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
      title: 'Discount (%)',
      dataIndex: 'discountPercent',
      key: 'discountPercent',
      sorter: (a, b) => a.discountPercent - b.discountPercent,
    },
    {
      title: 'Valid From',
      dataIndex: 'validFrom',
      key: 'validFrom',
      sorter: (a, b) => dayjs(a.validFrom).unix() - dayjs(b.validFrom).unix(),
    },
    {
      title: 'Valid To',
      dataIndex: 'validTo',
      key: 'validTo',
      sorter: (a, b) => dayjs(a.validTo).unix() - dayjs(b.validTo).unix(),
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
      <Table
        columns={columns}
        dataSource={discountData}
        rowKey="key"
        pagination={{ pageSize: 10 }}
        style={{ marginTop: 16 }}
        title={() => (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Add Discount
          </Button>
        )}
      />
      <Modal
        title={editingKey ? 'Edit Discount' : 'Add Discount'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Model"
            name="model"
            rules={[{ required: true, message: 'Please enter the vehicle model' }]}
          >
            <Input placeholder="e.g., EcoVolt X1" />
          </Form.Item>
          <Form.Item
            label="Discount (%)"
            name="discountPercent"
            rules={[{ required: true, message: 'Please enter the discount percentage' }]}
          >
            <InputNumber min={0} max={100} step={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Valid Period"
            name="dateRange"
            rules={[{ required: true, message: 'Please select the valid period' }]}
          >
            <RangePicker style={{ width: '100%' }} />
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

export default Discount;