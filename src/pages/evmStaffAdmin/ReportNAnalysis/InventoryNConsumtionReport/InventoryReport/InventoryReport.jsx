import React, { useState } from 'react';
import { Table, Button, Select, Space, Statistic, Card, message, DatePicker } from 'antd';
import { DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const InventoryReport = () => {
  // Sample inventory data
  const [inventoryData, setInventoryData] = useState([
    {
      key: '1',
      model: 'EcoVolt X1',
      vin: '5YJ3E1EA0MF123456',
      status: 'In Stock',
      quantity: 10,
      location: 'Warehouse A, City Y',
      lastUpdated: '2025-09-20',
    },
    {
      key: '2',
      model: 'EcoVolt S2',
      vin: '5YJ3E1EA0MF789012',
      status: 'In Transit',
      quantity: 5,
      location: 'Distribution Center, City Z',
      lastUpdated: '2025-09-18',
    },
    {
      key: '3',
      model: 'EcoVolt Z3',
      vin: '5YJ3E1EA0MF345678',
      status: 'Sold',
      quantity: 0,
      location: 'Dealership, City X',
      lastUpdated: '2025-09-22',
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
    let filteredData = [...inventoryData]; // Create a copy of the original data
    if (status) {
      filteredData = filteredData.filter((item) => item.status === status);
    }
    if (dates && dates[0] && dates[1]) {
      const startDate = dates[0].startOf('day');
      const endDate = dates[1].endOf('day');
      filteredData = filteredData.filter((item) =>
        dayjs(item.lastUpdated).isBetween(startDate, endDate, null, '[]')
      );
    }
    setInventoryData(filteredData);
  };

  // Handle report download
  const handleDownloadReport = () => {
    // TODO: Implement CSV/PDF download logic
    message.success('Inventory report download initiated');
  };

  // Calculate total quantity
  const totalQuantity = inventoryData.reduce((sum, record) => sum + record.quantity, 0);

  // Table columns
  const columns = [
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      sorter: (a, b) => a.model.localeCompare(b.model),
    },
    {
      title: 'VIN',
      dataIndex: 'vin',
      key: 'vin',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'In Stock', value: 'In Stock' },
        { text: 'In Transit', value: 'In Transit' },
        { text: 'Sold', value: 'Sold' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      sorter: (a, b) => dayjs(a.lastUpdated).unix() - dayjs(b.lastUpdated).unix(),
    },
  ];

  return (
    <div>
      <Card
        title="Inventory Summary"
        variant='borderless'
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', marginBottom: 16 }}
      >
        <Space size="large">
          <Statistic title="Total Quantity" value={totalQuantity} />
        </Space>
      </Card>
      <Table
        columns={columns}
        dataSource={inventoryData}
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
              <Option value="In Stock">In Stock</Option>
              <Option value="In Transit">In Transit</Option>
              <Option value="Sold">Sold</Option>
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

export default InventoryReport;