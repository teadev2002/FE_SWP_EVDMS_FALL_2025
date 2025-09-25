import React, { useState, useEffect } from 'react';
import { Table, Card } from 'antd';

const CustomerDebtReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        const mockData = [
          { key: '1', customerName: 'John Doe', debtAmount: 5000, dueDate: '2025-10-15', status: 'Overdue' },
          { key: '2', customerName: 'Jane Smith', debtAmount: 3000, dueDate: '2025-11-01', status: 'Pending' },
        ];
        setData(mockData);
      } catch (error) {
        console.error('Failed to fetch customer debt data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { title: 'Customer Name', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Debt Amount ($)', dataIndex: 'debtAmount', key: 'debtAmount' },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  return (
    <Card title="Customer Debt Report" className="debt-report-card">
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="key"
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default CustomerDebtReport;