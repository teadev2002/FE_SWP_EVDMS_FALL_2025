import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const WholesalePrice = () => {
  // Sample wholesale price data
  const [priceData, setPriceData] = useState([
    {
      key: '1',
      model: 'EcoVolt X1',
      version: 'Premium',
      wholesalePrice: 40000.00,
    },
    {
      key: '2',
      model: 'EcoVolt S2',
      version: 'Standard',
      wholesalePrice: 32000.00,
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
      setPriceData((prev) =>
        prev.map((item) =>
          item.key === editingKey ? { ...item, ...values } : item
        )
      );
      message.success('Wholesale price updated successfully');
    } else {
      setPriceData((prev) => [
        ...prev,
        { key: `${prev.length + 1}`, ...values },
      ]);
      message.success('Wholesale price added successfully');
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle delete
  const handleDelete = (key) => {
    setPriceData((prev) => prev.filter((item) => item.key !== key));
    message.success('Wholesale price deleted successfully');
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
      title: 'Wholesale Price (USD)',
      dataIndex: 'wholesalePrice',
      key: 'wholesalePrice',
      sorter: (a, b) => a.wholesalePrice - b.wholesalePrice,
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
      <Table
        columns={columns}
        dataSource={priceData}
        rowKey="key"
        pagination={{ pageSize: 10 }}
        style={{ marginTop: 16 }}
        title={() => (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Add Wholesale Price
          </Button>
        )}
      />
      <Modal
        title={editingKey ? 'Edit Wholesale Price' : 'Add Wholesale Price'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ version: 'Standard' }}
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
            rules={[{ required: true, message: 'Please enter the version' }]}
          >
            <Input placeholder="e.g., Premium" />
          </Form.Item>
          <Form.Item
            label="Wholesale Price (USD)"
            name="wholesalePrice"
            rules={[{ required: true, message: 'Please enter the wholesale price' }]}
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

export default WholesalePrice;