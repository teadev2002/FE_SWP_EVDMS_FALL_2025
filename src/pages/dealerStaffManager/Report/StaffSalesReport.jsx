// count dealer active
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Statistic,
  message,
  Spin,
  Empty,
  Tag,
} from 'antd';
import { DownloadOutlined, ShopOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
import ManageServiceSaleAgreements from '../../../services/ManageAgreements/ManageServiceSaleAgreements';
import ManageDealerService from '../../../services/ManageDealer/ManageDealerService';

const { Title, Text } = Typography;

// Safe CSV download helper
const downloadCSV = (csvContent, filename) => {
  if (typeof window === 'undefined') {
    message.error('Download not supported in this environment');
    return;
  }

  try {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = (window.URL || window.webkitURL).createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => window.URL.revokeObjectURL(url), 100);
    message.success('Report downloaded successfully');
  } catch (error) {
    console.error('CSV download failed:', error);
    message.error('Failed to download report');
  }
};

const StaffSalesReport = () => {
  const [orders, setOrders] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [activeStaffCount, setActiveStaffCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get storeId from localStorage
  const getStoreId = useCallback(() => {
    try {
      const info = localStorage.getItem('dealerInfo');
      if (!info) return null;
      const parsed = JSON.parse(info);
      return parsed?.storeId ?? null;
    } catch (err) {
      console.error('Failed to parse dealerInfo:', err);
      return null;
    }
  }, []);

 
  // Fetch Orders + Agreements + Dealers
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const storeId = getStoreId();
    if (!storeId) {
      setError('Store information not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      // 1. LẤY TẤT CẢ ORDERS
      const orderResponse = await ManageOrdersService.getAllOrder();
      let allOrders = [];
      if (orderResponse?.data) {
        allOrders = Array.isArray(orderResponse.data) ? orderResponse.data : [orderResponse.data];
      } else if (Array.isArray(orderResponse)) {
        allOrders = orderResponse;
      }

      // 2. LẤY TẤT CẢ AGREEMENTS
      const agreementResponse = await ManageServiceSaleAgreements.getAllSaleAgreements();
      let allAgreements = [];
      if (agreementResponse?.data) {
        allAgreements = Array.isArray(agreementResponse.data) ? agreementResponse.data : [agreementResponse.data];
      } else if (Array.isArray(agreementResponse)) {
        allAgreements = agreementResponse;
      }

      // 3. LẤY TẤT CẢ DEALERS
      const dealerResponse = await ManageDealerService.getAllDealers();
      let allDealers = [];
      if (dealerResponse?.data) {
        allDealers = Array.isArray(dealerResponse.data) ? dealerResponse.data : [dealerResponse.data];
      } else if (Array.isArray(dealerResponse)) {
        allDealers = dealerResponse;
      }

      // 4. ĐẾM ACTIVE DEALER STAFF (storeId + role + status)
      const activeStaff = allDealers.filter(dealer =>
        dealer?.storeId === storeId &&
        dealer?.status === 'Active'
      );
      setActiveStaffCount(activeStaff.length);
 console.log(dealers)
  console.log(agreements)
      // 5. LỌC ORDERS: chỉ Dealer_staff + storeId
      const validOrders = allOrders.filter(order =>
        order?.dealer?.role === 'Dealer_staff' &&
        order?.store?.storeId === storeId 
         && order.status === 'Completed' 
      );

      // 6. TẠO SET (customerId, storeId) từ AGREEMENTS
      const agreementSet = new Set(
        allAgreements
          .filter(a => a.storeId === storeId)
          .map(a => `${a.customerId}-${a.storeId}`)
      );

      // 7. CHỈ GIỮ ORDER CÓ HỢP ĐỒNG
      const confirmedOrders = validOrders.filter(order =>
        agreementSet.has(`${order.customerId}-${order.store?.storeId}`)
      );

      setOrders(confirmedOrders);
      setAgreements(allAgreements);
      setDealers(allDealers);

    } catch (err) {
      console.error('Failed to fetch data:', err);
      const errMsg = err?.response?.data?.message || err?.message || 'Unknown error';
      setError(`Failed to load data: ${errMsg}`);
      message.error('Failed to load sales data');
    } finally {
      setLoading(false);
    }
  }, [getStoreId]);

  // Gom nhóm theo nhân viên
  const processedData = useMemo(() => {
    if (!orders.length) return [];

    const grouped = orders.reduce((acc, order) => {
      const staffName = order.dealer?.fullName || 'Unknown Staff';
      const vehicleName = order.quotes?.[0]?.vehicle?.modelName || 'Unknown Vehicle';

      let displayDate = 'N/A';
      if (order.orderDate && /^\d{2}\/\d{2}\/\d{4}$/.test(order.orderDate)) {
        const parsed = dayjs(order.orderDate, 'DD/MM/YYYY');
        if (parsed.isValid()) {
          displayDate = parsed.format('DD/MM/YYYY');
        }
      }

      if (!acc[staffName]) {
        acc[staffName] = {
          salesperson: staffName,
          totalSales: 0,
          totalRevenue: 0,
          vehiclesSold: new Set(),
          lastSaleDate: displayDate,
        };
      }

      acc[staffName].totalSales += 1;
      acc[staffName].totalRevenue += Number(order.totalPrice) || 0;
      acc[staffName].vehiclesSold.add(vehicleName);

      if (displayDate !== 'N/A') {
        const current = dayjs(acc[staffName].lastSaleDate, 'DD/MM/YYYY');
        const newDate = dayjs(displayDate, 'DD/MM/YYYY');
        if (!current.isValid() || newDate.isAfter(current)) {
          acc[staffName].lastSaleDate = displayDate;
        }
      }

      return acc;
    }, {});

    return Object.values(grouped).map((item, index) => ({
      key: `${item.salesperson}-${index}`,
      salesperson: item.salesperson,
      totalSales: item.totalSales,
      totalRevenue: item.totalRevenue,
      vehiclesSold: Array.from(item.vehiclesSold),
      lastSaleDate: item.lastSaleDate,
    }));
  }, [orders]);

  // Cập nhật bảng
  useEffect(() => {
    setSalesData(processedData);
  }, [processedData]);

  // Download CSV
  const handleDownloadReport = () => {
    if (salesData.length === 0) {
      message.warning('No data to download');
      return;
    }

    const headers = ['Salesperson', 'Total Sales', 'Total Revenue (VND)', 'Vehicles Sold', 'Last Sale Date'];
    const rows = salesData.map(row => [
      `"${row.salesperson}"`,
      row.totalSales,
      row.totalRevenue.toFixed(2),
      `"${row.vehiclesSold.join('; ')}"`,
      row.lastSaleDate,
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const filename = `sales_report_store${getStoreId() || 'unknown'}_${dayjs().format('YYYY-MM-DD')}.csv`;

    downloadCSV(csvContent, filename);
  };

  // Load data
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Table columns
  const columns = [
    {
      title: 'Sales Staff',
      dataIndex: 'salesperson',
      key: 'salesperson',
      sorter: (a, b) => a.salesperson.localeCompare(b.salesperson),
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Total Sales',
      dataIndex: 'totalSales',
      key: 'totalSales',
      sorter: (a, b) => a.totalSales - b.totalSales,
      render: (value) => <Tag color="blue">{value}</Tag>,
    },
    {
      title: 'Total Revenue',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      sorter: (a, b) => a.totalRevenue - b.totalRevenue,
      render: (value) => (
        <Text strong type="success">
          {value.toFixed(2)} VND
        </Text>
      ),
    },
    {
      title: 'Vehicles Sold',
      dataIndex: 'vehiclesSold',
      key: 'vehiclesSold',
      render: (vehicles) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {vehicles.join(', ')}
        </Text>
      ),
    },
    {
      title: 'Last Sale',
      dataIndex: 'lastSaleDate',
      key: 'lastSaleDate',
      render: (date) => date === 'N/A' ? <Text type="danger">N/A</Text> : date,
    },
  ];

  // Summary
  const totalSales = salesData.reduce((sum, r) => sum + r.totalSales, 0);
  const totalRevenue = salesData.reduce((sum, r) => sum + r.totalRevenue, 0);
  const storeId = getStoreId();
  console.log('Store ID:', storeId);
  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* Header */}
        <div>
          <Title level={2}>
            <ShopOutlined /> Sales Report by Staff
          </Title>
        
        </div>

        {/* Loading */}
        {loading && (
          <Card>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
              <Text style={{ display: 'block', marginTop: 16 }}>Loading data...</Text>
            </div>
          </Card>
        )}

        {/* Error */}
        {error && !loading && (
          <Card>
            <Empty
              description={
                <Text type="danger">
                  <strong>Error:</strong> {error}
                </Text>
              }
            />
          </Card>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Summary */}
            <Card
              title="Summary (Only Signed Agreements)"
              bordered={false}
              style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            >
              <Space size={24} wrap>
                <Statistic title="Total Confirmed Orders" value={totalSales} />
                <Statistic
                  title="Total Revenue"
                  value={totalRevenue}
                  prefix="VND"
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                />
                <Statistic title="Active Dealer Staff" value={activeStaffCount} />
              </Space>
            </Card>

            {/* Table */}
            <Card
              title="Staff Sales Details"
              bordered={false}
              style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              extra={
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleDownloadReport}
                  disabled={salesData.length === 0}
                >
                  Download CSV
                </Button>
              }
            >
              {salesData.length === 0 ? (
                <Empty description="No confirmed sales (with signed agreements)" />
              ) : (
                <Table
                  columns={columns}
                  dataSource={salesData}
                  rowKey="key"
                  pagination={{
                    pageSize: 10,
                    showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} Staff`,
                  }}
                  scroll={{ x: 800 }}
                  style={{ marginTop: 16 }}
                />
              )}
            </Card>
          </>
        )}
      </Space>
    </div>
  );
};

export default StaffSalesReport;