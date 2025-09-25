import React, { useState, useEffect } from 'react';
import { Table, Card } from 'antd';

const FactoryDebtReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        const mockData = [
          { key: '1', factoryName: 'Factory A', debtAmount: 10000, dueDate: '2025-10-20', status: 'Overdue' },
          { key: '2', factoryName: 'Factory B', debtAmount: 7500, dueDate: '2025-11-10', status: 'Pending' },
        ];
        setData(mockData);
      } catch (error) {
        console.error('Failed to fetch factory debt data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { title: 'Factory Name', dataIndex: 'factoryName', key: 'factoryName' },
    { title: 'Debt Amount ($)', dataIndex: 'debtAmount', key: 'debtAmount' },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  return (
    <Card title="Factory Debt Report" className="debt-report-card">
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

export default FactoryDebtReport;