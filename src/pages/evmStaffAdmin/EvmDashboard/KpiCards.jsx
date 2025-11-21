import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { CarOutlined, ShopOutlined, DatabaseOutlined } from '@ant-design/icons'; // Import thêm icon

const KpiCards = ({ stats }) => {
  const formatVND = (value) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      {/* Card 1: Số lượng Model xe */}
      <Col span={4}>
        <Card variant="borderless" hoverable>
          <Statistic 
            title="Total Models" 
            value={stats.totalModels} 
            prefix={<CarOutlined style={{ color: '#1890ff' }} />} 
          />
        </Card>
      </Col>

      {/* Card 2: Tồn kho tổng (MỚI THÊM - Tổng hợp toàn bộ) */}
      <Col span={4}>
        <Card variant="borderless" hoverable>
          <Statistic 
            title="Total Stock" 
            value={stats.totalStock} 
            prefix={<DatabaseOutlined style={{ color: '#52c41a' }} />} 
            suffix=" units"
          />
        </Card>
      </Col>

      {/* Card 3: Tồn kho trung tâm */}
      <Col span={4}>
        <Card variant="borderless" hoverable>
          <Statistic 
            title="Central Warehouse" 
            value={stats.totalCentralStock} 
            valueStyle={{ color: '#faad14' }}
            suffix=" units" 
          />
        </Card>
      </Col>

      {/* Card 4: Tồn kho cửa hàng */}
      <Col span={4}>
        <Card variant="borderless" hoverable>
          <Statistic 
            title="In Stores" 
            value={stats.totalStoreStock} 
            valueStyle={{ color: '#13c2c2' }}
            suffix=" units" 
          />
        </Card>
      </Col>

      {/* Card 5: Tổng giá trị */}
      <Col span={4}>
        <Card variant="borderless" hoverable>
          <Statistic 
            title="Total Value" 
            value={formatVND(stats.totalInventoryValue)} 
            valueStyle={{ fontSize: 24 }} // Chỉnh font nhỏ xíu nếu số tiền quá lớn
          />
        </Card>
      </Col>

      {/* Card 6: Số lượng cửa hàng */}
      <Col span={4}>
        <Card variant="borderless" hoverable>
          <Statistic 
            title="Active Stores" 
            value={stats.totalStores} 
            prefix={<ShopOutlined style={{ color: '#722ed1' }} />} 
          />
        </Card>
      </Col>
    </Row>
  );
};

export default KpiCards;