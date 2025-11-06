import React from 'react';
import { Card, Table, Button } from 'antd';

// Mock data for car statistics
const carStatsData = [
  { key: 1, carModel: 'Tesla Model 3', status: 'Sold' },
  { key: 2, carModel: 'Nissan Leaf', status: 'Pending Delivery' },
  { key: 3, carModel: 'Chevrolet Bolt', status: 'Promotion' },
  { key: 4, carModel: 'Ford Mustang Mach-E', status: 'Sold' },
  { key: 5, carModel: 'Rivian R1T', status: 'Pending Delivery' },
  { key: 6, carModel: 'Volkswagen ID.4', status: 'Promotion' },
];

// Table columns configuration
const columns = [
  {
    title: 'Car Model',
    dataIndex: 'carModel',
    key: 'carModel',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <span className={`dashboard-status dashboard-status-${status.toLowerCase().replace(' ', '-')}`}>
        {status}
      </span>
    ),
  },
];

const CarStatistics = () => {
  return (
    <Card title="Car Statistics" className="dashboard-table-card">
      <Table
        columns={columns}
        dataSource={carStatsData}
        pagination={false}
        size="middle"
        className="dashboard-table"
      />
      <Button type="primary" className="dashboard-view-more-btn">
        View More Details
      </Button>
    </Card>
  );
};

export default CarStatistics;