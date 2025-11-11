import React, { useState, useEffect } from 'react';
import {
  Table,
  Typography,
  Input,
  Space,
  Button,
  Popconfirm,
  Tag,
  Row,
  Col,
  Modal,
  Descriptions,
  Spin,
  Card,
} from 'antd';
import { DeleteOutlined, StarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

// Services
import FeedbackService from '../../../services/ManageFeedback/FeedbackService';
import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
import ManageVehicleService from '../../../services/ManageVehicleService/ManageVehicleService';

const { Title } = Typography;

const CustomerFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [vehicleInfo, setVehicleInfo] = useState(null);

  // Lấy storeId
  const getDealerStoreId = () => {
    try {
      const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
      return dealerInfo.storeId ? Number(dealerInfo.storeId) : null;
    } catch {
      return null;
    }
  };

  // Tìm kiếm
  const applyFilter = (data) => {
    if (!searchText.trim()) return data;
    const query = searchText.toLowerCase();
    return data.filter(item =>
      (item.customerName || '').toLowerCase().includes(query) ||
      (item.comment || '').toLowerCase().includes(query) ||
      item.createDate.includes(searchText) ||
      (item.orderCode || '').includes(searchText)
    );
  };

  // Load danh sách feedback + fullName
  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      const storeId = getDealerStoreId();
      if (!storeId) {
        toast.error('Store information not found.');
        setLoading(false);
        return;
      }

      try {
        const response = await FeedbackService.getFeedbackByStoreId(storeId);
        const rawFeedbacks = Array.isArray(response) ? response : [response];

        // Lấy fullName cho từng customer
        const formatted = [];
        for (const fb of rawFeedbacks) {
          try {
            const customer = await ManageCustomersService.GetCustomerById(fb.customerId);
            const customerName = customer?.fullName || `Customer #${fb.customerId}`;
            
            formatted.push({
              key: fb.feedbackId,
              feedbackId: fb.feedbackId,
              customerId: fb.customerId,
              orderId: fb.orderId,
              vehicleId: fb.vehicleId,
              rating: fb.rating,
              comment: fb.comment || 'N/A',
              createDate: fb.createDate || 'N/A',
              customerName, // Sử dụng fullName từ API
              orderCode: fb.orderCode || `ORD-${fb.orderId}`,
              vehicleName: fb.vehicleName || `Vehicle #${fb.vehicleId}`,
            });
          } catch (error) {
            console.warn(`Failed to get customer ${fb.customerId}:`, error);
            // Fallback nếu API fail
            formatted.push({
              key: fb.feedbackId,
              feedbackId: fb.feedbackId,
              customerId: fb.customerId,
              orderId: fb.orderId,
              vehicleId: fb.vehicleId,
              rating: fb.rating,
              comment: fb.comment || 'N/A',
              createDate: fb.createDate || 'N/A',
              customerName: `Customer #${fb.customerId}`,
              orderCode: fb.orderCode || `ORD-${fb.orderId}`,
              vehicleName: fb.vehicleName || `Vehicle #${fb.vehicleId}`,
            });
          }
        }

        setFeedbacks(formatted);
        setFilteredFeedbacks(applyFilter(formatted));
      } catch (error) {
        toast.error('Failed to load feedback data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  // Cập nhật tìm kiếm
  useEffect(() => {
    setFilteredFeedbacks(applyFilter(feedbacks));
    setCurrentPage(1);
  }, [searchText, feedbacks]);

  // Mở modal chi tiết
  const openDetailModal = async (record) => {
    setSelectedFeedback(record);
    setModalVisible(true);
    setModalLoading(true);
    setCustomerInfo(null);
    setOrderInfo(null);
    setVehicleInfo(null);

    try {
      const [cust, order, vehicle] = await Promise.all([
        ManageCustomersService.GetCustomerById(record.customerId).catch(() => null),
        ManageOrdersService.getOrderById(record.orderId).catch(() => null),
        ManageVehicleService.GetVehicleById(record.vehicleId).catch(() => null),
      ]);

      setCustomerInfo(cust ? {
        fullName: cust.fullName,
        phone: cust.phone,
        email: cust.email,
        address: cust.address,
      } : null);

      setOrderInfo(order ? {
        orderDate: order.orderDate,
        totalPrice: order.totalPrice,
        status: order.status,
        note: order.note,
      } : null);

      setVehicleInfo(vehicle ? {
        modelName: vehicle.modelName,
        year: vehicle.year,
        color: vehicle.color,
        price: vehicle.price,
      } : null);
    } catch (error) {
      toast.error('Failed to load detail information.');
      console.error(error);
    } finally {
      setModalLoading(false);
    }
  };

  // Xóa feedback
  const handleDelete = async (feedbackId) => {
    try {
       await FeedbackService.deleteFeedback(feedbackId); // Nếu có API xóa
      await new Promise(r => setTimeout(r, 300));
      const updated = feedbacks.filter(f => f.feedbackId !== feedbackId);
      setFeedbacks(updated);
      setFilteredFeedbacks(applyFilter(updated));
      toast.success('Feedback deleted successfully');
    } catch {
      toast.error('Failed to delete feedback.');
    }
  };

  // Cột bảng
  const columns = [
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
      render: (name) => (
        <span  >{name}</span>
      ),
    },
  
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      sorter: (a, b) => a.rating - b.rating,
      render: (rating) => (
        <Space>
          {[...Array(5)].map((_, i) => (
            <StarOutlined
              key={i}
              style={{ color: i < rating ? '#faad14' : '#d9d9d9', fontSize: 16 }}
            />
          ))}
          
        </Space>
      ),
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
    },
    {
      title: 'Date',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: (a, b) => {
        const parse = d => dayjs(d, 'DD/MM/YYYY').unix();
        return parse(a.createDate) - parse(b.createDate);
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      onCell: () => ({ onClick: e => e.stopPropagation() }),
      render: (_, record) => (
        <Popconfirm
          title="Delete this feedback?"
          description="This action cannot be undone."
          onConfirm={() => handleDelete(record.feedbackId)}
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
        >
          <Button type="link" danger 
           style={{
              background: 'linear-gradient(135deg, #ff1f01ff 0%, #df9292ff 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '0.875rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
              >
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const total = filteredFeedbacks.length;
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, total);

  return (
    <div>
      <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
        Customer Feedback
      </Title>

      <Title level={3} style={{ color: '#1F1F1F', marginBottom: 24 }}>
        Feedback Management
      </Title>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Input
            placeholder="Search by customer name, comment, order, or date..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="large"
          />
        </Col>
      </Row>

      <div style={{ marginBottom: 16, fontSize: 14, color: '#666' }}>
        Showing {startIndex} to {endIndex} of {total} feedbacks
      </div>

      <Table
        columns={columns}
        dataSource={filteredFeedbacks}
        loading={loading}
        rowKey="feedbackId"
        pagination={{
          pageSize,
          current: currentPage,
          total,
          onChange: (page) => setCurrentPage(page),
          showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} feedbacks`,
        }}
        bordered
        scroll={{ x: 1200 }}
        onRow={(record) => ({
          onClick: (e) => {
            const target = e.target;
            const isActionButton = target.closest('button')?.innerText === 'Delete' ||
                                   target.closest('.ant-popconfirm');
            if (!isActionButton) {
              openDetailModal(record);
            }
          },
          style: { cursor: 'pointer' },
        })}
      />

      {/* CHI TIẾT MODAL */}
      <Modal
        title={<Title level={4}>Feedback Details</Title>}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        {modalLoading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Feedback Info */}
            <Card title="Feedback" size="small">
              <Descriptions column={2}>
                <Descriptions.Item label="Rating">
                  <Space>
                    {[...Array(5)].map((_, i) => (
                      <StarOutlined
                        key={i}
                        style={{ color: i < selectedFeedback?.rating ? '#faad14' : '#d9d9d9' }}
                      />
                    ))}
                    <strong>{selectedFeedback?.rating}/5</strong>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Comment">
                  {selectedFeedback?.comment}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Customer Info */}
            {customerInfo && (
              <Card title="Customer Information" size="small">
                <Descriptions column={2}>
                  <Descriptions.Item label="Name">{customerInfo.fullName}</Descriptions.Item>
                  <Descriptions.Item label="Phone">{customerInfo.phone}</Descriptions.Item>
                  <Descriptions.Item label="Email">{customerInfo.email}</Descriptions.Item>
                  <Descriptions.Item label="Address">{customerInfo.address}</Descriptions.Item>
                </Descriptions>
              </Card>
            )}

            {/* Order Info */}
            {orderInfo && (
              <Card title="Order Information" size="small">
                <Descriptions column={2}>
                  <Descriptions.Item label="Order Date">{orderInfo.orderDate}</Descriptions.Item>
                  <Descriptions.Item label="Total Price">
                    {orderInfo.totalPrice?.toLocaleString('vi-VN')}₫
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={orderInfo.status === 'Completed' ? 'green' : 'orange'}>
                      {orderInfo.status}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Note">{orderInfo.note || '—'}</Descriptions.Item>
                </Descriptions>
              </Card>
            )}

            {/* Vehicle Info */}
            {vehicleInfo && (
              <Card title="Vehicle Information" size="small">
                <Descriptions column={2}>
                  <Descriptions.Item label="Model">{vehicleInfo.modelName}</Descriptions.Item>
                  <Descriptions.Item label="Year">{vehicleInfo.year}</Descriptions.Item>
                  <Descriptions.Item label="Color">{vehicleInfo.color}</Descriptions.Item>
                  <Descriptions.Item label="Price">
                    {vehicleInfo.price?.toLocaleString('vi-VN')}₫
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default CustomerFeedback;