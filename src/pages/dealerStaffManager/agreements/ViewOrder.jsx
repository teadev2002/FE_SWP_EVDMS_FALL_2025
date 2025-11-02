// components/orders/ViewOrder.jsx
import React from 'react';
import { Descriptions, Card, Tag, Empty, Button } from 'antd';

const ViewOrder = ({ order }) => {
  if (!order) {
    return <Empty description="Không có dữ liệu đơn hàng" />;
  }

  const {
    orderId,
    orderDate,
    totalPrice,
    status,
    note,
    customer = {},
    dealer = {},
    store = {},
    quotes = []
  } = order;

  return (
    <Card title={`Chi tiết đơn hàng #${orderId}`} >
      <Descriptions bordered column={1}>
        {/* Thông tin đơn hàng */}
        <Descriptions.Item label="Ngày đặt hàng">
          <strong>{orderDate || 'N/A'}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">
          <strong style={{ color: '#d4380d' }}>
            {totalPrice ? totalPrice.toLocaleString('vi-VN') + ' ₫' : 'N/A'}
          </strong>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={
            status === 'Completed' ? 'green' :
            status === 'Pending' ? 'orange' :
            status === 'Cancelled' ? 'red' : 'blue'
          }>
            {status || 'N/A'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ghi chú">
          {note || <i>Không có ghi chú</i>}
        </Descriptions.Item>

        {/* Thông tin khách hàng */}
        <Descriptions.Item label="Khách hàng">
          <div>
            <div><strong>{customer.fullName || 'N/A'}</strong></div>
            <div>Email: {customer.email || 'N/A'}</div>
            <div>SĐT: {customer.phone || 'N/A'}</div>
            <div>Địa chỉ: {customer.address || 'N/A'}</div>
          </div>
        </Descriptions.Item>

        {/* Thông tin nhân viên */}
        <Descriptions.Item label="Nhân viên phụ trách">
          <div>
            <div><strong>{dealer.fullName || 'N/A'}</strong></div>
            <div>Email: {dealer.email || 'N/A'}</div>
            <div>SĐT: {dealer.phone || 'N/A'}</div>
            <div>Vai trò: {dealer.role || 'N/A'}</div>
          </div>
        </Descriptions.Item>

        {/* Thông tin cửa hàng */}
        <Descriptions.Item label="Cửa hàng">
          <div>
            <div><strong>{store.storeName || 'N/A'}</strong></div>
            <div>Địa chỉ: {store.address || 'N/A'}</div>
            <div>Email: {store.email || 'N/A'}</div>
          </div>
        </Descriptions.Item>

        {/* Báo giá liên quan */}
        <Descriptions.Item label={`Báo giá (${quotes.length})`}>
          {quotes.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {quotes.map((q, idx) => (
                <li key={idx}>
                  Báo giá #{q.quoteId} - {q.vehicle?.modelName || 'Xe'} - {q.status}
                </li>
              ))}
            </ul>
          ) : (
            <i>Chưa có báo giá</i>
          )}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default ViewOrder;