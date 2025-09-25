import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import ManageServiceAgreements from '../../../services/ManageAgreements/ManageServiceAgreements';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await ManageServiceAgreements.getAllOrders(); // Assuming this service method exists
        const formattedData = data.map(item => ({
          key: item.orderId,
          customerName: item.customerName,
          orderDate: item.orderDate,
          totalAmount: item.totalAmount || 'N/A',
          status: item.status || 'N/A',
        }));
        setOrders(formattedData);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
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
  ];

  return (
    <div>
      <h3>Orders</h3>
      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        rowKey="key"
      />
    </div>
  );
};

export default Orders;