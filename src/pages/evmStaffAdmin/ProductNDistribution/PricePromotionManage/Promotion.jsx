import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import ManageServicePromotions from '../../../../services/ManagePromotions/ManageServicePromotions';
const { RangePicker } = DatePicker;

const Promotion = () => {
  const [promotionData, setPromotionData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Fetch promotions using useEffect
  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const data = await ManageServicePromotions.getAllPromotions();
        const formattedData = data.map((item) => ({
          key: item.promotionId.toString(),
          title: item.title,
          description: item.description,
          discountPercent: item.discountPercent,
          startDate: dayjs(item.startDate).format('DD/MM/YYYY'),
          endDate: dayjs(item.endDate).format('DD/MM/YYYY'),
        }));
        setPromotionData(formattedData);
      } catch (error) {
        message.error('Failed to fetch promotions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  // Show modal for adding or editing
  const showModal = (record = null) => {
    if (record) {
      form.setFieldsValue({
        title: record.title,
        description: record.description,
        discountPercent: record.discountPercent,
        dateRange: [dayjs(record.startDate, 'DD/MM/YYYY'), dayjs(record.endDate, 'DD/MM/YYYY')],
      });
      setEditingKey(record.key);
    } else {
      form.resetFields();
      setEditingKey(null);
    }
    setIsModalVisible(true);
  };

  // Handle form submission for add or edit
  const handleSubmit = async (values) => {
    const { dateRange, ...rest } = values;
    const apiFormattedValues = {
      ...rest,
      startDate: dateRange ? dateRange[0].format('YYYY-MM-DD') : null,
      endDate: dateRange ? dateRange[1].format('YYYY-MM-DD') : null,
    };
    const uiFormattedValues = {
      ...rest,
      startDate: dateRange ? dateRange[0].format('DD/MM/YYYY') : null,
      endDate: dateRange ? dateRange[1].format('DD/MM/YYYY') : null,
    };
    console.log(uiFormattedValues);

    setLoading(true);
    try {
      if (editingKey) {
        // Edit promotion via API
        const response = await ManageServicePromotions.editPromotion(editingKey, apiFormattedValues);
        setPromotionData((prev) =>
          prev.map((item) =>
            item.key === editingKey
              ? {
                  key: editingKey,
                  title: response.title,
                  description: response.description,
                  discountPercent: response.discountPercent,
                  startDate: dayjs(response.startDate).format('DD/MM/YYYY'),
                  endDate: dayjs(response.endDate).format('DD/MM/YYYY'),
                }
              : item
          )
        );
        message.success('Promotion updated successfully');
      } else {
        // Add new promotion via API
        const response = await ManageServicePromotions.AddPromotion(apiFormattedValues);
        setPromotionData((prev) => [
          ...prev,
          {
            key: response.promotionId.toString(),
            title: response.title,
            description: response.description,
            discountPercent: response.discountPercent,
            startDate: dayjs(response.startDate).format('DD/MM/YYYY'),
            endDate: dayjs(response.endDate).format('DD/MM/YYYY'),
          },
        ]);
        message.success('Promotion added successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(editingKey ? 'Failed to update promotion' : 'Failed to add promotion', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (key) => {
    setLoading(true);
    try {
      await ManageServicePromotions.deletePromotion(key);
      setPromotionData((prev) => prev.filter((item) => item.key !== key));
      message.success('Promotion deleted successfully');
    } catch (error) {
      message.error('Failed to delete promotion', error);
    } finally {
      setLoading(false);
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: 'Discount (%)',
      dataIndex: 'discountPercent',
      key: 'discountPercent',
      sorter: (a, b) => a.discountPercent - b.discountPercent,
      render: (value) => `${value}%`,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: (a, b) => dayjs(a.startDate, 'DD/MM/YYYY').unix() - dayjs(b.startDate, 'DD/MM/YYYY').unix(),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      sorter: (a, b) => dayjs(a.endDate, 'DD/MM/YYYY').unix() - dayjs(b.endDate, 'DD/MM/YYYY').unix(),
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
        loading={loading}
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
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter the promotion title' }]}
          >
            <Input placeholder="e.g., Summer Sale" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter the promotion description' }]}
          >
            <Input placeholder="e.g., 10% discount on all vehicles" />
          </Form.Item>
          <Form.Item
            label="Discount (%)"
            name="discountPercent"
            rules={[{ required: true, message: 'Please enter the discount percentage' }]}
          >
            <InputNumber
              min={0}
              max={100}
              step={1}
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace('%', '')}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            label="Valid Period"
            name="dateRange"
            rules={[{ required: true, message: 'Please select the valid period' }]}
          >
            <RangePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
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

export default Promotion;