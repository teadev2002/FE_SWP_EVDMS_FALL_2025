// thay thế DealerId bằng dealer name trong FORM
 import React, { useState, useEffect } from 'react';
import { Table, Typography, Form, Button, Input, InputNumber, Select, Modal } from 'antd';
import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
import ManageDealerService from '../../../services/ManageDealer/ManageDealerService';
import { toast } from 'react-toastify';

const { Title } = Typography;
const { Option } = Select;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch orders
        const orderData = await ManageOrdersService.getAllOrder();
        // Fetch customer and dealer fullName for each order
        const formattedData = await Promise.all(
          orderData.map(async (item) => {
            let customerName = 'Unknown';
            let dealerName = 'Unknown';
            try {
              const customer = await ManageCustomersService.GetCustomerById(item.customerId);
              customerName = customer.fullName || 'Unknown';
            } catch (error) {
              console.error(`Error fetching customer ${item.customerId}:`, error);
            }
            try {
              const dealer = await ManageDealerService.GetDealerById(item.dealerId);
              dealerName = dealer.fullName || 'Unknown';
            } catch (error) {
              console.error(`Error fetching dealer ${item.dealerId}:`, error);
            }
            return {
              key: item.orderId,
              orderId: item.orderId,
              customerName,
              dealerName,
              orderDate: item.orderDate,
              quantity: item.quantity,
              totalAmount: item.totalPrice || 'N/A',
              status: item.status || 'N/A',
              note: item.note || 'None',
            };
          })
        );
        setOrders(formattedData);

        // Fetch customers and dealers for the form
        const customerData = await ManageCustomersService.getAllCustomers();
        const dealerData = await ManageDealerService.getAllDealers();
        setCustomers(customerData);
        setDealers(dealerData);
      } catch (error) {
        toast.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      const formattedData = await Promise.all(
        data.map(async (item) => {
          let customerName = 'Unknown';
          let dealerName = 'Unknown';
          try {
            const customer = await ManageCustomersService.GetCustomerById(item.customerId);
            customerName = customer.fullName || 'Unknown';
          } catch (error) {
            console.error(`Error fetching customer ${item.customerId}:`, error);
          }
          try {
            const dealer = await ManageDealerService.GetDealerById(item.dealerId);
            dealerName = dealer.fullName || 'Unknown';
          } catch (error) {
            console.error(`Error fetching dealer ${item.dealerId}:`, error);
          }
          return {
            key: item.orderId,
            orderId: item.orderId,
            customerName,
            dealerName,
            orderDate: item.orderDate,
            quantity: item.quantity,
            totalAmount: item.totalPrice || 'N/A',
            status: item.status || 'N/A',
            note: item.note || 'None',
          };
        })
      );
      setOrders(formattedData);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      toast.error('Failed to add order', error);
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
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Dealer Name',
      dataIndex: 'dealerName',
      key: 'dealerName',
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
            label="Customer"
            name="customerId"
            rules={[{ required: true, message: 'Please select a Customer!' }]}
          >
            <Select
              showSearch
              placeholder="Select a customer"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {customers.map((customer) => (
                <Option key={customer.customerId} value={customer.customerId}>
                  {customer.fullName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Dealer"
            name="dealerId"
            rules={[{ required: true, message: 'Please select a Dealer!' }]}
          >
            <Select
              showSearch
              placeholder="Select a dealer"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {dealers.map((dealer) => (
                <Option key={dealer.dealerId} value={dealer.dealerId}>
                  {dealer.fullName}
                </Option>
              ))}
            </Select>
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
              <Option value="Processing">Processing</Option>
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