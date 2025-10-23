import React, { useState, useEffect } from 'react';
import { Table, Typography, Form, Button, Input, InputNumber, Select, Modal, Row, Col } from 'antd';
import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
import ManageDealerService from '../../../services/ManageDealer/ManageDealerService';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;
const { Option } = Select;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
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
        setFilteredOrders(formattedData);

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

  // Handle search
  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.customerName.toLowerCase().includes(searchCustomer.toLowerCase())
    );
    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchCustomer, orders]);

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
      setFilteredOrders(formattedData);
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
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'Dealer Name',
      dataIndex: 'dealerName',
      key: 'dealerName',
      sorter: (a, b) => a.dealerName.localeCompare(b.dealerName),
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      sorter: (a, b) => {
        const aValue = a.totalAmount === 'N/A' ? 0 : parseFloat(a.totalAmount);
        const bValue = b.totalAmount === 'N/A' ? 0 : parseFloat(b.totalAmount);
        return aValue - bValue;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      sorter: (a, b) => a.note.localeCompare(b.note),
    },
  ];

  // Calculate pagination details
  const totalOrders = filteredOrders.length;
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalOrders);

  return (
    <div>
      <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
        Order  
      </Title>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={20}>
          <Input
            placeholder="Search by Customer Name"
            value={searchCustomer}
            onChange={(e) => setSearchCustomer(e.target.value)}
            allowClear
          />
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            onClick={showModal}
            style={{ width: '100%' }}
          >
            Add Order
          </Button>
        </Col>
      </Row>
      <Text style={{ marginBottom: 16, display: 'block' }}>
        Showing {startIndex} to {endIndex} of {totalOrders} orders
      </Text>
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
        dataSource={filteredOrders}
        loading={loading}
        rowKey="key"
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          total: totalOrders,
          onChange: (page) => setCurrentPage(page),
          
          showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} Store${total !== 1 ? 's' : ''}`,
    
        }}
        bordered
      />
    </div>
  );
};

export default Orders;

//implement some feature like search, sort in Orders.jsx