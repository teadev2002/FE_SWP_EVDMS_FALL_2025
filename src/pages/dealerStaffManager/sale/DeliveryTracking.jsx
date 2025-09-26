import React from 'react';
import { Card, Timeline, Typography, Button, Row, Col, Space } from 'antd';
import { EnvironmentOutlined, TruckOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const DeliveryTracking = () => {
  // Updated delivery data for an electric vehicle
  const deliveryData = {
    orderId: 'EV-ORD789012',
    vehicleModel: 'EcoVolt X1 Electric SUV',
    vin: '5YJ3E1EA0MF123456',
    status: 'In Transit',
    estimatedDelivery: '2025-10-05, 16:00',
    currentLocation: 'Regional Distribution Center, City Y',
    deliveryMethod: 'Flatbed Transport',
    trackingHistory: [
      { status: 'Order Placed', time: '2025-09-27, 10:00', location: 'City Y Dealership' },
      { status: 'Vehicle Prepared', time: '2025-09-28, 14:00', location: 'Factory, City Y' },
      { status: 'Shipped from Factory', time: '2025-09-29, 09:00', location: 'Regional Distribution Center, City Y' },
      { status: 'In Transit to Dealership', time: '2025-09-30, 11:00', location: 'City Y' },
    ],
  };

  return (
    <div>
      <Title level={2}>Electric Vehicle Delivery Tracking</Title>
      <Row gutter={[16, 16]}>
        {/* Order Summary Card */}
        <Col xs={24} md={12}>
          <Card
            title="Vehicle Order Details"
            bordered={false}
            style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
          >
            <Space direction="vertical" size="middle">
              <Text strong>Order ID: {deliveryData.orderId}</Text>
              <Text strong>Vehicle Model: {deliveryData.vehicleModel}</Text>
              <Text strong>VIN: {deliveryData.vin}</Text>
              <Text>Status: <span style={{ color: '#1890ff' }}>{deliveryData.status}</span></Text>
              <Text>Estimated Delivery: {deliveryData.estimatedDelivery}</Text>
              <Text>Current Location: {deliveryData.currentLocation}</Text>
              <Text>Delivery Method: {deliveryData.deliveryMethod}</Text>
              <Button type="primary" icon={<EnvironmentOutlined />}>
                View Delivery Route
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Map Placeholder */}
        <Col xs={24} md={12}>
          <Card
            title="Vehicle Location"
            bordered={false}
            style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
          >
            <div
              style={{
                height: 300,
                background: '#f0f2f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
              }}
            >
              <Text type="secondary">Map Integration Placeholder (e.g., Google Maps)</Text>
            </div>
          </Card>
        </Col>

        {/* Tracking Timeline */}
        <Col xs={24}>
          <Card
            title="Delivery Progress"
            bordered={false}
            style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
          >
            <Timeline mode="left">
              {deliveryData.trackingHistory.map((item, index) => (
                <Timeline.Item
                  key={index}
                  dot={
                    index === deliveryData.trackingHistory.length - 1 ? (
                      <TruckOutlined style={{ fontSize: 16, color: '#1890ff' }} />
                    ) : (
                      <CheckCircleOutlined style={{ fontSize: 16, color: '#52c41a' }} />
                    )
                  }
                >
                  <Text strong>{item.status}</Text>
                  <br />
                  <Text type="secondary">{item.time}</Text>
                  <br />
                  <Text type="secondary">{item.location}</Text>
                </Timeline.Item>
              ))}
              <Timeline.Item dot={<ClockCircleOutlined style={{ fontSize: 16, color: '#fa8c16' }} />}>
                <Text strong>Estimated Delivery</Text>
                <br />
                <Text type="secondary">{deliveryData.estimatedDelivery}</Text>
              </Timeline.Item>
            </Timeline>
            </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DeliveryTracking;