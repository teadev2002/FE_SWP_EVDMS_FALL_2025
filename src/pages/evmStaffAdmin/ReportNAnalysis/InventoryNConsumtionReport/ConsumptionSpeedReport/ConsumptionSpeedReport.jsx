import React, { useState } from 'react';
import { Table, Button, Select, Space, Statistic, Card, message, DatePicker } from 'antd';
import { DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const ConsumptionSpeedReport = () => {
  // Sample consumption speed data
  const [consumptionData, setConsumptionData] = useState([
    {
      key: '1',
      model: 'EcoVolt X1',
      salesCount: 15,
      consumptionRate: 0.5, // Vehicles sold per day
      totalRevenue: 675000.00,
      period: '2025-09-01 to 2025-09-30',
    },
    {
      key: '2',
      model: 'EcoVolt S2',
      salesCount: 10,
      consumptionRate: 0.33,
      totalRevenue: 380000.00,
      period: '2025-09-01 to 2025-09-30',
    },
    {
      key: '3',
      model: 'EcoVolt Z3',
      salesCount: 5,
      consumptionRate: 0.17,
      totalRevenue: 260000.00,
      period: '2025-09-01 to 2025-09-30',
    },
  ]);

  // State for filters
  const [modelFilter, setModelFilter] = useState(null);
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'day'), dayjs()]);

  // Handle model filter
  const handleModelFilter = (value) => {
    setModelFilter(value);
    applyFilters(value, dateRange);
  };

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    applyFilters(modelFilter, dates);
  };

  // Apply filters
  const applyFilters = (model, dates) => {
    let filteredData = [...consumptionData]; // Create a copy of the original data
    if (model) {
      filteredData = filteredData.filter((item) => item.model === model);
    }
    if (dates && dates[0] && dates[1]) {
      const startDate = dates[0].startOf('day');
      const endDate = dates[1].endOf('day');
      filteredData = filteredData.filter((item) => {
        const [periodStart, periodEnd] = item.period.split(' to ').map((date) => dayjs(date));
        return periodStart.isBetween(startDate, endDate, null, '[]') || periodEnd.isBetween(startDate, endDate, null, '[]');
      });
    }
    setConsumptionData(filteredData);
  };

  // Handle report download
  const handleDownloadReport = () => {
    // TODO: Implement CSV/PDF download logic
    message.success('Consumption speed report download initiated');
  };

  // Calculate total metrics
  const totalSalesCount = consumptionData.reduce((sum, record) => sum + record.salesCount, 0);
  const totalRevenue = consumptionData.reduce((sum, record) => sum + record.totalRevenue, 0);

  // Table columns
  const columns = [
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      sorter: (a, b) => a.model.localeCompare(b.model),
      filters: [
        { text: 'EcoVolt X1', value: 'EcoVolt X1' },
        { text: 'EcoVolt S2', value: 'EcoVolt S2' },
        { text: 'EcoVolt Z3', value: 'EcoVolt Z3' },
      ],
      onFilter: (value, record) => record.model === value,
    },
    {
      title: 'Sales Count',
      dataIndex: 'salesCount',
      key: 'salesCount',
      sorter: (a, b) => a.salesCount - b.salesCount,
    },
    {
      title: 'Consumption Rate (Vehicles/Day)',
      dataIndex: 'consumptionRate',
      key: 'consumptionRate',
      sorter: (a, b) => a.consumptionRate - b.consumptionRate,
      render: (value) => value.toFixed(2),
    },
    {
      title: 'Total Revenue (USD)',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      sorter: (a, b) => a.totalRevenue - b.totalRevenue,
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
    },
  ];

  return (
    <div>
      <Card
        title="Consumption Speed Summary"
          variant='borderless'
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', marginBottom: 16 }}
      >
        <Space size="large">
          <Statistic title="Total Sales Count" value={totalSalesCount} />
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
        dataSource={consumptionData}
        rowKey="key"
        pagination={{ pageSize: 10 }}
        style={{ marginTop: 16 }}
        title={() => (
          <Space>
            <Select
              placeholder="Filter by Model"
              allowClear
              style={{ width: 200 }}
              onChange={handleModelFilter}
            >
              <Option value="EcoVolt X1">EcoVolt X1</Option>
              <Option value="EcoVolt S2">EcoVolt S2</Option>
              <Option value="EcoVolt Z3">EcoVolt Z3</Option>
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

export default ConsumptionSpeedReport;