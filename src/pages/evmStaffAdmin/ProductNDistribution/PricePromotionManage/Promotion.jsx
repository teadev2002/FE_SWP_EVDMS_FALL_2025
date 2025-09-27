import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const Promotion = () => {
  // Sample promotion data
  const [promotionData, setPromotionData] = useState([
    {
      key: '1',
      campaignName: 'Winter EV Sale',
      model: 'EcoVolt X1',
      discountAmount: 5000.00,
      validFrom: '2025-12-01',
      validTo: '2025-12-31',
    },
    {
      key: '2',
      campaignName: 'Summer Clearance',
      model: 'EcoVolt S2',
      discountAmount: 3000.00,
      validFrom: '2025-06-01',
      validTo: '2025-08-31',
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
      setPromotionData((prev) =>
        prev.map((item) =>
          item.key === editingKey ? { ...item, ...formattedValues } : item
        )
      );
      message.success('Promotion updated successfully');
    } else {
      setPromotionData((prev) => [
        ...prev,
        { key: `${prev.length + 1}`, ...formattedValues },
      ]);
      message.success('Promotion added successfully');
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle delete
  const handleDelete = (key) => {
    setPromotionData((prev) => prev.filter((item) => item.key !== key));
    message.success('Promotion deleted successfully');
  };

  // Table columns
  const columns = [
    {
      title: 'Campaign Name',
      dataIndex: 'campaignName',
      key: 'campaignName',
      sorter: (a, b) => a.campaignName.localeCompare(b.campaignName),
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      sorter: (a, b) => a.model.localeCompare(b.model),
    },
    {
      title: 'Discount Amount (USD)',
      dataIndex: 'discountAmount',
      key: 'discountAmount',
      sorter: (a, b) => a.discountAmount - b.discountAmount,
      render: (value) => `$${value.toFixed(2)}`,
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
        dataSource={promotionData}
        rowKey="key"
        pagination={{ pageSize: 10 }}
        style={{ marginTop: 16 }}
        title={() => (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Add Promotion
          </Button>
        )}
      />
      <Modal
        title={editingKey ? 'Edit Promotion' : 'Add Promotion'}
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
            label="Campaign Name"
            name="campaignName"
            rules={[{ required: true, message: 'Please enter the campaign name' }]}
          >
            <Input placeholder="e.g., Winter EV Sale" />
          </Form.Item>
          <Form.Item
            label="Model"
            name="model"
            rules={[{ required: true, message: 'Please enter the vehicle model' }]}
          >
            <Input placeholder="e.g., EcoVolt X1" />
          </Form.Item>
          <Form.Item
            label="Discount Amount (USD)"
            name="discountAmount"
            rules={[{ required: true, message: 'Please enter the discount amount' }]}
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

export default Promotion;