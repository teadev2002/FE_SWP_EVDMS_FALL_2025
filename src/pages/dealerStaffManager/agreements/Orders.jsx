import React, { useState, useEffect } from 'react';
import { Table, Typography, Form, Input, Button, InputNumber, Select, Modal } from 'antd';
import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
import { toast } from 'react-toastify';

const { Title } = Typography;
const { Option } = Select;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await ManageOrdersService.getAllOrder();
        const formattedData = data.map(item => ({
          key: item.orderId,
          orderId: item.orderId,
          customerId: item.customerId,
          dealerId: item.dealerId,
          orderDate: item.orderDate,
          quantity: item.quantity,
          totalAmount: item.totalPrice || 'N/A',
          status: item.status || 'N/A',
          note: item.note || 'None',
        }));
        setOrders(formattedData);
      } catch (error) {
        toast.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddOrder = async (values) => {
    setLoading(true);
    try {
      const newOrder = {
        customerId: values.customerId,
        dealerId: values.dealerId,
        quantity: values.quantity,
        totalPrice: values.totalPrice,
        status: values.status,
        note: values.note,
      };
      await ManageOrdersService.addOrder(newOrder);
      toast.success('Order added successfully');
      // Refresh the orders list
      const data = await ManageOrdersService.getAllOrder();
      const formattedData = data.map(item => ({
        key: item.orderId,
        orderId: item.orderId,
        customerId: item.customerId,
        dealerId: item.dealerId,
        orderDate: item.orderDate,
        quantity: item.quantity,
        totalAmount: item.totalPrice || 'N/A',
        status: item.status || 'N/A',
        note: item.note || 'None',
      }));
      setOrders(formattedData);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      toast.error('Failed to add order',error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      sorter: (a, b) => a.orderId - b.orderId,
    },
    {
      title: 'Customer ID',
      dataIndex: 'customerId',
      key: 'customerId',
    },
    {
      title: 'Dealer ID',
      dataIndex: 'dealerId',
      key: 'dealerId',
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
    },
  ];

  return (
    <div>
      <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
        Order Management
      </Title>
      <Button
        type="primary"
        onClick={showModal}
        style={{ marginBottom: 16 }}
      >
        Add Order
      </Button>
      <Modal
        title="Add New Order"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddOrder}
        >
          <Form.Item
            label="Customer ID"
            name="customerId"
            rules={[{ required: true, message: 'Please input Customer ID!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Dealer ID"
            name="dealerId"
            rules={[{ required: true, message: 'Please input Dealer ID!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: 'Please input Quantity!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Total Price"
            name="totalPrice"
            rules={[{ required: true, message: 'Please input Total Price!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select Status!' }]}
          >
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Note"
            name="note"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Add Order
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        rowKey="key"
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default Orders;