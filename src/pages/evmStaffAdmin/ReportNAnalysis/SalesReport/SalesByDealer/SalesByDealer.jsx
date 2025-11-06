import React, { useState } from 'react';
import { Table, Button, Select, Space, Statistic, Card, message, DatePicker } from 'antd';
import { DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const SalesByDealer = () => {
  // Sample sales data by dealer
  const [salesData, setSalesData] = useState([
    {
      key: '1',
      dealer: 'City Y Dealership',
      totalSales: 25,
      totalRevenue: 1125000.00,
      status: 'Active',
      lastSaleDate: '2025-09-20',
    },
    {
      key: '2',
      dealer: 'City Z Dealership',
      totalSales: 15,
      totalRevenue: 675000.00,
      status: 'Active',
      lastSaleDate: '2025-09-18',
    },
    {
      key: '3',
      dealer: 'City X Dealership',
      totalSales: 10,
      totalRevenue: 450000.00,
      status: 'Pending',
      lastSaleDate: '2025-09-22',
    },
  ]);

  // State for filters
  const [statusFilter, setStatusFilter] = useState(null);
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'day'), dayjs()]);

  // Handle status filter
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    applyFilters(value, dateRange);
  };

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    applyFilters(statusFilter, dates);
  };

  // Apply filters
  const applyFilters = (status, dates) => {
    let filteredData = [...salesData]; // Create a copy of the original data
    if (status) {
      filteredData = filteredData.filter((item) => item.status === status);
    }
    if (dates && dates[0] && dates[1]) {
      const startDate = dates[0].startOf('day');
      const endDate = dates[1].endOf('day');
      filteredData = filteredData.filter((item) =>
        dayjs(item.lastSaleDate).isBetween(startDate, endDate, null, '[]')
      );
    }
    setSalesData(filteredData);
  };

  // Handle report download
  const handleDownloadReport = () => {
    // TODO: Implement CSV/PDF download logic
    message.success('Dealer sales report download initiated');
  };

  // Calculate total metrics
  const totalSales = salesData.reduce((sum, record) => sum + record.totalSales, 0);
  const totalRevenue = salesData.reduce((sum, record) => sum + record.totalRevenue, 0);

  // Table columns
  const columns = [
    {
      title: 'Dealer',
      dataIndex: 'dealer',
      key: 'dealer',
      sorter: (a, b) => a.dealer.localeCompare(b.dealer),
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Pending', value: 'Pending' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Last Sale Date',
      dataIndex: 'lastSaleDate',
      key: 'lastSaleDate',
      sorter: (a, b) => dayjs(a.lastSaleDate).unix() - dayjs(b.lastSaleDate).unix(),
    },
  ];

  return (
    <div>
      <Card
        title="Sales Summary by Dealer"
        variant='borderless'
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
      <Table
        columns={columns}
        dataSource={salesData}
        rowKey="key"
        pagination={{ pageSize: 10 }}
        style={{ marginTop: 16 }}
        title={() => (
          <Space>
            <Select
              placeholder="Filter by Status"
              allowClear
              style={{ width: 200 }}
              onChange={handleStatusFilter}
            >
              <Option value="Active">Active</Option>
              <Option value="Pending">Pending</Option>
            </Select>
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
        )}
      />
    </div>
  );
};

export default SalesByDealer;