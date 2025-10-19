import React, { useState, useEffect } from 'react';
import { Table, Typography } from 'antd';
import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
import { toast } from 'react-toastify';

const { Title } = Typography;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
        Order Management
      </Title>
      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        rowKey="key"
        pagination={{ pageSize: 5 }}
        bordered
        style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
      />
    </div>
  );
};

export default Orders;