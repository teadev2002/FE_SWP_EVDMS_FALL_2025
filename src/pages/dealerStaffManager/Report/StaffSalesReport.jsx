import React, { useState } from 'react';
import { Card, Table, Button, DatePicker, Space, Typography, Statistic, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const mockSalesData = [
  {
    key: '1',
    salesperson: 'Alice Smith',
    totalSales: 5,
    totalRevenue: 225000.0,
    vehiclesSold: ['EcoVolt X1', 'EcoVolt S2'],
    lastSaleDate: '2025-09-20',
  },
  {
    key: '2',
    salesperson: 'Bob Johnson',
    totalSales: 3,
    totalRevenue: 135000.0,
    vehiclesSold: ['EcoVolt X1'],
    lastSaleDate: '2025-09-18',
  },
  {
    key: '3',
    salesperson: 'Carol Williams',
    totalSales: 7,
    totalRevenue: 315000.0,
    vehiclesSold: ['EcoVolt S2', 'EcoVolt Z3'],
    lastSaleDate: '2025-09-22',
  },
];

const StaffSalesReport = () => {
  const [salesData, setSalesData] = useState(mockSalesData);
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'day'), dayjs()]);

  // Table columns
  const columns = [
    {
      title: 'Salesperson',
      dataIndex: 'salesperson',
      key: 'salesperson',
      sorter: (a, b) => a.salesperson.localeCompare(b.salesperson),
    },
    {
      title: 'Total Sales',
      dataIndex: 'totalSales',
      key: 'totalSales',
      sorter: (a, b) => a.totalSales - b.totalSales,
    },
    {
      title: 'Total Revenue (USD)',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      sorter: (a, b) => a.totalRevenue - b.totalRevenue,
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      title: 'Vehicles Sold',
      dataIndex: 'vehiclesSold',
      key: 'vehiclesSold',
      render: (vehicles) => vehicles.join(', '),
    },
    {
      title: 'Last Sale Date',
      dataIndex: 'lastSaleDate',
      key: 'lastSaleDate',
      sorter: (a, b) => dayjs(a.lastSaleDate).unix() - dayjs(b.lastSaleDate).unix(),
    },
  ];

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates && dates[0] && dates[1]) {
      const startDate = dates[0].startOf('day');
      const endDate = dates[1].endOf('day');
      const filteredData = mockSalesData.filter((item) =>
        dayjs(item.lastSaleDate).isBetween(startDate, endDate, null, '[]')
      );
      setSalesData(filteredData);
    } else {
      // Reset to original data if no date range is selected
      setSalesData(mockSalesData);
    }
  };

  // Handle report download
  const handleDownloadReport = () => {
    // TODO: Implement CSV/PDF download logic
    message.success('Report download initiated');
  };

  // Calculate total metrics
  const totalSales = salesData.reduce((sum, record) => sum + record.totalSales, 0);
  const totalRevenue = salesData.reduce((sum, record) => sum + record.totalRevenue, 0);

  return (
    <div>
      <Title level={2}>Sales Report by Salesperson</Title>
      <Card
        title="Summary"
        bordered={false}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', marginBottom: 16 }}
      >
        <Space size="large">
          <Statistic title="Total Sales" value={totalSales} />
          <Statistic
            title="Total Revenue"
            value={totalRevenue}
            prefix="$"
            precision={2}
          />
        </Space>
      </Card>

      <Card
        title="Sales Details"
        bordered={false}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
        extra={
          <Space>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              style={{ width: 250 }}
            />
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownloadReport}
            >
              Download Report
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={salesData}
          rowKey="key"
          pagination={{ pageSize: 10 }}
          style={{ marginTop: 16 }}
        />
      </Card>
    </div>
  );
};

export default StaffSalesReport;