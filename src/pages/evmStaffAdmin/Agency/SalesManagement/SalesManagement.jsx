// src/pages/evmStaffAdmin/Agency/SalesManagement/SalesManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Table,
  Typography,
  Button,
  Input,
  Tag,
  Modal,
  Descriptions,
  Row,
  Col,
  Space,
  Card,
  message,
} from 'antd';
import dayjs from 'dayjs';
import ManageOrdersByBrand from '../../../../services/ManageOrdersByBrand/ManageOrdersByBrand';

const { Title } = Typography;

const SalesManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // Lấy brandId từ localStorage (staffInfo)
  const getCurrentBrandId = () => {
    try {
      const staffInfoStr = localStorage.getItem('staffInfo');
      if (!staffInfoStr) {
        throw new Error('No staffInfo in localStorage');
      }
      const staffInfo = JSON.parse(staffInfoStr);
      const brandId = staffInfo.brandId;
      if (!brandId) {
        throw new Error('No brandId found in staffInfo');
      }
      return Number(brandId); // Đảm bảo là number
    } catch (error) {
      console.error('Error getting brandId from localStorage:', error);
      return null;
    }
  };

  // Tải orders theo brandId (không cần filter store, chỉ theo brand)
  useEffect(() => {
    const fetchOrders = async () => {
      const brandId = getCurrentBrandId();

      if (!brandId) {
        message.error('No brandId found from staff info. Please log in again.');
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const rawOrders = await ManageOrdersByBrand.getOrdersByBrandId(brandId);

        // Enrich data cho table: chỉ hiển thị info cơ bản
        const enrichedOrders = rawOrders.map(order => ({
          key: order.orderId,
          orderId: order.orderId,
          customerName: order.customer?.fullName || 'N/A',
          vehicleName: order.quotes && order.quotes.length > 0
            ? order.quotes.map(q => `${q.vehicle?.modelName} ${q.vehicle?.version}`).join(', ')
            : 'N/A', // Hiển thị tất cả vehicles nếu nhiều, hoặc N/A
          dealerName: order.dealer?.fullName || 'N/A',
          orderDate: order.orderDate ? order.orderDate.replace(/-/g, '/') : 'N/A', // Chuyển DD-MM-YYYY → DD/MM/YYYY
          totalPrice: order.totalPrice || 0,
          status: order.status || 'N/A',
          // Lưu full data cho detail
          fullData: order,
        }));

        setOrders(enrichedOrders);
        setFilteredOrders(enrichedOrders);
        if (enrichedOrders.length === 0) {
          message.info('No orders found for this brand.');
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        message.error('Failed to load orders list. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // Chỉ load once

  // Tìm kiếm
  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        order.vehicleName.toLowerCase().includes(searchText.toLowerCase()) ||
        order.dealerName.toLowerCase().includes(searchText.toLowerCase()) ||
        order.orderDate.includes(searchText)
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchText, orders]);

  // Mở modal detail
  const handleViewDetail = (order) => {
    setSelectedOrder(order.fullData);
    setIsDetailModalVisible(true);
  };

  // Đóng modal
  const handleCloseDetail = () => {
    setIsDetailModalVisible(false);
    setSelectedOrder(null);
  };

  // Cột table: Chỉ hiển thị info cơ bản
  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      sorter: (a, b) => a.orderId - b.orderId,
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'Vehicle',
      dataIndex: 'vehicleName',
      key: 'vehicleName',
      ellipsis: true,
      sorter: (a, b) => a.vehicleName.localeCompare(b.vehicleName),
    },
    {
      title: 'Dealer',
      dataIndex: 'dealerName',
      key: 'dealerName',
      sorter: (a, b) => a.dealerName.localeCompare(b.dealerName),
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      sorter: (a, b) => {
        const parseDate = (d) => {
          if (!d || d === 'N/A') return 0;
          const [day, month, year] = d.split('/').map(Number);
          return new Date(year, month - 1, day).getTime();
        };
        return parseDate(a.orderDate) - parseDate(b.orderDate);
      },
    },
    {
      title: 'Total Price (VND)',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      render: (value) => value ? value.toLocaleString('vi-VN') : '0',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Completed' ? 'green' : status === 'Pending' ? 'blue' : status === 'Cancelled' ? 'red' : 'default'}>
          {status}
        </Tag>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => handleViewDetail(record)}
          >
            Detail
          </Button>
        </Space>
      ),
    },
  ];

  const totalOrders = filteredOrders.length;
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalOrders);

  // Modal detail: Hiển thị read-only với Descriptions
  const renderDetailModal = () => {
    if (!selectedOrder) return null;

    const order = selectedOrder;
    const formatDate = (dateStr) => dateStr ? dateStr.replace(/-/g, '/') : 'N/A';

    return (
      <Modal
        title={`Order Detail #${order.orderId}`}
        open={isDetailModalVisible}
        onCancel={handleCloseDetail}
        footer={null}
        width={800}
      >
        <Descriptions bordered column={1} size="small">
          {/* Order Info */}
          <Descriptions.Item label="Order ID">{order.orderId}</Descriptions.Item>
          <Descriptions.Item label="Order Date">{formatDate(order.orderDate)}</Descriptions.Item>
          <Descriptions.Item label="Total Price (VND)">{order.totalPrice ? order.totalPrice.toLocaleString('vi-VN') : '0'}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={order.status === 'Completed' ? 'green' : order.status === 'Pending' ? 'blue' : order.status === 'Cancelled' ? 'red' : 'default'}>
              {order.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Note">{order.note || 'N/A'}</Descriptions.Item>

          {/* Customer Info */}
          <Descriptions.Item label="Customer Name" span={3}>
            {order.customer?.fullName || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{order.customer?.email || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Phone">{order.customer?.phone || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Address">{order.customer?.address || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Date of Birth">
            {order.customer?.dateOfBirth ? dayjs(order.customer.dateOfBirth).format('DD/MM/YYYY') : 'N/A'}
          </Descriptions.Item>

          {/* Dealer Info */}
          <Descriptions.Item label="Dealer Name" span={3}>
            {order.dealer?.fullName || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Role">{order.dealer?.role || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Phone">{order.dealer?.phone || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Email">{order.dealer?.email || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Address">{order.dealer?.address || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Dealer Status">{order.dealer?.status || 'N/A'}</Descriptions.Item>

          {/* Quotes/Vehicles */}
          {order.quotes && order.quotes.length > 0 && (
            <>
              <Descriptions.Item label="Quotes/Vehicles" span={3}>
                <ul>
                  {order.quotes.map((quote, index) => (
                    <li key={quote.quoteId}>
                      <strong>Quote #{quote.quoteId} - Date: {formatDate(quote.quoteDate)} - Status: {quote.status}</strong>
                      <br />
                      Vehicle: {quote.vehicle?.modelName} {quote.vehicle?.version} ({quote.vehicle?.year}, Color: {quote.vehicle?.color})
                      <br />
                      Price: {quote.vehicle?.price ? quote.vehicle.price.toLocaleString('vi-VN') : 'N/A'} VND
                      <br />
                      Details: {quote.vehicle?.vehicleType}, Range: {quote.vehicle?.rangePerCharge}, Horsepower: {quote.vehicle?.horsepower} HP
                      <br />
                      Battery: {quote.vehicle?.batteryCapacity}, Seats: {quote.vehicle?.seatingCapacity}, Transmission: {quote.vehicle?.transmission}
                    </li>
                  ))}
                </ul>
              </Descriptions.Item>
            </>
          )}
        </Descriptions>

        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <Space>
            <Button onClick={handleCloseDetail} type="primary">
              Close
            </Button>
          </Space>
        </div>
      </Modal>
    );
  };

  return (
    <div>
      <Title level={2}>Sales Management</Title>
      <Card
        title="Orders Records"
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
        extra={
          <Space>
            <Button
              type="primary"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </Space>
        }
      >
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={20}>
            <Input
              placeholder="Search by customer name, vehicle, dealer or date"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Button
              type="primary"
              onClick={() => window.location.reload()}
              style={{ width: '100%' }}
            >
              Refresh
            </Button>
          </Col>
        </Row>

        <div style={{ marginBottom: 16, fontSize: 14, color: '#666' }}>
          Showing {startIndex} to {endIndex} of {totalOrders} orders
        </div>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          loading={loading}
          rowKey="key"
          pagination={{
            pageSize,
            current: currentPage,
            total: totalOrders,
            onChange: (page) => setCurrentPage(page),
            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} orders`,
          }}
          bordered
          scroll={{ x: 800 }}
        />
      </Card>

      {renderDetailModal()}
    </div>
  );
};

export default SalesManagement;